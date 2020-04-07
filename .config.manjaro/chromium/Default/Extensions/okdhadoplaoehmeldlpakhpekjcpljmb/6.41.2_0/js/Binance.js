"use strict"
window.BINANCE_SYMBOLS = {}
window.BINANCE_SYMBOLS_UPDATED = 0
/**
 *
 * @returns {*}
 * @constructor
 */
function Binance() {
	const recvWindow = 5000 // 5 seconds

	const SECURITY_NONE = 0
	const SECURITY_TRADE = 1 // SIGNED endpoint
	const SECURITY_USER_DATA = 2 // SIGNED endpoint
	const SECURITY_USER_STREAM = 4
	const SECURITY_MARGIN = 16 // SIGNED endpoint
	const SECURITY_MARKET_DATA = 8

	let state = {
		aliases: [
			"BINANCE",
		],
		endpoint: "https://api.binance.com/",
		fields: {
			public: {
				label: "API Key",
				message: "",
			},
			private: {
				label: "Secret",
				message: "",
			},
		},
		name: "Binance",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.binance.com/*"
			],
		},
		subscriptions: {
			active: [
				"brnzhjdgkscloyiwtfupevmxaq", // Autoview Bronze
				"brnzvpskjlyxdewhoaguftcqmi", // Autoview Bronze - Yearly
			],
			inactive: [
				"biaksgztrmlncqovehwydpfujx", // Binance
				"biuevdnwfyargmcpklhqsxojtz", // Binance - Yearly
			],
		},
		website: "https://www.binance.com/?ref=13612693",
	}

	function* account() {
		const params = {}
		const account = yield* get.call(this, "/api/v3/account", params, SECURITY_USER_DATA)

		let balances = {}
		for (let i = 0; i < account.balances.length; i++) {
			const balance = account.balances[i]
			balances[balance.asset] = {
				available: Number(balance.free),
				balance: (Number(balance.free) + Number(balance.locked)).toFixed(8),
			}
		}

		return balances
	}

	function* accountMargin() {
		const params = {}
		const account = yield* get.call(this, "/sapi/v1/margin/account", params, SECURITY_USER_DATA)

		let balances = {}
		for (let i = 0; i < account.userAssets.length; i++) {
			const balance = account.userAssets[i]
			balances[balance.asset] = {
				available: Number(balance.free),
				balance: Number(balance.netAsset),
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
		const SIGNED = (security & SECURITY_TRADE || security & SECURITY_USER_DATA || security & SECURITY_MARGIN)

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

	function* ordersCancel(order, isMarginTrading) {
		let params = {}
		params.symbol = order.symbol
		params.orderId = order.orderId

		const resource = isMarginTrading ? "/sapi/v1/margin/order" : "/api/v3/order"
		const response = yield* make.call(this, "DELETE", resource, params, SECURITY_TRADE)

		return response.orderId === order.orderId
	}

	function* ordersCancelAll(Command) {
		const market = yield* symbolInfo.call(this, Command.s)
		let orders = yield* ordersOpen.call(this, market.symbol, Command.isMarginTrading)
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
				return false // Order Type mismatch (e.g. STOP_LOSS_LIMIT, TAKE_PROFIT_LIMIT)
			}

			return true
		})

		// Limit the number of cancelled orders by the requested "Cancel Maximum"
		const end = Command.cm.reference(orders.length).resolve(0)
		if (Command.cm.getMax() < orders.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(orders, "time", true)
					break
				case "oldest":
					sortByIndex(orders, "time")
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
				yield* ordersCancel.call(this, order, Command.isMarginTrading)
			}
		}
	}

	function* ordersOpen(symbol, isMarginTrading) {
		let params = {}
		params.symbol = symbol

		const resource = isMarginTrading ? "/sapi/v1/margin/openOrders" : "/api/v3/openOrders"
		return yield* get.call(this, resource, params, SECURITY_USER_DATA)
	}

	function* positionsCloseAll() {
		throw new ReferenceError(this.getExchangeName() + " does not support Margin trading.")
	}

	function* post(resource, parameters, security) {
		return yield* make.call(this, "POST", resource, parameters, security)
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 1800000 // 30 minutes
		if (window.BINANCE_SYMBOLS_UPDATED < expired) {
			const response = yield* get.call(this, "/api/v3/exchangeInfo")
			response.symbols.forEach((info) => {
				let filters = {}
				info.filters.forEach((filter) => {
					filters[filter.filterType] = filter
				})
				info.filters = filters

				info.pricePrecision = info.filters.hasOwnProperty("PRICE_FILTER") ? decimals(info.filters.PRICE_FILTER.tickSize) : 8
				info.quantityPrecision = info.filters.hasOwnProperty("LOT_SIZE") ? decimals(info.filters.LOT_SIZE.stepSize) : 8

				window.BINANCE_SYMBOLS[info.symbol] = info
				window.BINANCE_SYMBOLS_UPDATED = Date.now()
			})
		}

		if (symbol) {
			if (!window.BINANCE_SYMBOLS.hasOwnProperty(symbol)) {
				throw new Error("Unknown market symbol: " + symbol)
			}
			return window.BINANCE_SYMBOLS[symbol]
		}

		return window.BINANCE_SYMBOLS
	}

	function* symbolTicker(symbol) {
		let query = {}
		query.symbol = symbol

		const ticker = yield* get.call(this, "/api/v3/ticker/bookTicker", query)

		return {
			ask: ticker.askPrice,
			bid: ticker.bidPrice,
		}
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* time() {
		const response = yield* this.getRequest(state.endpoint + "api/v3/time", null, null, "json")
		const epoch = Date.now()
		const offset = (epoch - response.serverTime) / 1000

		Verbose().info(this.getExchangeName(), "time", response.serverTime, "Autoview time", epoch, "Offset", offset, "seconds")

		if (offset > 1) {
			Verbose().error("Your computer's clock is too far into the future for Binance (> 1 second)")
		}
		if (offset < -recvWindow / 1000) {
			Verbose().error("Your computer's clock is too far into the past for Binance (< ", recvWindow / 1000, " seconds)")
		}
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}
		if (Command.hasOwnProperty("sl") && Command.hasOwnProperty("tp")) {
			throw new SyntaxError("Binance does not support Stop Loss and Take Profit on the same order.")
		}

		const isBid = (Command.isBid && !Command.sl && !Command.tp) || (Command.isAsk && (Command.sl || Command.tp))
		const market = yield* symbolInfo.call(this, Command.s)
		const balanceMethod = Command.isMarginTrading ? accountMargin : account
		const balances = yield* balanceMethod.call(this)
		let currency = Command.isBid ? market.quoteAsset : market.baseAsset

		if (Command.sl || Command.tp) {
			currency = Command.isBid ? market.baseAsset : market.quoteAsset
		}

		if (!balances.hasOwnProperty(currency)) {
			throw new ReferenceError("Account Balance (" + currency + ") not available.")
		}

		const ticker = yield* symbolTicker.call(this, market.symbol)
		if (!ticker) {
			throw new ReferenceError("Ticker (" + market.symbol + ") is not available.")
		}

		const balance = balances[currency]
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask
		let price = Command.p.relative(first).resolve(market.pricePrecision)
		if (Command.fp) {
			price = Command.fp.resolve(market.pricePrecision)
		}
		let available = Command.y === "equity" ? balance.balance : balance.available

		if (isBid) {
			// main => pair
			available /= price
		}
		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			// main => pair
			Command.q.div(price)
		}
		Command.q.reference(available)

		const quantity = Command.q.resolve(market.quantityPrecision)

		let params = {}
		params.symbol = market.symbol
		params.side = Command.isBid ? "BUY" : "SELL"
		params.type = Command.t === "market" ? "MARKET" : "LIMIT"
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
				params.timeInForce = "GTC"; // GTC, IOC, FOK
		}
		params.quantity = quantity
		if (Command.hasOwnProperty("h")) {
			params.icebergQty = Command.h.reference(quantity).resolve(market.quantityPrecision)
		}
		params.newOrderRespType = "ACK" // ACK, RESULT, FULL
		if (Command.y === "borrow") {
			params.sideEffectType = "MARGIN_BUY"
		}
		if (Command.y === "repay") {
			params.sideEffectType = "AUTO_REPAY"
		}

		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.type = Command.t === "market" ? "STOP_LOSS" : "STOP_LOSS_LIMIT"
			params.side = Command.isBid ? "SELL" : "BUY"
			params.stopPrice = sl.resolve(market.pricePrecision)
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.type = Command.t === "market" ? "TAKE_PROFIT" : "TAKE_PROFIT_LIMIT"
			params.side = Command.isBid ? "SELL" : "BUY"
			params.stopPrice = tp.resolve(market.pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		if (Command.isMarginTrading) {
			return yield* post.call(this, "/sapi/v1/margin/order", params, SECURITY_TRADE)
		}

		return yield* post.call(this, "/api/v3/order", params, SECURITY_TRADE)
	}

	function* transferBalances(Command) {
		switch (Command.y) {
			case "borrow": // Apply for a loan
				for (let i = 0; i < Command.w.length; i++) {
					const asset = Command.w[i];

					if (Command.q.getIsPercent()) {
						const response = yield* get.call(this, "/sapi/v1/margin/maxBorrowable", {
							asset,
						})
						Command.q.reference(response.amount)
					}

					const params = {}
					params.asset = asset
					params.amount = Command.q.resolve(8)
					if (Command.d) {
						Verbose().info(this.getExchangeName(), "borrow", params)
					} else {
						yield* post.call(this, "/sapi/v1/margin/loan", params, SECURITY_MARGIN)
					}
				}
				break

			case "margin": // spot => margin
				const spots = yield* account.call(this)
				for (const currency in spots) {
					if (spots.hasOwnProperty(currency) && Command.w.includes(currency)) {
						const balance = spots[currency].balance
						const quantity = Command.q.reset().reference(balance);
						if (quantity.compare(0.0) !== 0) {
							yield* transferCoin.call(this, Command.y, currency, quantity.resolve(8), Command.d)
						}
					}
				}
				break

			case "repay": // Repay loan for margin account
				for (let i = 0; i < Command.w.length; i++) {
					const asset = Command.w[i]

					if (Command.q.getIsPercent()) {
						const response = yield* get.call(this, "/sapi/v1/margin/maxTransferable", {
							asset,
						})
						Command.q.reference(response.amount)
					}

					const params = {}
					params.asset = asset
					params.amount = Command.q.resolve(8)
					if (Command.d) {
						Verbose().info(this.getExchangeName(), "repay", params)
					} else {
						yield* post.call(this, "/sapi/v1/margin/repay", params, SECURITY_MARGIN)
					}
				}
				break

			case "spot": // margin => spot
				const margins = yield* accountMargin.call(this)
				for (const currency in margins) {
					if (margins.hasOwnProperty(currency) && Command.w.includes(currency)) {
						const balance = margins[currency].balance
						const quantity = Command.q.reset().reference(balance)
						if (quantity.compare(0.0) !== 0) {
							yield* transferCoin.call(this, Command.y, currency, quantity.resolve(8), Command.d)
						}
					}
				}
				break

			default:
				throw new SyntaxError("Wallet Type not found: " + Command.y)
		}
	}

	function* transferCoin(desitnation, asset, amount, debug) {
		const source = desitnation === "margin" ? "spot" : "margin";
		const params = {}
		params.asset = asset
		params.amount = amount
		params.type = source === "spot" ? 1 : 2

		if (debug) {
			Verbose().info(this.getExchangeName(), "Transferring", amount, asset, "from", source, "to", desitnation)
			return false // Disabled
		}

		return yield* post.call(this, "/sapi/v1/margin/transfer", params, SECURITY_MARGIN)
	}


	return Object.assign(
		{},
		Exchange(state),
		{
			exchangeOrdersCancelAll: ordersCancelAll,
			exchangePositionsCloseAll: positionsCloseAll,
			exchangeTransferBalances: transferBalances,
			exchangeTime: time,
			exchangeTrade: trade,
			getExchangeTestCommand: testCommand,
		}
	)
}
