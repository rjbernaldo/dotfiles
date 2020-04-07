"use strict"
window.DERIBIT_TESTNET_NONCE = 0
window.DERIBIT_TESTNET_NONCE_OFFSET = -1
window.DERIBIT_TESTNET_SYMBOLS = {}
window.DERIBIT_TESTNET_SYMBOLS_UPDATED = 0
/**
 *
 * @returns {*}
 * @constructor
 */
function DeribitTestnet() {
	let state = {
		aliases: [
			"DERIBITTESTNET",
			"DERIBIT-TESTNET",
		],
		endpoint: "https://test.deribit.com/",
		fields: {
			public: {
				label: "Access Key",
				message: "",
			},
			private: {
				label: "Access Secret",
				message: "",
			},
		},
		name: "Deribit Testnet (beta)",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.deribit.com/*"
			],
		},
		subscriptions: {
			active: [

			],
			inactive: [

			],
		},
		website: "https://test.deribit.com/reg-564.9105?q=home",
	}

	function* account(currency) {
		const query = {}
		query.currency = currency

		const account = yield* get.call(this, "private/get_account_summary", query)

		return {
			available: account.available_funds,
			balance: account.equity,
		}
	}

	function* get(resource, query) {
		return yield* make.call(this, "GET", resource, query)
	}

	function getContracts(market, price, quantity) {
		return Math.floor(quantity * price)
	}

	function* getCurrencies() {
		return yield* get.call(this, "public/get_currencies")
	}

	function* getNonce() {
		let nonce = Math.round(Date.now() / 1000) * 1000 // second precision

		if (window.DERIBIT_TESTNET_NONCE != nonce) {
			window.DERIBIT_TESTNET_NONCE_OFFSET = -1
		}

		window.DERIBIT_TESTNET_NONCE = nonce
		window.DERIBIT_TESTNET_NONCE_OFFSET++

		nonce += window.DERIBIT_TESTNET_NONCE_OFFSET

		return nonce
	}

	function* make(method, resource, parameters, headers, format) {
		method = method.toUpperCase()
		parameters = parameters || {}
		format = format || "json"

		headers = headers || {}
		headers["Content-Type"] = "application/json"

		const nonce = yield* getNonce()
		const now = Date.now()
		const path = "/api/v2/" + resource.replace(/^\/+/, "")
		const query = parameters ? "?" + serialize(parameters) : ""

		// Authentication
		if (path.includes("/private/")) {
			const credentials = yield* this.getExchangeCredentials("private")
			const signature = () => {
				const data = [
					now,
					nonce,
					method,
					path + query,
					"",
				].join("\n") + "\n"

				const sha = new jsSHA("SHA-256", "TEXT")
				sha.setHMACKey(credentials.private, "TEXT")
				sha.update(data)
				return sha.getHMAC("HEX")
			}

			const type = "deri-hmac-sha256"
			const authorization = "id=" + credentials.public + ",ts=" + now + ",sig=" + signature() + ",nonce=" + nonce

			headers["Authorization"] = type + " " + authorization
		}

		// Request
		resource = state.endpoint + path.replace(/^\/+/, "")

		try {
			const func = method.toLowerCase() + "Request"
			const response = yield* this[func](resource, parameters, headers, format)
			const success = response.testnet || response.result || response.error || false

			if (!response || !success) {
				throw new Error("Unexpected response received")
			}
			if (response.error) {
				throw new Error("#" + response.error.code + ": " + response.error.message)
			}

			return response.result
		} catch (e) {
			throw new Error(e.error.message)
		}
	}

	function* ordersCancel(order) {
		let params = {}
		params.order_id = order.order_id

		const response = yield* get.call(this, "private/cancel", params)

		return response.order_id === order.order_id
	}

	function* ordersCancelAll(Command) {
		let orders = yield* ordersOpen.call(this, Command.s)

		orders = orders.filter((order) => {
			if (Command.b && ((Command.isBid && order.direction !== "buy") || (Command.isAsk && order.direction !== "sell"))) {
				return false // buy (long), sell (short)
			}
			if (Command.fp && Command.fp.compare(order.price)) {
				return false // Price mismatch
			}
			if (Command.t === "open" && order.order_type.includes("stop")) {
				return false // Type mismatch
			}
			if (Command.t === "close" && !order.order_type.includes("stop")) {
				return false
			}

			return true
		})

		// Limit the number of cancelled orders by the requested "Cancel Maximum"
		const end = Command.cm.reference(orders.length).resolve(0)
		if (Command.cm.getMax() < orders.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(orders, "creation_timestamp", true)
					break
				case "oldest":
					sortByIndex(orders, "creation_timestamp")
					break
				case "lowest":
					sortByIndex(orders, "price")
					break
				case "highest":
					sortByIndex(orders, "price", true)
					break
				case "smallest":
					sortByIndex(orders, "amount")
					break
				case "biggest":
					sortByIndex(orders, "amount", true)
					break
				case "random":
					shuffle(orders)
			}
			orders = orders.slice(0, end)
		}

		for (let i = 0; i < orders.length; i++) {
			const order = orders[i]
			if (Command.d) {
				Verbose().info(this.getExchangeName(), "Order", order.amount, "@", order.price, "would be cancelled")
			} else {
				yield* ordersCancel.call(this, order)
			}
		}
	}

	function* ordersOpen(instrument) {
		let query = {}
		query.instrument_name = instrument
		query.type = "all"

		return yield* get.call(this, "private/get_open_orders_by_instrument", query)
	}

	function* positionsClose(Command, position) {
		const market = yield* symbolInfo.call(this, Command.s)
		const ticker = yield* symbolTicker.call(this, Command.s)

		const first = Command.ps === "position"
			? position.average_price
			: (((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask)
		const pricePrecision = market.price_precision || 8
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)
		const quantityPrecision = decimals(market.contract_size) || 0
		const contracts = (!Command.q.getIsPercent() && Command.u === "currency")
			? NumberObject(getContracts(market, price, Command.q.resolve(8)))
			: Command.q.reference(Math.abs(position.size))
		const quantity = contracts.stepping(market.contract_size).resolve(quantityPrecision)
		const direction = position.direction === "buy" ? "sell" : "buy"

		let params = {}
		params.instrument_name = Command.s
		if (Command.hasOwnProperty("h")) {
			params.max_show = Command.h.reference(quantity).stepping(market.contract_size).resolve(quantityPrecision)
		}
		if (Command.t !== "market") {
			params.price = price
		}
		params.amount = quantity
		params.type	= Command.t === "market" ? "market" : "limit" // "limit", "stop_limit", "market", "stop_market"
		switch (Command.t) {
			case "fok":
				params.time_in_force = "fill_or_kill"
				break
			case "ioc":
				params.time_in_force = "immediate_or_cancel"
				break
			case "post":
				params.post_only = true
				break
			case "market":
			default:
				params.time_in_force = "good_til_cancelled"
		}
		if (Command.ro) {
			params.reduce_only = true
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.trigger = "last_price"
			params.type = "stop_" + params.type
			params.stop_price = tp.resolve(pricePrecision)
		}
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.trigger = "last_price"
			params.type = "stop_" + params.type
			params.stop_price = sl.resolve(pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* get.call(this, "private/" + direction, params)
	}

	function* positionsCloseAll(Command) {
		const market = yield* symbolInfo.call(this, Command.s)
		let positions = yield* positionsOpen.call(this, market.base_currency)

		positions = positions.filter((position) => {
			if (Command.b && ((Command.isBid && position.direction !== "buy") || (Command.isAsk && position.direction !== "sell"))) {
				return false // buy (long), sell (short); Book mismatch
			}
			if (Command.fp && Command.fp.compare(position.average_price)) {
				return false // Price mismatch
			}
			if (Command.s !== position.instrument_name) {
				return false // Market mismatch
			}

			return true
		})

		// Limit the number of closed positions by the requested "Close Maximum"
		const end = Command.cm.reference(positions.length).resolve(0)
		if (Command.cm.getMax() < positions.length) {
			switch (Command.cmo) {
				case "newest":
				case "oldest":
					Verbose().warn("Close Maximum Order [" + Command.cmo + "] is currently not supported.")
					break
				case "lowest":
					sortByIndex(positions, "average_price")
					break
				case "highest":
					sortByIndex(positions, "average_price", true)
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

	function* positionsOpen(currency) {
		const query = {}
		query.currency = currency

		return yield* get.call(this, "private/get_positions", query)
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 900000 // 15 minutes
		if (window.DERIBIT_TESTNET_SYMBOLS_UPDATED < expired) {
			const currencies = yield* getCurrencies.call(this)
			for (let i = 0; i < currencies.length; i++) {
				const currency = currencies[i]
				const query = {
					currency: currency.currency,
				}
				const instruments = yield* get.call(this, "public/get_instruments", query)
				instruments.forEach((instrument) => {
					instrument.price_precision = decimals(instrument.tick_size) + instrument.tick_size
					window.DERIBIT_TESTNET_SYMBOLS[instrument.instrument_name] = instrument
					window.DERIBIT_TESTNET_SYMBOLS_UPDATED = Date.now()
				})
			}
		}

		if (!window.DERIBIT_TESTNET_SYMBOLS.hasOwnProperty(symbol)) {
			throw new Error("Symbol not supported: " + symbol)
		}

		return window.DERIBIT_TESTNET_SYMBOLS[symbol]
	}

	function* symbolTicker(instrument) {
		let query = {}
		query.instrument_name = instrument

		const ticker = yield* get.call(this, "public/ticker", query)

		return {
			ask: ticker.best_ask_price,
			bid: ticker.best_bid_price,
		}
	}

	function* testCommand() {
		const symbol = "BTC-PERPETUAL"
		const market = yield* symbolInfo.call(this, symbol)
		return yield* account.call(this, market.base_currency)
	}

	function* time() {
		const serverTime = yield* get.call(this, "public/get_time")
		const epoch = Date.now()
		const offset = (epoch - serverTime) / 1000

		Verbose().info(this.getExchangeName(), "time", serverTime, "Autoview time", epoch, "Offset", offset, "seconds")
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const market = yield* symbolInfo.call(this, Command.s)
		const balance = yield* account.call(this, market.base_currency)
		const ticker = yield* symbolTicker.call(this, Command.s)

		const available = Command.y === "equity" ? balance.balance : balance.available
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask
		const pricePrecision = market.price_precision || 8
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)
		const quantityPrecision = decimals(market.contract_size) || 0
		const contracts = (!Command.q.getIsPercent() && Command.u === "currency")
			? NumberObject(getContracts(market, price, Command.q.resolve(8)))
			: Command.q.reference(getContracts(market, price, available))
		const quantity = contracts.stepping(market.contract_size).resolve(quantityPrecision)
		const direction = Command.isBid ? "buy" : "sell"

		let params = {}
		params.instrument_name = Command.s
		if (Command.hasOwnProperty("h")) {
			params.max_show = Command.h.reference(quantity).stepping(market.contract_size).resolve(quantityPrecision)
		}
		if (Command.t !== "market") {
			params.price = price
		}
		params.amount = quantity
		params.type	= Command.t === "market" ? "market" : "limit" // "limit", "stop_limit", "market", "stop_market"
		switch (Command.t) {
			case "fok":
				params.time_in_force = "fill_or_kill"
				break
			case "ioc":
				params.time_in_force = "immediate_or_cancel"
				break
			case "post":
				params.post_only = true
				break
			case "market":
			default:
				params.time_in_force = "good_til_cancelled"
		}
		if (Command.ro) {
			params.reduce_only = true
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.trigger = "last_price"
			params.type = "stop_" + params.type
			params.stop_price = tp.resolve(pricePrecision)
		}
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.trigger = "last_price"
			params.type = "stop_" + params.type
			params.stop_price = sl.resolve(pricePrecision)
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* get.call(this, "private/" + direction, params)
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
