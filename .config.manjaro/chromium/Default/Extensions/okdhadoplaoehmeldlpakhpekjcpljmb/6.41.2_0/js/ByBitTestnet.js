"use strict"
window.BYBIT_LISTENER = window.BYBIT_LISTENER || false
window.BYBIT_TESTNET_LEVERAGE = {}
window.BYBIT_TESTNET_SYMBOLS = {}
window.BYBIT_TESTNET_SYMBOLS_UPDATED = 0

/**
 *
 * @returns {*}
 * @constructor
 */
function ByBitTestnet() {
	const recvWindow = 5000 // 5 seconds

	let state = {
		aliases: [
			"BYBITTESTNET",
			"BYBIT-TESTNET",
		],
		endpoint: "https://api-testnet.bybit.com/",
		fields: {
			public: {
				label: "API Key",
				message: "",
			},
			private: {
				label: "Private Key",
				message: "",
			},
		},
		name: "ByBit Testnet (beta)",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.bybit.com/*"
			],
			permissions: [
				"webRequest",
				"webRequestBlocking",
			],
		},
		subscriptions: {
			active: [],
			inactive: [],
		},
		website: "https://testnet.bybit.com/app/register?ref=AD8nz",
	}

	function* account() {
		const positions = (yield* get.call(this, "/position/list") || [])
		let balances = {}
		for (let i = 0; i < positions.length; i++) {
			const position = positions[i]
			balances[position.symbol] = position.wallet_balance
		}

		return balances
	}

	function addRequestListener() {
		if (!window.BYBIT_LISTENER) {
			window.BYBIT_LISTENER = true

			chrome.webRequest.onBeforeSendHeaders.addListener(
				function (details) {
					const requestHeaders = details.requestHeaders
					const headers = requestHeaders.map((header) => header.name)
					const i = headers.indexOf("Referer")
					if (i === -1) {
						requestHeaders.push({
							name: "Referer",
							value: "Autoview",
						})
					} else {
						requestHeaders[i].value = "Autoview"
					}

					return {
						requestHeaders,
					}
				},
				{
					urls: [
						"https://*.bybit.com/*",
					],
				},
				[
					"blocking",
					"extraHeaders",
					"requestHeaders",
				]
			)
		}
	}

	function* get(resource, query) {
		return yield* make.call(this, "GET", resource, query)
	}

	function* make(method, resource, parameters) {
		parameters = parameters || {}
		resource = state.endpoint + resource.replace(/^\/+/, "")

		if (!resource.includes("/public/")) {
			const credentials = yield* this.getExchangeCredentials("private")
			const timestamp = Date.now()
			const signature = (data) => {
				let sha = new jsSHA("SHA-256", "TEXT")
				sha.setHMACKey(credentials.private, "TEXT")
				sha.update(data)

				return sha.getHMAC("HEX")
			}

			parameters.api_key = credentials.public
			parameters.timestamp = timestamp
			parameters.recv_window = recvWindow

			const data = []
			Object.keys(parameters).sort().forEach((key) => {
				data.push(key + "=" + parameters[key])
			})
			const string = data.join("&")

			parameters = string + "&sign=" + signature(string)
		}

		const headers = {}
		headers["Content-Type"] = "application/x-www-form-urlencoded"

		try {
			addRequestListener()

			const func = method.toLowerCase() + "Request"
			const response = yield* this[func](resource, parameters, headers, "json")

			if (!response || !response.hasOwnProperty("result")) {
				throw new Error("Unexpected response received.")
			}
			if (response.ret_code < 0 || response.ret_code > 0) {
				const errno = response.ext_code || response.ret_code
				throw new Error("#" + errno  + ": " + response.ret_msg)
			}

			return response.result
		} catch (ex) {
			Verbose().info(this.getExchangeName(), ex.message)
			throw new Error(ex.message)
		}
	}

	function* ordersCancel(order) {
		let params = {}
		params.symbol = order.symbol
		params.order_id = order.order_id

		const response = yield* post.call(this, "/open-api/order/cancel", params)

		return response.order_id === order.order_id
	}

	function* ordersCancelAll(Command) {
		let orders = yield* ordersOpen.call(this, Command.s)
		const side = Command.isBid ? "Buy" : "Sell"

		orders = orders.filter((order) => {
			if (Command.b && order.side !== side) {
				return false // Buy, Sell
			}
			if (Command.fp && Command.fp.compare(order.price)) {
				return false // Price mismatch
			}

			return true
		})

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
					sortByIndex(orders, "price")
					break
				case "highest":
					sortByIndex(orders, "price", true)
					break
				case "smallest":
					sortByIndex(orders, "qty")
					break
				case "biggest":
					sortByIndex(orders, "qty", true)
					break
				case "random":
					shuffle(orders)
			}
			orders = orders.slice(0, end)
		}

		for (let i = 0; i < orders.length; i++) {
			const order = orders[i]
			if (Command.d) {
				Verbose().info(this.getExchangeName(), "order", order.qty, "@", order.price, "would be cancelled.")
			} else {
				yield* ordersCancel.call(this, order)
			}
		}
	}

	function* ordersOpen(symbol) {
		let next = true
		const orders = []
		const params = {}
		params.order_status = "Created,New,PartiallyFilled" // Created, New, PartiallyFilled, Filled, Cancelled, Rejected
		params.page = 0
		params.symbol = symbol
		do {
			params.page++
			const response = yield* get.call(this, "/open-api/order/list", params)
			if (response.data) {
				response.data.forEach((order) => orders.push(order))
			}
			const pages = Math.max(1, response.total)
			next = params.page < pages
		} while (next)

		return orders
	}

	function* positionsClose(Command, position) {
		const market = yield* symbolInfo.call(this, Command.s)
		const ticker = yield* symbolTicker.call(this, market.symbol)
		const top = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid_price : ticker.ask_price
		const first = (Command.ps === "position" || Command.sl || Command.tp) ? position.entry_price : top
		const pricePrecision = market.price_scale + Number(market.price_filter.tick_size)
		const quantityPrecision = market.qty_step < 1 ? market.qty_step : 0
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)

		if (Command.q.getIsPercent()) {
			Command.q.reference(position.size)
		} else {
			if (Command.u === "currency") {
				Command.q.mul(position.leverage).mul(price).highest(position.size)
			}
		}

		const params = {}
		params.side = position.side === "Sell" ? "Buy" : "Sell"
		params.symbol = position.symbol
		params.order_type = Command.t === "market" ? "Market" : "Limit"
		params.qty = Command.q.resolve(quantityPrecision)
		params.price = price
		// time_in_force: GoodTillCancel, ImmediateOrCancel, FillOrKill, PostOnly
		switch (Command.t) {
			case "fok":
				params.time_in_force = "FillOrKill"
				break
			case "ioc":
				params.time_in_force = "ImmediateOrCancel"
				break
			case "market":
				break
			case "post":
				params.time_in_force = "PostOnly"
				break
			default:
				params.time_in_force = "GoodTillCancel"
		}
		if (Command.ro) {
			params.reduce_only = true
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* post.call(this, "/open-api/order/create", params)
	}

	function* positionsCloseAll(Command) {
		let positions = yield* positionsOpen.call(this, Command.s)
		const side = Command.isBid ? "Buy" : "Sell"

		positions = positions.filter((position) => {
			if (Command.b && position.side !== side) {
				return false // Book mismatch
			}
			if (Command.l && position.leverage !== Command.l) {
				return false // Leverage mismatch
			}

			return true
		})

		// Limit the number of closed positions by the requested "Close Maximum"
		const end = Command.cm.reference(positions.length).resolve(0)
		if (Command.cm.getMax() < positions.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(positions, "created_at", true)
					break
				case "oldest":
					sortByIndex(positions, "created_at")
					break
				case "lowest":
					sortByIndex(positions, "entry_price")
					break
				case "highest":
					sortByIndex(positions, "entry_price", true)
					break
				case "smallest":
					sortByIndex(positions, "size")
					break
				case "biggest":
					sortByIndex(positions, "size", true)
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

	function* positionsOpen(symbol) {
		const positions = (yield* get.call(this, "/position/list") || [])

		return positions.filter((position) => position.side !== "None" && position.symbol === symbol)
	}

	function* post(resource, parameters, security) {
		return yield* make.call(this, "POST", resource, parameters, security)
	}

	function* setLeverage(symbol, leverage) {
		if (window.BYBIT_TESTNET_LEVERAGE[state.account] === leverage) {
			return true
		}

		window.BYBIT_TESTNET_LEVERAGE[state.account] = leverage

		let params = {}
		params.symbol = symbol
		params.leverage = leverage

		// TODO 10011: "Origin header invalid."
		return yield* post.call(this, "/user/leverage/save", params)
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 900000 // 15 minutes
		if (window.BYBIT_TESTNET_SYMBOLS_UPDATED < expired) {
			const response = yield* get.call(this, "/v2/public/symbols")
			response.forEach((info) => {
				info.symbol = info.name

				window.BYBIT_TESTNET_SYMBOLS[info.name] = info
				window.BYBIT_TESTNET_SYMBOLS_UPDATED = Date.now()
			})
		}

		if (symbol) {
			if (!window.BYBIT_TESTNET_SYMBOLS.hasOwnProperty(symbol)) {
				throw new Error("Unknown market symbol: " + symbol)
			}
			return window.BYBIT_TESTNET_SYMBOLS[symbol]
		}

		return window.BYBIT_TESTNET_SYMBOLS
	}

	function* symbolTicker(symbol) {
		const tickers = yield* get.call(this, "/v2/public/tickers")
		for (let i = 0; i < tickers.length; i++) {
			const ticker = tickers[i]
			if (ticker.symbol === symbol) {
				return ticker
			}
		}

		throw new Error("Symbol Ticker not found: " + symbol)
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const market = yield* symbolInfo.call(this, Command.s)
		const ticker = yield* symbolTicker.call(this, market.symbol)
		const balances = yield* account.call(this)
		const leverage = Command.l || 1
		const available = balances[Command.s] * leverage
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid_price : ticker.ask_price
		const pricePrecision = market.price_scale + Number(market.price_filter.tick_size)
		const quantityPrecision = market.qty_step < 1 ? market.qty_step : 0
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)

		if (Command.q.getIsPercent()) {
			Command.q.reference(available)
			Command.q.mul(price)
		} else {
			if (Command.u === "currency") {
				// main => pair
				Command.q.mul(price)
			}
		}
		const quantity = Command.q.resolve(quantityPrecision)

		const params = {}
		params.side = Command.isBid ? "Buy" : "Sell"
		params.symbol = Command.s
		params.order_type = Command.t === "market" ? "Market" : "Limit"
		params.qty = quantity
		params.price = price
		// time_in_force: GoodTillCancel, ImmediateOrCancel, FillOrKill, PostOnly
		switch (Command.t) {
			case "fok":
				params.time_in_force = "FillOrKill"
				break
			case "ioc":
				params.time_in_force = "ImmediateOrCancel"
				break
			case "market":
				break
			case "post":
				params.time_in_force = "PostOnly"
				break
			default:
				params.time_in_force = "GoodTillCancel"
		}
		if (Command.ro) {
			params.reduce_only = true
		}
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.stop_loss = sl.resolve(pricePrecision)
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.take_profit = tp.resolve(pricePrecision)
		}
		if (Command.fts || Command.ts) {
			const ts = Command.fts ? Command.fts : Command.ts.reference(first).abs()
			params.trailing_stop = ts.resolve(pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		// Adjust market leverage
		// if (Command.hasOwnProperty("l")) {
		// 	yield* setLeverage.call(this, market.symbol, leverage)
		// }

		return yield* post.call(this, "/open-api/order/create", params)
	}


	return Object.assign(
		{},
		Exchange(state),
		{
			exchangeOrdersCancelAll: ordersCancelAll,
			exchangePositionsCloseAll: positionsCloseAll,
			exchangeTrade: trade,
			getExchangeTestCommand: testCommand,
		},
	)
}
