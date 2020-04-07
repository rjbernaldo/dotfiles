"use strict"
window.FTX_LEVERAGE = null
window.FTX_SYMBOLS = {}
window.FTX_SYMBOLS_UPDATED = 0

/**
 *
 * @returns {*}
 * @constructor
 */
function FTX() {
	let state = {
		aliases: [
			"FTX",
		],
		endpoint: "https://ftx.com",
		fields: {
			public: {
				label: "API Key",
				message: "",
			},
			private: {
				label: "API Secret",
				message: "",
			},
			subaccount: {
				label: "Subaccount",
				message: "Name of the subaccount to use. Leave empty when not using a subaccount.",
				optional: true,
				type: "text",
			},
		},
		name: "FTX (beta)",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.ftx.com/*",
			],
			permissions: [],
		},
		subscriptions: {
			active: [
				"brnzhjdgkscloyiwtfupevmxaq", // Autoview Bronze
				"brnzvpskjlyxdewhoaguftcqmi", // Autoview Bronze - Yearly
			],
			inactive: [],
		},
		website: "https://ftx.com/#a=1777253",
	}

	function* account() {
		const balances = {}
		const response = (yield* get.call(this, "/wallet/balances")) || []
		for (let i = 0; i < response.length; i++) {
			const balance = response[i]
			balances[balance.coin] = {
				available: balance.free,
				balance: balance.total,
			}
		}

		return balances
	}

	function* get(resource, query, headers) {
		if (typeof query !== "string") {
			query = serialize(query) || null
		}
		if (query) {
			resource += (resource.indexOf("?") === -1) ? "?" : "&"
			resource += query
		}

		return yield* make.call(this, "GET", resource, null, headers)
	}

	function* make(method, resource, parameters, headers) {
		resource = "/api" + resource

		parameters = parameters ? JSON.stringify(parameters) : ""

		headers = headers || {}
		headers["Content-Type"] = "application/json"

		const credentials = yield* this.getExchangeCredentials("private")
		const timestamp = Date.now()
		const signature = () => {
			const data = timestamp + method + resource + parameters
			const sha = new jsSHA("SHA-256", "TEXT")
			sha.setHMACKey(credentials.private, "TEXT")
			sha.update(data)

			return sha.getHMAC("HEX")
		};

		headers["FTX-KEY"] = credentials.public
		headers["FTX-TS"] = timestamp
		headers["FTX-SIGN"] = signature()
		if (credentials.subaccount) {
			headers["FTX-SUBACCOUNT"] = credentials.subaccount
		}

		try {
			const func = method.toLowerCase() + "Request" // e.g. deleteRequest, postRequest
			const response = yield* this[func](state.endpoint + resource, parameters, headers, "json")

			return response.result
		} catch (ex) {
			throw new Error(ex.error)
		}
	}

	function* ordersCancel(order) {
		const resource = order.type === "limit" ? "/orders/" : "/conditional_orders/"

		return yield* make.call(this, "DELETE", resource + order.id)
	}

	function* ordersCancelAll(Command) {
		let orders = yield* ordersOpen.call(this, Command)

		const types = []
		if (Command.ftp || Command.tp) {
			types.push("take_profit")
		}
		if (Command.fsl || Command.sl) {
			types.push("stop")
		}
		if (Command.fts || Command.ts) {
			types.push("trailing_stop")
		}
		orders = orders.filter((order) => {
			const isBid = order.side === "buy"
			if (Command.b && Command.isBid !== isBid) {
				return false // Book mismatch
			}
			if (Command.fp && Command.fp.compare(order.price)) {
				return false // Price mismatch
			}
			if (types.length && !types.includes(order.type)) {
				return false // Type mismatch
			}

			return true
		})

		// Limit the number of cancelled orders by the requested "Cancel Maximum"
		const end = Command.cm.reference(orders.length).resolve(0)
		if (Command.cm.getMax() < orders.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(orders, "id", true)
					break
				case "oldest":
					sortByIndex(orders, "id")
					break
				case "lowest":
					sortByIndex(orders, "price")
					break
				case "highest":
					sortByIndex(orders, "price", true)
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
				const price = order.price || order.orderPrice || order.triggerPrice
				Verbose().info(this.getExchangeName(), order.side, "order", order.size, "@", price, "would be cancelled")
			} else {
				yield * ordersCancel.call(this, order, Command)
			}
		}
	}

	function* ordersOpen(Command) {
		const params = {}
		params.market = Command.s
		const orders = (yield* get.call(this, "/orders", params)) || []
		const triggers = (yield* get.call(this, "/conditional_orders", params)) || []

		return [].concat(orders, triggers)
	}

	function* positionsClose(Command, position) {
		const market = yield* symbolInfo.call(this, Command.s)
		const ticker = yield* symbolTicker.call(this, market)
		const top = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask
		const first = (Command.ps === "breakeven") ? position.recentBreakEvenPrice || position.entryPrice
			: ((Command.ps === "position" || Command.sl || Command.tp || Command.ts) ? position.recentAverageOpenPrice || position.entryPrice : top)
		const price = Command.fp
			? Command.fp.resolve(market.precision)
			: Command.p.relative(first).resolve(market.precision)
		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			Command.q.div(price) // e.g. USD => BTC
		}
		const quantity = Command.q.reference(position.size).resolve(market.quantityPrecision)
		const side = position.side === "buy" ? "sell" : "buy"

		const params = {}
		params.market = market.name
		params.side = side
		params.price = price
		params.type = "limit"
		params.size = quantity
		if (Command.ro) {
			params.reduceOnly = true
		}
		switch (Command.t) {
			case "ioc":
				params.ioc = true
				break
			case "post":
				params.postOnly = true
				break
			case "market":
				params.type = "market"
				params.price = null
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* post.call(this, "/orders", params)
	}

	function* positionsOpen(market) {
		const filterMarket = (position) => position.future === market.name
		const filterSize = (postion) => postion.size > 0 || postion.size < 0
		const query = {}
		query.showAvgPrice = "true"
		const positions = (yield* get.call(this, "/positions", query) || [])

		return positions.filter(filterMarket).filter(filterSize)
	}

	/**
	 * Note: One position per symbol
	 * @param Command
	 */
	function* positionsCloseAll(Command) {
		const market = yield* symbolInfo.call(this, Command.s)
		let positions = yield* positionsOpen.call(this, market)
		positions = positions.filter((position) => {
			const isBid = position.side === "buy"
			if (Command.b && Command.isBid !== isBid) {
				return false // Book mismatch
			}
			if (Command.fp && Command.fp.compare(position.entryPrice)) {
				return false // Price mismatch
			}

			return true
		})

		// Limit the number of closed positions by the requested "Close Maximum"
		const end = Command.cm.reference(positions.length).resolve(0)
		if (Command.cm.getMax() < positions.length) {
			switch (Command.cmo) {
				case "newest":
				case "oldest":
					Verbose().error(this.getExchangeName(), "does not support sort method:", Command.cmo)
					break
				case "lowest":
					sortByIndex(positions, "entryPrice")
					break
				case "highest":
					sortByIndex(positions, "entryPrice", true)
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

	function* post(resource, parameters, headers) {
		return yield* make.call(this, "POST", resource, parameters, headers)
	}

	function* setLeverage(leverage) {
		if (window.FTX_LEVERAGE === leverage) {
			return true
		}

		window.FTX_LEVERAGE = leverage

		const params = {}
		params.leverage = leverage

		return yield* post.call(this, "/account/leverage", params)
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 900000 // 15 minutes
		if (window.FTX_SYMBOLS_UPDATED < expired) {
			const markets = yield* get.call(this, "/markets")
			for (let i = 0; i < markets.length; i++) {
				const market = markets[i]
				market.pricePrecision = decimals(market.priceIncrement)
				market.quantityPrecision = decimals(market.sizeIncrement)

				window.FTX_SYMBOLS[market.name] = market
				window.FTX_SYMBOLS_UPDATED = Date.now()
			}
		}

		if (!window.FTX_SYMBOLS.hasOwnProperty(symbol)) {
			throw new Error("Symbol not supported: " + symbol)
		}

		return window.FTX_SYMBOLS[symbol]
	}

	function* symbolTicker(market) {
		let result;
		switch (market.type) {
			case "future":
				result = yield* get.call(this, "/futures/" + market.name)
				break
			case "spot":
				result = yield* get.call(this, "/markets/" + market.name)
				break
			default:
				throw new Error("Market Type (" + market.type + ") is currently not supported.")
		}

		return result
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const conditional = Command.ftp || Command.tp || Command.fsl || Command.sl || Command.fts || Command.ts
		const market = yield* symbolInfo.call(this, Command.s)
		const ticker = yield* symbolTicker.call(this, market)
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask
		const price = (Command.fp ? Command.fp : Command.p.relative(first)).stepping(market.priceIncrement, Math.round).resolve(market.pricePrecision)
		const side = Command.isBid ? "buy" : "sell"

		const balances = yield* account.call(this)
		if (market.type === "move" || ticker.type === "move") {
			balances[market.underlying] = (market.index && balances.USD) ? balances.USD / market.index : 0.0
		}
		const currencyKey = market.type === "spot" ? (Command.isBid ? "quoteCurrency" : "baseCurrency") : "underlying"
		const currency = (ticker.type === "move" || ticker.type === "perpetual") ? "USD" : market[currencyKey]
		if (!balances.hasOwnProperty(currency)) {
			throw new ReferenceError("Account Balance (" + currency + ") not available.")
		}
		const balance = Command.y === "equity" ? balances[currency].balance : balances[currency].available
		const leverage = Command.l || 1
		const available = (balance * leverage) /  (market.type !== "spot" || Command.isBid ? price : 1)

		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			Command.q.div(price) // e.g. USD => BTC, ETH
		}

		const params = {}
		params.market = market.name
		params.side = side
		params.price = price
		params.type = "limit"
		params.size = Command.q.reference(available).stepping(market.sizeIncrement).resolve(market.quantityPrecision)
		if (Command.ro) {
			params.reduceOnly = true
		}
		switch (Command.t) {
			case "ioc":
				params.ioc = true
				break
			case "post":
				params.postOnly = true
				break
			case "market":
				params.type = "market"
				params.price = null
		}

		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.type = "takeProfit"
			params.triggerPrice = tp.resolve(market.pricePrecision)
			params.orderPrice = price
		}
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.type = "stop"
			params.triggerPrice = sl.resolve(market.pricePrecision)
			params.orderPrice = price
		}
		if (Command.fts || Command.ts) {
			const ts = Command.fts ? Command.fts : Command.ts.reference(first)
			params.type = "trailingStop"
			if (side === "sell") {
				ts.mul(-1) // negative for "sell"; positive for "buy"
			}
			params.trailValue = ts.resolve(market.pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		// Adjust account leverage
		if (Command.hasOwnProperty("l")) {
			yield* setLeverage.call(this, leverage)
		}

		return yield* post.call(this, conditional ? "/conditional_orders" : "/orders", params)
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
