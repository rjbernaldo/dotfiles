"use strict"
window.OKEX_SYMBOLS = {}
window.OKEX_SYMBOLS_UPDATED = {}
/**
 *
 * @returns {*}
 * @constructor
 */
function OKEXv3() {
	let state = {
		aliases: [
			"OKEXV3",
			"OKEX-V3",
		],
		endpoint: "https://www.okex.com/",
		fields: {
			passphrase: {
				label: "Passphrase",
				message: "",
			},
			public: {
				label: "API Key",
				message: "",
			},
			private: {
				label: "Secret Key",
				message: "",
			},
		},
		name: "OKEX v3 (beta)",
		patterns: [],
		permissions: {
			origins: [
				"https://*.okex.com/*",
			],
		},
		subscriptions: {
			active: [],
			inactive: [],
		},
		website: "https://www.okex.com/",
	}

	function* account(market) {
		let account
		let balances = {}
		const normalize = (obj) => {
			const available = +obj.total_avail_balance || +obj.available || 0.0
			const balance = +obj.equity || +obj.balance || 0.0
			return {
				available,
				balance,
			}
		}

		switch (market.type) {
			case "ett":
				account = (yield* get.call(this, "/api/ett/v3/accounts")) || []
				account.forEach((balance) => balances[balance.currency] = normalize(balance))
				break
			case "futures":
				const currency = market.pair === "USDT" ? market.main + "-" + market.pair : market.pair
				account = (yield* get.call(this, "/api/futures/v3/accounts/" + currency)) || {}
				balances[market.pair] = normalize(account)
				break
			case "margin":
				account = (yield* get.call(this, "/api/margin/v3/accounts")) || []
				account.filter((balance) => balance.instrument_id === market.symbol).forEach((balance) => {
					const [pair, main] = balance.instrument_id.split("-")
					balances[main] = balance["currency:" + main]
					balances[pair] = balance["currency:" + pair]
				})
				break
			case "token":
				account = (yield* get.call(this, "/api/spot/v3/accounts")) || []
				account.forEach((balance) => balances[balance.currency] = normalize(balance))
				break
			case "swap":
				account = (yield* get.call(this, "/api/swap/v3/" + market.symbol + "/accounts")) || {}
				if (account.hasOwnProperty("info")) {
					const [pair, main] = account.info.instrument_id.split("-")
					const balance = normalize(account.info)
					balances[main] = balance
					balances[pair] = balance
				}
				break
			default:
				throw new Error("Unexpected market type: " + market.type)
		}

		return balances
	}

	function* get(resource, query) {
		return yield* make.call(this, "GET", resource, query, null, "json")
	}

	function* make(method, resource, parameters, headers, format) {
		method = method.toUpperCase()
		headers = headers || {}
		format = format || "json"

		const body = method !== "GET" ? JSON.stringify(parameters) || "" : ""
		const credentials = yield* this.getExchangeCredentials("private")
		const date = new Date()
		const query = parameters && method === "GET" ? "?" + serialize(parameters) : ""
		const timestamp = date.toISOString() // i.e. YYYYY-MM-DDTHH:mm:ss.sssZ
		const signature = () => {
			const data = timestamp + method + resource + query + body
			const sha = new jsSHA("SHA-256", "TEXT")
			sha.setHMACKey(credentials.private, "TEXT")
			sha.update(data)
			return sha.getHMAC("B64")
		}

		headers["Content-Type"] = "application/json"
		headers["OK-ACCESS-KEY"] = credentials.public
		headers["OK-ACCESS-SIGN"] = signature()
		headers["OK-ACCESS-TIMESTAMP"] = timestamp
		headers["OK-ACCESS-PASSPHRASE"] = credentials.passphrase

		resource = state.endpoint + resource.replace(/^\/+/, "") + query

		const func = method.toLowerCase() + "Request"
		const response = yield* this[func](resource, body, headers, format)

		if (response.hasOwnProperty("result")) {
			if (!response.result) {
				const message = response.error_message || JSON.stringify(response) || "Unknown error occurred"
				throw new Error(message)
			}
		}

		return response
	}

	function* ordersCancelAll(Command) {
		const market = yield* symbolPair.call(this, Command.s, Command.isMarginTrading)
		let orders = (yield* ordersOpen.call(this, market)) || []
		let types = []

		// c=order					[1,2,3,4]
		// c=order t=open			[1,2]
		// c=order t=close			[3,4]

		// b=long c=order			[1,3]
		// b=long c=order t=open	[1]
		// b=long c=order t=close	[3]

		// b=short c=order			[2,4]
		// b=short c=order t=open	[2]
		// b=short c=order t=close	[4]

		if (Command.b) {
			if (Command.t !== "close") {
				types.push(1 + Command.isAsk)
			}
			if (Command.t !== "open") {
				types.push(3 + Command.isAsk)
			}
		} else {
			if (Command.t !== "close") {
				types.push(1, 2)
			}
			if (Command.t !== "open") {
				types.push(3, 4)
			}
		}

		orders = orders.filter((order) => {
			if (market.type === "swap") {
				if (types.indexOf(+order.type) === -1) {
					return false // Order Type mismatch
				}
			} else {
				if ((Command.isBid && order.side === "sell") || (Command.isAsk && order.side === "buy")) {
					return false // Side mismatch
				}
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
					sortByIndex(orders, "timestamp", true)
					break
				case "oldest":
					sortByIndex(orders, "timestamp")
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

		let order_ids = []
		for (let i = 0; i < orders.length; i++) {
			const order = orders[i];
			if (Command.d) {
				Verbose().info(this.getExchangeName(), "Order", order.size, "@", order.price, "would be cancelled")
			} else {
				order_ids.push(order.order_id)
			}
		}

		if (order_ids.length === 0) {
			return false // Nothing to do
		}

		let params = {}
		params.instrument_id = market.symbol
		switch (market.type) {
			case "futures":
				params.order_ids = order_ids
				return yield* post.call(this, "/api/futures/v3/cancel_batch_orders/" + market.symbol, params)
			case "margin":
				params.order_ids = order_ids
				return yield* post.call(this, "/api/margin/v3/cancel_batch_orders", [params])
			case "token":
				params.order_ids = order_ids
				return yield* post.call(this, "/api/spot/v3/cancel_batch_orders", [params])
			case "swap":
				params.ids = order_ids
				return yield* post.call(this, "/api/swap/v3/cancel_batch_orders/" + market.symbol, params)
		}

		throw new Error("Unknown market type provided: " + market.type)
	}

	function* ordersOpen(market) {
		let params = {}
		params.instrument_id = market.symbol
		switch (market.type) {
			case "futures":
			case "swap":
				params.status = 0
				const futures = yield* get.call(this, "/api/" + market.type + "/v3/orders/" + market.symbol, params)
				return futures.order_info || []
			case "margin":
				params.status = "open"
				return yield* get.call(this, "/api/margin/v3/orders_pending", params)
			case "token":
				return yield* get.call(this, "/api/spot/v3/orders_pending", params)
		}

		throw new Error("Unknown market type provided: " + market.type)
	}

	function* positionsClose(Command, position) {
		const market = yield* symbolPair.call(this, Command.s, Command.isMarginTrading)
		const ticker = yield* symbolTicker.call(this, market)
		const pricePrecision = market.precision
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.best_bid : ticker.best_ask
		const price = Command.fp ? Command.fp.resolve(pricePrecision) : Command.p.relative(first).resolve(pricePrecision)
		let quantity = Command.q.reference(Math.abs(position.quantity)).resolve(0)
		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			const info = yield* symbolInfo.call(this, market)
			quantity = Math.floor(Command.q.resolve(8) * position.leverage * price / info.contract_val)
		}

		let params = {}
		params.instrument_id = position.instrument_id
		params.size = quantity
		params.price = price
		params.leverage = position.leverage
		params.type = position.quantity > 0 ? 3 : 4
		switch (Command.t) {
			case "fok":
				params.order_type = 2
				break
			case "ioc":
				params.order_type = 3
				break
			case "post":
				params.order_type = 1
				break
			default:
				params.order_type = 0
		}
		if (Command.t === "market") {
			params.match_price = 1
			params.order_type = 0
		}

		if (Command.d) {
			Verbose().log(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* post.call(this, "/api/" + market.type + "/v3/order", params)
	}

	function* positionsCloseAll(Command) {
		const market = yield* symbolPair.call(this, Command.s, Command.isMarginTrading)
		let positions = yield* positionsOpen.call(this, market)

		positions = positions.filter((position) => {
			if (position.quantity === 0) {
				return false // Position allocated
			}
			if (Command.isBid && position.quantity < 0) {
				return false // Book mismatch
			}
			if (Command.isAsk && position.quantity > 0) {
				return false // Book mismatch
			}
			if (Command.l && Command.l != position.leverage) {
				return false // Leverage mismatch
			}

			return true
		})

		// Limit the number of closed positions by the requested "Close Maximum"
		const end = Command.cm.reference(positions.length).resolve(0)
		if (Command.cm.getMax() < positions.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(positions, "create_date", true)
					break
				case "oldest":
					sortByIndex(positions, "create_date")
					break
				case "lowest":
					sortByIndex(positions, "price_avg")
					break
				case "highest":
					sortByIndex(positions, "price_avg", true)
					break
				case "smallest":
					sortByIndex(positions, "amount")
					break
				case "biggest":
					sortByIndex(positions, "amount", true)
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

	function* positionsOpen(market) {
		switch (market.type) {
			case "futures":
			case "swap":
				const response = yield* get.call(this, "/api/" + market.type + "/v3/" + market.symbol + "/position")
				// response.margin_mode: crossed, fixed
				return (response.holding || []).map((position) => {
					if (!position.hasOwnProperty("leverage")) {
						position.leverage = +position.long_leverage || +position.short_leverage || 10
					}
					position.quantity = +position.long_avail_qty || -position.short_avail_qty || +position.avail_position || 0
					return position
				})
		}

		throw new Error("Positions not supported for this market: " + market.type + " " + market.symbol)
	}

	function* post(resource, query) {
		return yield* make.call(this, "POST", resource, query, null, "json")
	}

	function* symbolInfo(market) {
		if (!window.OKEX_SYMBOLS.hasOwnProperty(market.type)) {
			window.OKEX_SYMBOLS[market.type] = {}
		}

		const expired = Date.now() - 900000 // 15 minutes
		if (!window.OKEX_SYMBOLS_UPDATED.hasOwnProperty(market.type) || window.OKEX_SYMBOLS_UPDATED[market.type] < expired) {
			let tokens
			switch (market.type) {
				case "futures":
				case "swap":
					tokens = yield* get.call(this, "/api/" + market.type + "/v3/instruments")
					tokens.forEach((instrument) => {
						window.OKEX_SYMBOLS[market.type][instrument.instrument_id] = instrument
						window.OKEX_SYMBOLS_UPDATED[market.type] = Date.now()
					})
					break
				case "margin":
				case "token":
					tokens = yield* get.call(this, "/api/spot/v3/instruments")
					tokens.forEach((instrument) => {
						window.OKEX_SYMBOLS[market.type][instrument.instrument_id] = instrument
						window.OKEX_SYMBOLS_UPDATED[market.type] = Date.now()
					})
			}
		}

		if (!window.OKEX_SYMBOLS[market.type].hasOwnProperty(market.symbol)) {
			throw new Error("Symbol not supported: " + market.symbol)
		}

		return window.OKEX_SYMBOLS[market.type][market.symbol]
	}

	// spot		XRP/BTC, XLM/ETH, XAS/OKB, HC/USDT
	// margin	ETH/USDT, IOST/BTC
	// futures	BCH0118, BTC0125, XRP0329
	// swap		ETCSwap, BSVSwap
	// ett		OK06ETT, OK06ETT/USDT
	function* symbolPair(symbol, isMarginTrading) {
		// Fiat to Token, Token Trading
		const regexpA = /^(.{0,5})[-_/]?(BTC|ETH|OKB|USDT|ETT|SWAP)$/i
		// Futures
		const regexpB = /^(.+?)(\d{2})(\d{2})$/i
		const regexpC = /^(.+?)(BTC|ETH|OKB|USD|USDK|USDT)(?:(\d{2})(\d{2})|(SWAP))$/i
		const toUpperCase = (string) => typeof string === "string" ? string.toUpperCase() : string

		const now = new Date()
		let result
		let so = {}
		so.precision = 8
		so.type = null
		if (regexpA.test(symbol)) {
			result = regexpA.exec(symbol).map(toUpperCase)
			so.main = result ? result[2] : ""
			so.pair = result ? result[1] : ""
			if (so.main === "ETT" || so.main === "SWAP") {
				const type = so.main
				so.main = "USD"
				so.type = type.toLowerCase()
				so.symbol = so.pair + "-" + so.main + "-" + type
			} else {
				if (isMarginTrading) {
					so.type = "margin"
				} else {
					so.type = "token"
				}
				so.symbol = so.pair + "-" + so.main
			}
		} else if (regexpC.test(symbol)) {
			result = regexpC.exec(symbol).map(toUpperCase)
			if (result && result[5] === "SWAP") {
				so.main = result[1]
				so.pair = result[2]
				so.type = "swap"
				so.symbol = [
					so.main,
					so.pair,
					"SWAP",
				].join("-")
			} else {
				so.main = result ? result[1] : ""
				so.pair = result ? result[2] : ""
				so.month = result ? result[3] : ""
				so.day = result ? result[4] : ""
				so.year = now.getUTCFullYear().toString().substr(-2)
				so.type = "futures"
				so.symbol = [
					so.main,
					so.pair,
					so.year + so.month + so.day
				].join("-")
			}
		} else if (regexpB.test(symbol)) {
			result = regexpB.exec(symbol).map(toUpperCase)
			so.main = "USD"
			so.pair = result ? result[1] : ""
			so.month = result ? result[2] : ""
			so.day = result ? result[3] : ""
			so.year = now.getUTCFullYear().toString().substr(-2)
			so.type = "futures"
			so.symbol = [
				so.pair,
				so.main,
				so.year + so.month + so.day
			].join("-")
		} else {
			throw new Error("Unknown market symbol: " + symbol)
		}

		return so
	}

	function* symbolTicker(market) {
		switch (market.type) {
			case "futures":
			case "swap":
			return yield* get.call(this, "/api/" + market.type + "/v3/instruments/" + market.symbol + "/ticker")
			case "margin":
			case "token":
			return yield* get.call(this, "/api/spot/v3/instruments/" + market.symbol + "/ticker")
		}

		throw new Error("Unable to resolve market ticker: " + market.type + " " + market.symbol)
	}

	function* testCommand() {
		const symbol = "OKBBTC"
		const market = yield* symbolPair.call(this, symbol)
		return yield* account.call(this, market)
	}

	function* time() {
		const response = yield* this.getRequest(state.endpoint + "api/general/v3/time", null, null, "json")
		const serverTime = response.epoch * 1000
		const epoch = Date.now()
		const offset = (epoch - serverTime) / 1000

		Verbose().info(this.getExchangeName(), "time", serverTime, "Autoview time", epoch, "Offset", offset, "seconds")
	}

	function* trade(Command) {
		const market = yield* symbolPair.call(this, Command.s, Command.isMarginTrading)
		const ticker = yield* symbolTicker.call(this, market)
		const balances = yield* account.call(this, market)
		const currency = Command.isBid && market.type !== "futures" ? market.main : market.pair
		const leverage = Command.l || 10
		if (!balances.hasOwnProperty(currency)) {
			throw new ReferenceError("Account Balance (" + currency + ") not available.")
		}
		const balance = balances[currency]
		let available = Command.y === "equity" ? balance.balance : balance.available
		const pricePrecision = market.precision
		let quantityPrecision = 8
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.best_bid : ticker.best_ask
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)
		const info = yield* symbolInfo.call(this, market)

		if (market.type === "swap") {
			if (Command.u === "currency" && !Command.q.getIsPercent()) {
				Command.q.div(price)
			}
			available = Math.floor(available * leverage / price / info.contract_val)
		} else if (market.type === "futures") {
			if (Command.u === "currency" && !Command.q.getIsPercent()) {
				available = Command.q.resolve(0)
			}
			available = Math.floor(available * leverage / price / info.contract_val)
			quantityPrecision = 0
		} else {
			if (Command.isBid) {
				available /= price // main => pair
			}
			if (Command.u === "currency" && !Command.q.getIsPercent()) {
				Command.q.div(price) // main => pair
			}
		}
		Command.q.reference(available)

		let params = {}
		params.instrument_id = market.symbol
		params.size = Command.q.resolve(quantityPrecision)
		params.price = price
		switch (market.type) {
			case "futures":
				params.leverage = leverage
			case "swap":
				params.type = Command.isAsk ? 2 : 1
				break
			case "margin":
				params.type = Command.t === "market" ? "market" : "limit"
				params.side = Command.isAsk ? "sell" : "buy"
				params.margin_trading = 2
				break
			default:
				params.type = Command.t === "market" ? "market" : "limit"
				params.side = Command.isAsk ? "sell" : "buy"
				params.margin_trading = 1
		}
		switch (Command.t) {
			case "fok":
				params.order_type = 2
				break
			case "ioc":
				params.order_type = 3
				break
			case "post":
				params.order_type = 1
				break
			default:
				params.order_type = 0
		}
		if (Command.t === "market") {
			params.match_price = 1
			params.order_type = 0
		}

		if (Command.d) {
			Verbose().log(this.getExchangeName(), params)
			return false // Disabled
		}

		switch (market.type) {
			case "futures":
			case "swap":
				return yield* post.call(this, "/api/" + market.type + "/v3/order", params)
			case "margin":
				return yield* post.call(this, "/api/" + market.type + "/v3/orders", params)
			case "token":
				return yield* post.call(this, "/api/spot/v3/orders", params)
			default:
				throw new Error("Unsupported market type: " + market.type)
		}
	}

	function* transferBalances(Command) {
		const market = yield* symbolPair.call(this, Command.s, Command.isMarginTrading)

		switch (Command.y) {
			case "borrow": // Apply for a loan
				for (let i = 0; i < Command.w.length; i++) {
					const params = {}
					params.instrument_id = market.symbol
					params.currency = Command.w[i]
					params.amount = Command.q.resolve(8)
					if (Command.d) {
						Verbose().info(this.getExchangeName(), "borrow", params)
					} else {
						yield* post.call(this, "/api/margin/v3/accounts/borrow", params)
					}
				}
				break

			case "repay": // Repay loan for margin account
				for (let i = 0; i < Command.w.length; i++) {
					const params = {}
					params.instrument_id = market.symbol
					params.currency = Command.w[i]
					params.amount = Command.q.resolve(8)
					if (Command.d) {
						Verbose().info(this.getExchangeName(), "repay", params)
					} else {
						yield* post.call(this, "/api/margin/v3/accounts/repayment", params)
					}
				}
				break

			default:
				throw new SyntaxError("Wallet Type not found: " + Command.y)
		}
	}


	return Object.assign(
		{},
		Exchange(state),
		{
			exchangeOrdersCancelAll: ordersCancelAll,
			exchangePositionsCloseAll: positionsCloseAll,
			exchangeTime: time,
			exchangeTrade: trade,
			exchangeTransferBalances: transferBalances,
			getExchangeTestCommand: testCommand,
		}
	)
}
