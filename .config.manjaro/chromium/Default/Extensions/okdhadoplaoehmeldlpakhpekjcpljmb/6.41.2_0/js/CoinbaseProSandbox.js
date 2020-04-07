"use strict"
window.COINBASE_PRO_SANDBOX = {}
window.COINBASE_PRO_SANDBOX_UPDATED = 0
/**
 *
 * @returns {*}
 * @constructor
 */
function CoinbaseProSandbox() {
	let state = {
		aliases: [
			"COINBASEPROSANDBOX",
			"COINBASEPRO-SANDBOX",
			"COINBASE-PROSANDBOX",
			"COINBASE-PRO-SANDBOX",
		],
		endpoint: "https://api-public.sandbox.pro.coinbase.com",
		fields: {
			passphrase: {
				label: "Passphrase",
				message: "",
			},
			private: {
				label: "Secret",
				message: "",
			},
			public: {
				label: "Key",
				message: "",
			},
		},
		name: "Coinbase Pro Sandbox",
		patterns: [],
		permissions: {
			origins: [
				"https://*.pro.coinbase.com/*",
			],
			permissions: [],
		},
		subscriptions: {
			active: [],
			inactive: [],
		},
		website: "https://public.sandbox.pro.coinbase.com",
	}

	function* account() {
		const accounts = (yield* get.call(this, "/accounts")) || []

		let balances = {}
		for (let i = 0; i < accounts.length; i++) {
			const account = accounts[i]
			balances[account.currency] = account
		}

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
		parameters = parameters || null

		headers = headers || {}
		headers["Content-Type"] = "application/json"

		const credentials = yield* this.getExchangeCredentials("private")
		const body = parameters ? JSON.stringify(parameters) : ""
		const timestamp = Date.now() / 1000
		const data = timestamp + method + resource + body

		headers["CB-ACCESS-KEY"] = credentials.public
		headers["CB-ACCESS-PASSPHRASE"] = credentials.passphrase
		headers["CB-ACCESS-SIGN"] = signature(credentials, data)
		headers["CB-ACCESS-TIMESTAMP"] = timestamp

		try {
			const func = method.toLowerCase() + "Request" // e.g. deleteRequest, postRequest
			const response = yield* this[func](state.endpoint + resource, body, headers, "json")

			return response
		} catch (ex) {
			if (ex.hasOwnProperty("message")) {
				throw new Error(ex.message)
			}

			throw new Error("An unknown error has occurred.")
		}
	}

	function* ordersCancel(order) {
		return yield* make.call(this, "DELETE", "/orders/" + order.id)
	}

	function* ordersCancelAll(Command) {
		let orders = yield* ordersOpen.call(this, Command)

		orders = orders.filter((order) => {
			if (Command.b && ((Command.isBid && order.side !== "buy") || (Command.isAsk && order.side !== "sell"))) {
				return false // Book mismatch
			}
			if (Command.t === "open" && order.hasOwnProperty("stop")) {
				return false // Type mismatch
			}
			if (Command.t === "close" && !order.hasOwnProperty("stop")) {
				return false // Type mismatch
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

		if (Command.d) {
			Verbose().log(this.getExchangeName(), "orders", orders)
			return false
		}

		for (let i = 0; i < orders.length; i++) {
			yield* ordersCancel.call(this, orders[i], Command)
		}
	}

	function* ordersOpen(Command) {
		const product = yield* symbolInfo.call(this, Command.s)

		let params = {}
		params.product_id = product.id

		return yield* get.call(this, "/orders", params)
	}

	function* positionsCloseAll(Command) {
		throw new ReferenceError(this.getExchangeName() + " does not support Margin trading.")
	}

	function* post(resource, parameters, headers) {
		return yield* make.call(this, "POST", resource, parameters, headers)
	}

	function signature(credentials, data) {
		let sha = new jsSHA("SHA-256", "TEXT")
		sha.setHMACKey(credentials.private, "B64")
		sha.update(data)

		return sha.getHMAC("B64")
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 300000 // 5 minutes
		if (window.COINBASE_PRO_SANDBOX_UPDATED < expired) {
			const response = yield* get.call(this, "/products")
			response.forEach((info) => {
				info.quote_increment = Number(info.quote_increment)
				info.base_increment = Number(info.base_increment)

				window.COINBASE_PRO_SANDBOX[info.id] = info
				window.COINBASE_PRO_SANDBOX_UPDATED = Date.now()
			})
		}

		if (symbol) {
			if (!window.COINBASE_PRO_SANDBOX.hasOwnProperty(symbol)) {
				throw new Error("Unknown market symbol: " + symbol)
			}
			return window.COINBASE_PRO_SANDBOX[symbol]
		}

		return window.COINBASE_PRO_SANDBOX
	}

	function* symbolTicker(product) {
		return yield* get.call(this, "/products/" + product.id + "/ticker")
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* time() {
		const response = yield* this.getRequest(state.endpoint + "/time", null, null, "json")
		const serverTime = response.epoch * 1000
		const epoch = Date.now()
		const offset = (epoch - serverTime) / 1000

		Verbose().info(this.getExchangeName(), "time", serverTime, "Autoview time", epoch, "Offset", offset, "seconds")

		if (Math.abs(offset) > 30) {
			Verbose().error("Your computer's clock is too far from Coinbase Pro (not within 30 seconds)")
		}
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const product = yield* symbolInfo.call(this, Command.s)
		const pricePrecision = this.marketPrecision(product.quote_increment)
		const quantityPrecision = this.marketPrecision(product.base_increment)

		const balances = yield* account.call(this)
		const currency = Command.isBid ? product.quote_currency : product.base_currency
		if (!balances.hasOwnProperty(currency)) {
			balances[currency] = {
				available: 0.0,
				balance: 0.0,
			}
		}
		const balance = Command.y === "equity" ? balances[currency].balance : balances[currency].available

		const ticker = yield* symbolTicker.call(this, product)
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask
		const price = Command.fp ? Command.fp.resolve(pricePrecision) : Command.p.relative(first).resolve(pricePrecision)
		const available = Command.isBid ? balance / price : balance

		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			Command.q.div(price)
		}

		let params = {}
		params.size = Command.q.reference(available).resolve(quantityPrecision)
		switch (Command.t) {
			case "fok":
				params.price = price
				params.time_in_force = "FOK"
				break
			case "ioc":
				params.price = price
				params.time_in_force = "IOC"
				break
			case "post":
				params.post_only = true
				params.price = price
				params.time_in_force = "GTC"
				break
			case "limit":
				params.price = price
				params.time_in_force = "GTC"
				break
			case "market":
				params.type = "market"
				params.time_in_force = "GTC"
		}
		params.side = Command.isBid ? "buy" : "sell"
		params.product_id = product.id
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(price)
			params.stop = Command.isBid ? "entry" : "loss"
			params.stop_price = sl.resolve(pricePrecision)
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(price)
			params.stop = Command.isBid ? "entry" : "loss"
			params.stop_price = tp.resolve(pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		const response = yield* post.call(this, "/orders", params)
		if (response.hasOwnProperty("status") && response.status === "rejected") {
			throw new Error("Order was rejected: " + response.reject_reason)
		}

		return response
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
