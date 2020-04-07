"use strict"
window.DELTA_TESTNET_SYMBOLS = {}
window.DELTA_TESTNET_SYMBOLS_UPDATED = 0
/**
 *
 * @returns {*}
 * @constructor
 */
function DeltaTestnet() {
	let state = {
		aliases: [
			"DELTATESTNET",
			"DELTA-TESTNET",
		],
		endpoint: "https://testnet-api.delta.exchange",
		fields: {
			public: {
				label: "API Key",
				message: "",
			},
			private: {
				label: "API Secret",
				message: "",
			}
		},
		name: "Delta Testnet",
		patterns: [],
		permissions: {
			origins: [
				"https://*.delta.exchange/*",
			],
			permissions: [],
		},
		subscriptions: {
			active: [],
			inactive: [],
		},
		website: "https://testnet.delta.exchange",
	}

	function* account() {
		const wallets = yield* get.call(this, "/wallet/balances")
		let balances = {}
		wallets.forEach(wallet => {
			balances[wallet.asset.symbol] = {
				available: wallet.available_balance,
				balance: wallet.balance,
			}
		})

		return balances
	}

	function* get(resource, query, headers) {
		query = query || null

		if (query) {
			resource = resource + "?" + serialize(query)
		}

		return yield* make.call(this, "GET", resource, null, headers)
	}


	function* make(method, resource, parameters, headers) {
		parameters = parameters ? JSON.stringify(parameters) : ""

		if (!resource.includes("/products")) {
			const credentials = yield* this.getExchangeCredentials("private")
			const timestamp = Math.floor(Date.now() / 1000) // Seconds
			const data = method + timestamp + resource + parameters

			headers = headers || {}
			headers["Content-Type"] = "application/json"
			headers["api-key"] = credentials.public
			headers["signature"] = signature(credentials, data)
			headers["timestamp"] = timestamp
		}

		resource = state.endpoint + resource

		try {
			const func = method.toLowerCase() + "Request" // e.g. deleteRequest, postRequest
			const response = yield* this[func](resource, parameters, headers, "json")

			return response
		} catch (ex) {
			if (ex.hasOwnProperty("error")) {
				throw new Error(ex.error.message)
			}
			if (ex.hasOwnProperty("errors")) {
				const error = ex.errors[0]
				throw new Error(error.msg)
			}
			throw new Error("An unknown error has occurred.")
		}
	}

	function* ordersCancel(order) {
		let params = {} // DeleteOrderRequest
		params.id = order.id
		params.product_id = order.product.id

		return yield* make.call(this, "DELETE", "/orders", params)
	}

	function* ordersCancelAll(Command) {
		let orders = yield* ordersOpen.call(this, Command)

		// Limit the number of cancelled orders by the requested "Cancel Maximum"
		const end = Command.cm.reference(orders.length).resolve(0)
		if (Command.cm.getMax() < orders.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(orders, "created_at", true)
					break
				case "oldest":
					sortByIndex(orders, "created_at")
					break
				case "lowest":
					sortByIndex(orders, "limit_price")
					break
				case "highest":
					sortByIndex(orders, "limit_price", true)
					break
				case "smallest":
					sortByIndex(orders, "size")
					break
				case "biggest":
					sortByIndex(orders, "size", true)
					break
				case "random":
					shuffle(orders)
			}
			orders = orders.slice(0, end)
		}

		for (let i = 0; i < orders.length; i++) {
			const order = orders[i]
			if (Command.d) {
				Verbose().info(this.getExchangeName(), "order", order.size, "@", order.limit_price, "would be cancelled.")
			} else {
				yield* ordersCancel.call(this, order, Command)
			}
		}
	}

	function* ordersOpen(Command) {
		const market = yield* symbolInfo.call(this, Command.s)

		let params = {}
		params.product_id = market.id
		params.state = "open"

		const openOrders = yield* get.call(this, "/orders", params)
		const orders = openOrders.filter((order) => {
			if (Command.b && order.side !== (Command.isBid ? "buy" : "sell")) {
				return false // Order Side mismatch
			}
			if (Command.hasParameter("t")) {
				switch (Command.t) {
					case "limit":
					case "market":
						if (!order.includes(Command.t)) {
							return false // Order Type mismatch (e.g. limit, market)
						}
				}
			}

			return true
		})

		return orders
	}

	function* positionsClose(Command, position) {
		const market = yield* symbolInfo.call(this, Command.s)
		const asset = market.underlying_asset
		const ticker = yield* symbolTicker.call(this, market)
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market"))
			? ticker.bidPrice : ticker.askPrice
		const price = Command.fp
			? Command.fp.resolve(market.precision)
			: Command.p.relative(first).resolve(market.precision)
		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			// main => pair
			Command.q.div(price)
		}
		const size = Command.q.reference(Math.abs(position.size)).resolve(asset.precision)
		const side = Command.q.compare(0) === -1 ? "buy" : "sell"

		let params = {} // CreateOrderRequest
		params.product_id = market.id
		switch (Command.t) {
			case "ioc":
			case "fok":
			case "gtc":
				params.time_in_force = Command.t
				break
			case "market":
				params.order_type = "market_order"
				break
			case "limit":
			default:
				params.limit_price = price
				params.order_type = "limit_order"
				params.time_in_force = "gtc"
		}
		params.size = size
		params.side = side

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false
		}

		const order = yield* post.call(this, "/orders", params)

		return order
	}

	/**
	 * Note: One position per symbol
	 * @param Command
	 */
	function* positionsCloseAll(Command) {
		const market = yield* symbolInfo.call(this, Command.s)
		let positions = yield* get.call(this, "/positions")

		positions = positions.filter((position) => {
			if (position.product.id !== market.id) {
				return false // Market mismatch
			}
			if (Command.isBid && position.size < 0) {
				return false // Book mismatch
			}
			if (Command.isAsk && position.size > 0) {
				return false // Book mismatch
			}
			if (Command.fp && !Command.fp.compare(position.entry_price)) {
				return false // Price mismatch
			}

			return true
		})

		// Limit the number of closed positions by the requested "Close Maximum"
		const end = Command.cm.reference(positions.length).resolve(0)
		if (Command.cm.getMax() < positions.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(positions, "timestamp", true)
					break
				case "oldest":
					sortByIndex(positions, "timestamp")
					break
				case "lowest":
					sortByIndex(positions, "entry_price")
					break
				case "highest":
					sortByIndex(positions, "entry_price", true)
					break
				case "smallest":
				case "biggest":
					Verbose().error(this.getExchangeName(), "does not support sort method:", Command.cmo)
					break
				case "random":
					shuffle(positions)
			}
			positions = positions.slice(0, end)
		}

		for (let i = 0; i < positions.length; i++) {
			yield* positionsClose.call(this, Command, positions[i])
		}
	}

	function* post(resource, parameters, headers) {
		return yield* make.call(this, "POST", resource, parameters, headers)
	}

	function signature(credentials, data) {
		let sha = new jsSHA("SHA-256", "TEXT")
		sha.setHMACKey(credentials.private, "TEXT")
		sha.update(data)

		return sha.getHMAC("HEX")
	}

	function symbolCreate(base) {
		const d = new Date()
		// Quarterly
		const months = [
			[2, "Mar"],
			[5, "Jun"],
			[8, "Sep"],
			[11, "Dec"],
		]
		const month = Math.floor(d.getMonth() / 3)
		// Last Friday of the month
		d.setMonth(months[month][0] + 1)
		d.setDate(1)
		while (d.getDay() !== 5) {
			d.setDate(d.getDate() - 1)
		}
		const date = d.getDate()

		return base + "_" + date + months[month][1]
	}

	function* setLeverage(market, leverage) {
		if (!market.leverage_slider_values.includes(leverage)) {
			throw new Error("Market does not support leverage value: " + leverage)
		}

		let params = {}
		params.product_id = market.id
		params.leverage = leverage

		return yield* post.call(this, "/orders/leverage", params)
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 900000 // 15 minutes
		if (window.DELTA_TESTNET_SYMBOLS_UPDATED < expired) {
			const products = (yield* get.call(this, "/products")) || []
			products.forEach((product) => {
				product.precision = product.underlying_asset.precision + Number(product.tick_size)
				const key = product.symbol.toUpperCase()
				window.DELTA_TESTNET_SYMBOLS[key] = product
				window.DELTA_TESTNET_SYMBOLS_UPDATED = Date.now()
			})
		}

		if (!window.DELTA_TESTNET_SYMBOLS.hasOwnProperty(symbol)) {
			throw new Error("Symbol not found: " + symbol)
		}

		return window.DELTA_TESTNET_SYMBOLS[symbol]
	}

	function* symbolTicker(market) {
		const resource = "/orderbook/" + market.id + "/l2"
		const response = yield* get.call(this, resource)
		const asks = response.sell_book || []
		const bids = response.buy_book || []
		const topAsk = asks.length ? asks[0].price : 0.0
		const topBid = bids.length ? bids[0].price : 0.0
		const last = response.last_trade.price || 0.0

		return {
			askPrice: topAsk,
			bidPrice: topBid,
			last: last,
		}
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const market = yield* symbolInfo.call(this, Command.s)
		const asset = market.underlying_asset
		const balances = yield* account.call(this)
		if (!balances || !balances.hasOwnProperty(asset.symbol)) {
			throw new ReferenceError("Account Balance (" + asset.symbol + ") not available.")
		}
		const balance = balances[asset.symbol]
		const available = Command.y === "equity" ? balance.balance : balance.available
		const leverage = Command.l || market.default_leverage || 1
		const ticker = yield* symbolTicker.call(this, market)
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market"))
			? ticker.bidPrice : ticker.askPrice
		const price = Command.fp
			? Command.fp.resolve(market.precision)
			: Command.p.relative(first).resolve(market.precision)
		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			// main => pair
			Command.q.div(price)
		}
		const size = Command.q.reference(available).resolve(asset.precision)
		const side = Command.isBid ? "buy" : "sell"

		if (Command.q.compare(0) === 0) {
			throw new Error("Order quantity resolved to an invalid value: " + size)
		}

		let params = {} // CreateOrderRequest
		params.product_id = market.id
		switch (Command.t) {
			case "ioc":
			case "fok":
			case "gtc":
				params.time_in_force = Command.t
				break
			case "market":
				params.order_type = "market_order"
				break
			case "limit":
			default:
				params.limit_price = price
				params.order_type = "limit_order"
				params.time_in_force = "gtc"
		}
		params.size = size
		params.side = side

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		// Adjust market leverage
		if (Command.hasOwnProperty("l")) {
			yield* setLeverage.call(this, market, leverage)
		}

		const order = yield* post.call(this, "/orders", params)

		return order
	}


	return Object.assign(
		{},
		Exchange(state),
		{
			exchangeOrdersCancelAll: ordersCancelAll,
			exchangePositionsCloseAll: positionsCloseAll,
			exchangeTrade: trade,
			getExchangeTestCommand: testCommand,
		}
	)
}
