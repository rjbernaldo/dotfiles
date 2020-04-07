"use strict"
window.KUCOIN_SANDBOX_NONCE = 0
window.KUCOIN_SANDBOX_NONCE_OFFSET = -1
window.KUCOIN_SANDBOX_TICKERS = {}
window.KUCOIN_SANDBOX_TICKERS_UPDATED = 0
window.KUCOIN_SANDBOX_SYMBOLS = {}
window.KUCOIN_SANDBOX_SYMBOLS_UPDATED = 0
/**
 *
 * @returns {*}
 * @constructor
 */
function KucoinSandbox() {
	let state = {
		aliases: [
			"KUCOINSANDBOX",
			"KUCOIN-SANDBOX",
		],
		endpoint: "https://openapi-sandbox.kucoin.com",
		fields: {
			passphrase: {
				label: "Passphrase",
				message: "",
			},
			public: {
				label: "Key",
				message: "",
			},
			private: {
				label: "Secret",
				message: "",
			},
		},
		name: "Kucoin Sandbox (beta)",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.kucoin.com/*",
			],
		},
		subscriptions: {
			active: [],
			inactive: [],
		},
		website: "https://sandbox.kucoin.com",
	}

	function* account(currency) {
		const query = {}
		query.type = "trade" // main, trade
		const response = yield* get.call(this, "/api/v1/accounts", query)
		const balances = {}
		for (let i = 0; i < response.length; i++) {
			const item = response[i]
			balances[item.currency] = {
				available: Number(item.available),
				balance: Number(item.balance),
			}
		}

		if (currency) {
			if (balances.hasOwnProperty(currency)) {
				return balances[currency]
			}

			throw new ReferenceError("Account Balance (" + currency + ") not found")
		}

		return balances
	}

	function* get(resource, query) {
		return yield* make.call(this, "GET", resource, query)
	}

	function* getNonce() {
		let nonce = Math.round(Date.now() / 1000) * 1000 // second precision

		if (window.KUCOIN_SANDBOX_NONCE != nonce) {
			window.KUCOIN_SANDBOX_NONCE_OFFSET = -1
		}

		window.KUCOIN_SANDBOX_NONCE = nonce
		window.KUCOIN_SANDBOX_NONCE_OFFSET++

		nonce += window.KUCOIN_SANDBOX_NONCE_OFFSET

		return nonce
	}

	function* make(method, resource, parameters) {
		parameters = parameters || ""
		switch (method) {
			case "GET":
			case "DELETE":
				if (parameters) {
					resource += resource.includes("?") ? "&" : "?"
					resource += serialize(parameters) || ""
				}
				parameters = ""
				break
			case "POST":
				parameters = JSON.stringify(parameters)
		}

		const credentials = yield* this.getExchangeCredentials("private")
		const timestamp = Date.now()
		const signature = () => {
			const data = timestamp + method + resource + parameters
			let sha = new jsSHA("SHA-256", "TEXT")
			sha.setHMACKey(credentials.private, "TEXT")
			sha.update(data)

			return sha.getHMAC("B64")
		}

		const endpoint = state.endpoint + resource

		let headers = {}
		headers["Content-Type"] = "application/json"
		headers["KC-API-KEY"] = credentials.public
		headers["KC-API-PASSPHRASE"] = credentials.passphrase
		headers["KC-API-SIGN"] = signature()
		headers["KC-API-TIMESTAMP"] = timestamp

		try {
			const func = method.toLowerCase() + "Request"
			const response = yield* this[func](endpoint, parameters, headers, "json")
			if (response.code !== "200000") {
				throw response
			}

			return response.data
		} catch (ex) {
			throw new Error(ex.msg + " (" + ex.code + ")")
		}
	}

	function* ordersCancel(order) {
		const resource = "/api/v1/orders/" + order.id
		const response = yield* make.call(this, "DELETE", resource)
		const cancelledOrderIds = response.cancelledOrderIds || []

		return cancelledOrderIds.includes(order.id)
	}

	function* ordersCancelAll(Command) {
		const market = yield* symbolInfo.call(this, Command.s)
		let orders = yield* ordersOpen.call(this, market.symbol)
		const side = Command.isBid ? "buy" : "sell"
		const type = Command.t === "market" ? "market" : "limit"

		orders = orders.filter((order) => {
			if (Command.b && order.side !== side) {
				return false // buy, sell
			}
			if (Command.fp && Command.fp.compare(order.price)) {
				return false // Price mismatch
			}
			if (Command.t && !order.type.includes(type)) {
				return false // Type mismatch (limit, market, limit_stop, market_stop)
			}
			if (Command.t === "open" && order.stop.length) {
				return false // Type mismatch (entry, loss)
			}
			if (Command.t === "close" && !order.stop.length) {
				return false // Type mismatch
			}

			return true
		})

		// Limit the number of cancelled orders by the requested "Cancel Maximum"
		const end = Command.cm.reference(orders.length).resolve(0)
		if (Command.cm.getMax() < orders.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(orders, "createdAt", true)
					break
				case "oldest":
					sortByIndex(orders, "createdAt")
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
			const order = orders[i];
			if (Command.d) {
				Verbose().info(this.getExchangeName(), "order", order.size, "@", order.price, "would be cancelled.")
			} else {
				yield* ordersCancel.call(this, order)
			}
		}
	}

	function* ordersOpen(symbol) {
		// TODO "This request is paginated."
		const params = {}
		params.status = "active" // active, [done]
		params.symbol = symbol
		const response = yield* get.call(this, "/api/v1/orders", params)

		return response.items
	}

	function* positionsCloseAll(Command) {
		throw new Error(this.getExchangeName() + " does not support Margin trading.")
	}

	function* post(resource, parameters) {
		return yield* make.call(this, "POST", resource, parameters)
	}

	function* symbolInfo(symbol) {
		symbol = symbol.replace(/[^0-9a-zA-Z]+/g, "-").replace(/^-+|-+$/, "")
		const expired = Date.now() - 900000 // 15 minutes
		if (window.KUCOIN_SANDBOX_SYMBOLS_UPDATED < expired) {
			const response = yield* get.call(this, "/api/v1/symbols")
			response.forEach((info) => {
				info.pricePrecision = decimals(info.priceIncrement)
				info.quantityPrecision = decimals(info.baseIncrement)
				window.KUCOIN_SANDBOX_SYMBOLS[info.symbol] = info
 				window.KUCOIN_SANDBOX_SYMBOLS_UPDATED = Date.now()
			})
		}

		if (symbol) {
			if (!window.KUCOIN_SANDBOX_SYMBOLS.hasOwnProperty(symbol)) {
				throw new Error("Unknown market symbol: " + symbol)
			}
			return window.KUCOIN_SANDBOX_SYMBOLS[symbol]
		}

		return window.KUCOIN_SANDBOX_SYMBOLS
	}

	function* symbolTicker(symbol) {
		const expired = Date.now() - 60000 // 1 minute
		if (window.KUCOIN_SANDBOX_TICKERS_UPDATED < expired) {
			const response = yield* get.call(this, "/api/v1/market/allTickers")
			window.KUCOIN_SANDBOX_TICKERS_UPDATED = response.time
			response.ticker.forEach((ticker) => {
				window.KUCOIN_SANDBOX_TICKERS[ticker.symbol] = ticker
			})
		}

		if (symbol) {
			if (!window.KUCOIN_SANDBOX_TICKERS.hasOwnProperty(symbol)) {
				throw new Error("Unknown ticker symbol: " + symbol)
			}
			return window.KUCOIN_SANDBOX_TICKERS[symbol]
		}

		return window.KUCOIN_SANDBOX_TICKERS
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}
		if (Command.isMarginTrading) {
			throw new SyntaxError(this.getExchangeName() + " does not support Margin trading.")
		}

		const market = yield* symbolInfo.call(this, Command.s)
		const currency = Command.isBid ? market.quoteCurrency : market.baseCurrency
		const balance = yield* account.call(this, currency)
		const ticker = yield* symbolTicker.call(this, market.symbol)
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.buy : ticker.sell
		const price = Command.fp
			? Number(Command.fp.resolve(market.pricePrecision))
			: Number(Command.p.relative(first).resolve(market.pricePrecision))
		let available = Command.y === "equity" ? balance.balance : balance.available

		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			Command.q.div(price) // quote => base
		}
		if (Command.isBid) {
			available /= price // quote => base
		}

		Command.q.reference(available)

		const params = {}
		params.clientOid = yield* getNonce()
		params.side = Command.isBid ? "buy" : "sell"
		params.size = Command.q.resolve(market.quantityPrecision)
		params.symbol = market.symbol
		params.type = "limit"
		switch (Command.t) {
			case "fok":
				params.price = price
				params.timeInForce = "FOK" // GTC, GTT, IOC, FOK
				break
			case "ioc":
				params.price = price
				params.timeInForce = "IOC" // GTC, GTT, IOC, FOK
				break
			case "market":
				params.type = "market"
				break
			case "post":
				params.postOnly = true
			default:
				params.price = price
				params.timeInForce = "GTC"; // GTC, GTT, IOC, FOK
		}
		if (Command.hasOwnProperty("h")) {
			params.hidden = Command.h.reference(Command.q).resolve(market.quantityPrecision)
		}

		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.stop = Command.isBid ? "loss" : "entry"
			params.stopPrice = sl.resolve(market.pricePrecision)
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.stop = Command.isBid ? "entry" : "loss"
			params.stopPrice = tp.resolve(market.pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* post.call(this, "/api/v1/orders", params)
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
