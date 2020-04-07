"use strict"
window.BINANCE_FUTURES_TESTNET_SYMBOLS = {}
window.BINANCE_FUTURES_TESTNET_SYMBOLS_UPDATED = 0
/**
 *
 * @returns {*}
 * @constructor
 */
function BinanceFuturesTestnet() {
	const recvWindow = 5000 // 5 seconds

	const SECURITY_NONE = 0
	const SECURITY_TRADE = 1 // SIGNED endpoint
	const SECURITY_USER_DATA = 2 // SIGNED endpoint
	const SECURITY_USER_STREAM = 4
	const SECURITY_MARGIN = 16 // SIGNED endpoint
	const SECURITY_MARKET_DATA = 8

	let state = {
		aliases: [
			"BINANCEFUTURESTESTNET",
			"BINANCE-FUTURESTESTNET",
			"BINANCEFUTURES-TESTNET",
			"BINANCE-FUTURES-TESTNET",
		],
		endpoint: "https://testnet.binancefuture.com/",
		fields: {
			public: {
				label: "API Key",
				message: "",
			},
			private: {
				label: "API Secret",
				message: "",
			},
		},
		name: "Binance Futures Testnet",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.binancefuture.com/*"
			],
		},
		subscriptions: {
			active: [],
			inactive: [],
		},
		website: "https://testnet.binancefuture.com/",
	}

	function* account() {
		const params = {}
		const account = yield* get.call(this, "/fapi/v1/account", params, SECURITY_USER_DATA)

		let balances = {}
		for (let i = 0; i < account.assets.length; i++) {
			const asset = account.assets[i]
			balances[asset.asset] = {
				available: Number(asset.maxWithdrawAmount),
				balance: Number(asset.marginBalance),
			}
		}

		return balances
	}

	function* get(resource, query, security) {
		return yield* make.call(this, "GET", resource, query, security)
	}

	function* make(method, resource, parameters, security) {
		parameters = parameters || {}
		resource = state.endpoint + resource.replace(/^\/+/, "")

		const credentials = yield* this.getExchangeCredentials("private")
		const func = method.toLowerCase() + "Request"
		const signature = () => {
			let sha = new jsSHA("SHA-256", "TEXT")
			sha.setHMACKey(credentials.private, "TEXT")
			sha.update(serialize(parameters))

			return sha.getHMAC("HEX")
		}
		const SIGNED = (security & SECURITY_TRADE || security & SECURITY_USER_DATA)

		if (SIGNED) {
			parameters.timestamp = Date.now()
			parameters.recvWindow = recvWindow

			parameters.signature = signature()
		}

		let headers = {}
		headers["Content-Type"] = "application/x-www-form-urlencoded"
		headers["X-MBX-APIKEY"] = credentials.public

		try {
			const response = yield* this[func](resource, parameters, headers, "json")

			return response
		} catch (ex) {
			Verbose().info(this.getExchangeName(), ex)
			throw new Error("#" + ex.code + ": " + ex.msg)
		}
	}

	function* ordersCancel(order) {
		let params = {}
		params.symbol = order.symbol
		params.orderId = order.orderId

		const response = yield* make.call(this, "DELETE", "/fapi/v1/order", params, SECURITY_TRADE)

		return response.orderId === order.orderId
	}

	function* ordersCancelAll(Command) {
		const market = yield* symbolInfo.call(this, Command.s)
		let orders = yield* ordersOpen.call(this, market.symbol)
		const side = Command.isBid ? "BUY" : "SELL"

		orders = orders.filter((order) => {
			if (Command.b && order.side !== side) {
				return false // BUY, SELL
			}
			if (Command.fp && Command.fp.compare(order.price)) {
				return false // Price mismatch
			}
			if (Command.t === "open" && order.type !== "LIMIT") {
				return false // Order Type mismatch
			}
			if (Command.t === "close" && order.type === "LIMIT") {
				return false // Order Type mismatch (e.g. STOP, TAKE_PROFIT)
			}

			return true
		})

		// Limit the number of cancelled orders by the requested "Cancel Maximum"
		const end = Command.cm.reference(orders.length).resolve(0)
		if (Command.cm.getMax() < orders.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(orders, "updateTime", true)
					break
				case "oldest":
					sortByIndex(orders, "updateTime")
					break
				case "lowest":
					sortByIndex(orders, "price")
					break
				case "highest":
					sortByIndex(orders, "price", true)
					break
				case "smallest":
					sortByIndex(orders, "origQty")
					break
				case "biggest":
					sortByIndex(orders, "origQty", true)
					break
				case "random":
					shuffle(orders)
			}
			orders = orders.slice(0, end)
		}

		for (let i = 0; i < orders.length; i++) {
			const order = orders[i]
			if (Command.d) {
				Verbose().info(this.getExchangeName(), "order", order.origQty, "@", order.price, "would be cancelled.")
			} else {
				yield* ordersCancel.call(this, order)
			}
		}
	}

	function* ordersOpen(symbol) {
		const params = {}
		params.symbol = symbol

		return yield* get.call(this, "/fapi/v1/openOrders", params, SECURITY_USER_DATA)
	}

	function* positionsOpen(symbol) {
		const response = yield* get.call(this, "/fapi/v1/positionRisk", null, SECURITY_USER_DATA)
		const positions = response.filter((position) => position.symbol === symbol && Math.abs(position.positionAmt) > 0)

		return positions
	}

	function* positionsClose(Command, position) {
		const market = yield* symbolInfo.call(this, Command.s)
		const ticker = yield* symbolTicker.call(this, market.symbol)
		const top = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bidPrice : ticker.askPrice
		const first = (Command.ps === "position" || Command.sl || Command.tp) ? position.entryPrice : top
		const pricePrecision = market.filters.hasOwnProperty("PRICE_FILTER") ? decimals(market.filters.PRICE_FILTER.tickSize) : 8
		const quantityPrecision = market.filters.hasOwnProperty("LOT_SIZE") ? decimals(market.filters.LOT_SIZE.stepSize) : 8
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)
		const isBid = position.positionAmt > 0

		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			// main => pair
			Command.q.div(price)
		}

		const quantity = Command.q.reference(Math.abs(position.positionAmt)).resolve(quantityPrecision)

		const params = {}
		params.symbol = market.symbol
		params.side = isBid ? "SELL" : "BUY"
		params.type = Command.t === "market" ? "MARKET" : "LIMIT"
		params.quantity = quantity
		switch (Command.t) {
			case "fok":
				params.price = price
				params.timeInForce = "FOK" // GTC, IOC, FOK
				break
			case "ioc":
				params.price = price
				params.timeInForce = "IOC" // GTC, IOC, FOK
				break
			case "market":
				break;
			default:
				params.price = price
				params.timeInForce = "GTC" // GTC, IOC, FOK
		}
		if (Command.ro) {
			params.reduceOnly = true
		}

		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.type = Command.t === "market" ? "STOP_MARKET" : "STOP"
			params.stopPrice = sl.resolve(pricePrecision)
		}
		if (Command.fsl || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.type = Command.t === "market" ? "TAKE_PROFIT_MARKET" : "TAKE_PROFIT"
			params.stopPrice = tp.resolve(pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* post.call(this, "/fapi/v1/order", params, SECURITY_TRADE)
	}

	function* positionsCloseAll(Command) {
		let positions = yield* positionsOpen.call(this, Command.s)
		positions = positions.filter((position) => {
			const isBid = position.positionAmt > 0
			if (Command.b && Command.isBid !== isBid) {
				return false // Book mismatch
			}
			if (Command.l && position.leverage != Command.l) {
				return false // Leverage mismatch
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
					sortByIndex(positions, "positionAmt")
					break
				case "biggest":
					sortByIndex(positions, "positionAmt", true)
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

	function* post(resource, parameters, security) {
		return yield* make.call(this, "POST", resource, parameters, security)
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 900000 // 15 minutes
		if (window.BINANCE_FUTURES_TESTNET_SYMBOLS_UPDATED < expired) {
			const response = yield* get.call(this, "/fapi/v1/exchangeInfo")
			response.symbols.forEach((info) => {
				let filters = {}
				info.filters.forEach((filter) => {
					filters[filter.filterType] = filter
				})
				info.filters = filters

				window.BINANCE_FUTURES_TESTNET_SYMBOLS[info.symbol] = info
				window.BINANCE_FUTURES_TESTNET_SYMBOLS_UPDATED = Date.now()
			})
		}

		if (symbol) {
			if (!window.BINANCE_FUTURES_TESTNET_SYMBOLS.hasOwnProperty(symbol)) {
				throw new Error("Unknown market symbol: " + symbol)
			}
			return window.BINANCE_FUTURES_TESTNET_SYMBOLS[symbol]
		}

		return window.BINANCE_FUTURES_TESTNET_SYMBOLS
	}

	function* symbolTicker(symbol) {
		const query = {}
		query.symbol = symbol

		return yield* get.call(this, "/fapi/v1/ticker/bookTicker", query)
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* time() {
		const response = yield* this.getRequest(state.endpoint + "fapi/v1/time", null, null, "json")
		const epoch = Date.now()
		const offset = (epoch - response.serverTime) / 1000

		Verbose().info(this.getExchangeName(), "time", response.serverTime, "Autoview time", epoch, "Offset", offset, "seconds")

		if (offset > 1) {
			Verbose().error("Your computer's clock is too far into the future for Binance Futures Testnet (> 1 second)")
		}
		if (offset < -recvWindow / 1000) {
			Verbose().error("Your computer's clock is too far into the past for Binance Futures Testnet (< ", recvWindow / 1000, " seconds)")
		}
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const market = yield* symbolInfo.call(this, Command.s)
		const balances = yield* account.call(this)
		const currency = market.quoteAsset // e.g. USDT
		if (!balances.hasOwnProperty(currency)) {
			throw new ReferenceError("Account Balance (" + currency + ") not available.")
		}

		const balance = balances[currency]
		const ticker = yield* symbolTicker.call(this, market.symbol)
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bidPrice : ticker.askPrice
		const pricePrecision = market.filters.hasOwnProperty("PRICE_FILTER") ? decimals(market.filters.PRICE_FILTER.tickSize) : 8
		const quantityPrecision = market.filters.hasOwnProperty("LOT_SIZE") ? decimals(market.filters.LOT_SIZE.stepSize) : 8
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)
		const leverage = Command.l || 1
		const available = (Command.y === "equity" ? balance.balance : balance.available) / price * leverage

		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			// main => pair
			Command.q.div(price)
		}
		Command.q.reference(available)

		const quantity = Command.q.resolve(quantityPrecision)

		let params = {}
		params.symbol = market.symbol
		params.side = Command.isBid ? "BUY" : "SELL"
		params.type = Command.t === "market" ? "MARKET" : "LIMIT"
		params.quantity = quantity
		switch (Command.t) {
			case "fok":
				params.price = price
				params.timeInForce = "FOK" // GTC, IOC, FOK
				break
			case "ioc":
				params.price = price
				params.timeInForce = "IOC" // GTC, IOC, FOK
				break
			case "market":
				break;
			default:
				params.price = price
				params.timeInForce = "GTC" // GTC, IOC, FOK
		}
		if (Command.ro) {
			params.reduceOnly = true
		}

		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.type = Command.t === "market" ? "STOP_MARKET" : "STOP"
			params.side = Command.isBid ? "SELL" : "BUY"
			params.stopPrice = sl.resolve(pricePrecision)
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.type = Command.t === "market" ? "TAKE_PROFIT_MARKET" : "TAKE_PROFIT"
			params.side = Command.isBid ? "SELL" : "BUY"
			params.stopPrice = tp.resolve(pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* post.call(this, "/fapi/v1/order", params, SECURITY_TRADE)
	}


	return Object.assign(
		{},
		Exchange(state),
		{
			exchangeOrdersCancelAll: ordersCancelAll,
			exchangePositionsCloseAll: positionsCloseAll,
			exchangeTime: time,
			exchangeTrade: trade,
			getExchangeTestCommand: testCommand,
		}
	)
}
