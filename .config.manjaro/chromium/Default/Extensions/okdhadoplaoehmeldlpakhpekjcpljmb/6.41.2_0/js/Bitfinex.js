"use strict"

window.BITFINEX_NONCE = 0
window.BITFINEX_NONCE_OFFSET = 0
window.BITFINEX_SYMBOLS = {}
window.BITFINEX_SYMBOLS_UPDATED = 0

/**
 *
 * @returns {*}
 * @constructor
 */
function Bitfinex() {
	let state = {
		aliases: [
			"BITFINEX",
		],
		endpoint: "https://api.bitfinex.com",
		fields: {
			public: {
				label: "API key",
				message: "",
			},
			private: {
				label: "API key secret",
				message: "",
			},
		},
		name: "Bitfinex (beta)",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.bitfinex.com/*"
			],
		},
		subscriptions: {
			active: [
				"brnzhjdgkscloyiwtfupevmxaq", // Autoview Bronze
				"brnzvpskjlyxdewhoaguftcqmi", // Autoview Bronze - Yearly
			],
			inactive: [
				"iftdzvqcnoarjswmupxhglybek", // Bitfinex
				"ifcxdtjswkhzoumraeqbngyvpl", // Bitfinex - Yearly
			],
		},
		version: "v1",
		website: "https://www.bitfinex.com/",
	}

	function* account(isMarginTrading) {
		let balances = {}
		if (isMarginTrading) {
			const response = yield* post.call(this, "/margin_infos")
			if (response && response.hasOwnProperty(0) && response[0].hasOwnProperty("margin_limits")) {
				response[0].margin_limits.forEach((marginLimit) => {
					const pair = marginLimit.on_pair.toLowerCase()
					balances[pair] = {
						available: Math.max(0.0, Number(marginLimit.tradable_balance)),
						balance: Math.max(0.0, Number(marginLimit.tradable_balance)),
					}
				})
			}
		} else {
			const response = yield* post.call(this, "/balances")
			response.forEach((balance) => {
				if (balance.type === "exchange") {
					balances[balance.currency] = {
						available: Number(balance.available),
						balance: Number(balance.amount),
					}
				}
			})
		}

		return balances
	}

	function* accountConvertMajor(balances, market, book) {
		const symbol = symbolPair(market)
		const ticker = yield* symbolTicker.call(this, symbol.symbol)
		balances = balancesShiftRight(balances, ticker[book])

		return balances
	}

	function* accountConvertMinor(balances, market, book) {
		const symbol = symbolPair(market)
		const ticker = yield* symbolTicker.call(this, symbol.symbol)
		balances = balancesShiftLeft(balances, ticker[book])

		return balances
	}

	function balancesShiftLeft(balances, amount) {
		for (const currency in balances) {
			if (balances.hasOwnProperty(currency)) {
				balances[currency].available *= amount
				balances[currency].balance *= amount
			}
		}

		return balances
	}

	function balancesShiftRight(balances, amount) {
		for (const currency in balances) {
			if (balances.hasOwnProperty(currency)) {
				balances[currency].available /= amount
				balances[currency].balance /= amount
			}
		}

		return balances
	}

	function* get(resource, query) {
		resource = state.endpoint + "/" + state.version + "/" + resource.replace(/^\/+/, "")

		const credentials = yield* this.getExchangeCredentials("private")

		let headers = {}
		headers["Content-Type"] = "application/json; charset=utf-8"
		headers["X-BFX-APIKEY"] = credentials.public

		return yield* this.getRequest(resource, query, headers, "json")
	}

	function* getNonce() {
		let nonce = Math.round(Date.now() / 1000) * 1000 // second precision

		if (window.BITFINEX_NONCE != nonce) {
			window.BITFINEX_NONCE_OFFSET = -1
		}

		window.BITFINEX_NONCE = nonce
		window.BITFINEX_NONCE_OFFSET++

		nonce += window.BITFINEX_NONCE_OFFSET

		return nonce.toFixed(0)
	}

	function* ordersCancelAll(Command) {
		const pair = symbolPair(Command.s)
		let orders = yield* ordersOpen.call(this, pair.symbol)
		orders = orders.filter((order) => {
			if ((Command.isBid && order.side !== "buy") || (Command.isAsk && order.side !== "sell")) {
				return false // Book mismatch
			}
			if (Command.isMarginTrading && order.type.includes("exchange")) {
				return false // Section mismatch
			}
			if (Command.fp && Command.fp.compare(order.price)) {
				return false // Price mismatch
			}
			if (Command.t === "market" && order.type !== "market") {
				return false // Order Type mismatch
			}
			if (Command.ts && order.type !== "trailing-stop") {
				return false // Order Type mismatch
			}
			if (Command.sl && order.type !== "stop") {
				return false // Order Type mismatch
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
					sortByIndex(orders, "original_amount")
					break
				case "biggest":
					sortByIndex(orders, "original_amount", true)
					break
				case "random":
					shuffle(orders)
			}
			orders = orders.slice(0, end)
		}

		let params = {}
		params.order_ids = []
		for (let i = 0; i < orders.length; i++) {
			const order = orders[i]
			if (Command.d) {
				Verbose().info(this.getExchangeName(), "order", order.remaining_amount, "@", order.price, "would be cancelled.")
			} else {
				params.order_ids.push(order.id)
			}
		}

		if (!params.order_ids.length) {
			return true // Nothing to do
		}

		return yield* post.call(this, "/order/cancel/multi", params)
	}

	function* ordersOpen(symbol) {
		let orders = yield* post.call(this, "/orders")
		orders = orders.filter((order) => {
			if (order.is_cancelled) {
				return false // Already cancelled
			}
			return (order.symbol === symbol) // Market mismatch
		})

		return orders
	}

	function* positionsCloseAll(Command) {
		const pair = symbolPair(Command.s)
		let positions = yield* positionsOpen.call(this, pair.symbol)
		positions = positions.filter((position) => {
			if (Command.isBid && position.amount < 0) {
				return false // Book mismatch
			}
			if (Command.isAsk && position.amount > 0) {
				return false // Book mismatch
			}
			if (pair.symbol !== position.symbol) {
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
					sortByIndex(positions, "basePrice")
					break
				case "highest":
					sortByIndex(positions, "basePrice", true)
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

		if (!positions.length) {
			return false // Nothing to do
		}

		const ticker = yield* symbolTicker.call(this, pair.symbol)
		if (!ticker) {
			throw new ReferenceError("Ticker (" + pair.symbol + ") is not available.")
		}

		const first = Command.ps === "last"
			? ticker.last_price
			: (((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask)
		const market = yield* symbolInfo.call(this, pair.symbol)
		let price = Command.p.relative(first).resolve(market.price_precision || 5)
		if (Command.fp) {
			price = Command.fp.resolve(market.price_precision || 5)
		}

		let params = {
			orders: [],
		}
		for (let i = 0; i < positions.length; i++) {
			const position = positions[i]
			const side = position.amount > 0 ? "sell" : "buy" // Close using opposite
			const amount = Math.abs(position.amount)

			let order = {}
			order.symbol = position.symbol
			order.amount = Command.q.reference(amount).resolve(8)
			order.price = price
			order.side = side
			switch (Command.t) {
				case "fok":
					order.type = "fill-or-kill"
					break
				case "market":
					order.type = "market"
					break
				case "post":
					order.is_postonly = true
				default:
					order.type = "limit"
			}
			if (Command.sl) {
				order.type = "stop"
			}
			if (Command.ts) {
				order.type = "trailing-stop"
			}
			order.exchange = "bitfinex"
			if (Command.h) {
				order.is_hidden = true
			}
			/*if (Command.q.getMax() === 100 && Command.q.isPercent) {
				order.use_all_available = 1
			}*/
			// order.ocoorder = 0
			// order.buy_price_oco = 0
			// order.sell_price_oco = 0

			params.orders.push(order)
		}

		if (Command.d) {
			Verbose().log(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* post.call(this, "/order/new/multi", params)
	}

	function* positionsOpen(symbol) {
		let positions = yield* post.call(this, "/positions")
		positions = positions.filter((position) => {
			if (position.status !== "ACTIVE") {
				return false // Ignore inactive positions
			}
			return position.symbol === symbol
		})

		return positions
	}

	function* post(resource, parameters) {
		const nonce = yield* getNonce()

		// Version (e.g. /v1/) is included in signature
		resource = "/" + state.version + "/" + resource.replace(/^\/+/, "")

		parameters = parameters || {}
		parameters.request = resource
		parameters.nonce = nonce

		const credentials = yield* this.getExchangeCredentials("private")
		const data = JSON.stringify(parameters)
		const payload = window.btoa(data) // base64
		const signature = () => {
			let sha = new jsSHA("SHA-384", "TEXT")
			sha.setHMACKey(credentials.private, "TEXT")
			sha.update(payload)
			return sha.getHMAC("HEX")
		}

		let headers = {}
		headers["Content-Type"] = "application/json; charset=utf-8"
		headers["X-BFX-APIKEY"] = credentials.public
		headers["X-BFX-PAYLOAD"] = payload
		headers["X-BFX-SIGNATURE"] = signature()

		resource = state.endpoint + resource

		try {
			const response = yield* this.postRequest(resource, data, headers, "json")

			return response
		} catch (ex) {
			if (ex.hasOwnProperty("error")) {
				throw new Error(ex.error)
			}
			if (ex.hasOwnProperty("message")) {
				throw new Error(ex.message)
			}
			throw new Error("An unknown error has occurred.")
		}
	}

	function* symbolInfo(symbol) {
		const expired = Date.now() - 900000 // 15 minutes
		if (window.BITFINEX_SYMBOLS_UPDATED < expired) {
			const response = yield* get.call(this, "/symbols_details")
			response.forEach((info) => {
				window.BITFINEX_SYMBOLS[info.pair] = info
				window.BITFINEX_SYMBOLS_UPDATED = Date.now()
			})
		}

		if (!window.BITFINEX_SYMBOLS.hasOwnProperty(symbol)) {
			throw new Error("Unknown market symbol: " + symbol)
		}

		return window.BITFINEX_SYMBOLS[symbol]
	}

	function symbolPair(symbol) {
		symbol = symbol.toLowerCase()
		const reg = /^(.+)(btc|gbp|eos|eth|eur|jpy|usd)$/i
		const result = reg.exec(symbol)
		let so = {}

		if (!result) {
			throw new Error("Unknown market symbol: " + symbol)
		}

		so.main = result ? result[2] : ""
		so.pair = result ? result[1] : ""
		so.precision = 8
		so.symbol = so.pair + so.main

		return so
	}

	function* symbolTicker(symbol) {
		const resource = "/pubticker/" + symbol
		const ticker = yield* get.call(this, resource, null, null, "json")

		return ticker
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* transferBalances(Command) {
		if (Command.w.length > 1) {
			throw new SyntaxError("Due to Bitfinex's balance checking, multiple transfers per Command are not supported.")
		}

		const balances = {
			exchange: {},
			margin: {},
		}

		const response = yield* post.call(this, "/balances")
		response.forEach((balance) => {
			const currency = balance.currency.toUpperCase()
			switch (balance.type) {
				case "exchange":
					balances.exchange[currency] = Number(balance.available)
					break
				case "trading":
					balances.margin[currency] = Number(balance.available)
			}
		})

		switch (Command.y) {
			case "margin": // spot => margin
				for (const currency in balances.exchange) {
					if (balances.exchange.hasOwnProperty(currency) && Command.w.includes(currency)) {
						const balance = balances.exchange[currency]
						const quantity = Command.q.reset().reference(balance)
						if (quantity.compare(0.0) !== 0) {
							yield* transferCoins.call(this, Command.y, currency, quantity.resolve(8), Command.d)
						}
					}
				}
				break;

			case "spot": // margin => spot
				for (const currency in balances.margin) {
					if (balances.margin.hasOwnProperty(currency) && Command.w.includes(currency)) {
						const balance = balances.margin[currency]
						const quantity = Command.q.reset().reference(balance)
						if (quantity.compare(0.0) !== 0) {
							yield* transferCoins.call(this, Command.y, currency, quantity.resolve(8), Command.d)
						}
					}
				}
				break;

			default:
				throw new SyntaxError("Wallet Account not found: " + Command.y)
		}
	}

	function* transferCoins(destination, currency, amount, debug) {
		const source = destination === "margin" ? "exchange" : "margin"

		let params = {}
		params.amount = amount
		params.currency = currency
		params.walletfrom = source
		params.walletto = destination === "margin" ? "margin" : "exchange"

		if (debug) {
			Verbose().info(this.getExchangeName(), "Transferring", amount, currency, "from", source, "to", destination)
			return false // Disabled
		}

		const response = yield* post.call(this, "/transfer", params)
		for (let i = 0; i < response.length; i++) {
			const data = response[i]
			if (data.hasOwnProperty("status") && data.status === "error") {
				throw new Error(data.message)
			}
		}
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const book = Command.ps === "last"
			? "last_price"
			: (((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? "bid" : "ask")
		const pair = symbolPair(Command.s)
		const market = yield* symbolInfo.call(this, pair.symbol)
		if (Command.isMarginTrading && !market.margin) {
			throw new SyntaxError("Market (" + pair.symbol +") is not available for leveraged trading.")
		}
		let balances = yield* account.call(this, Command.isMarginTrading)
		let currency = Command.isBid ? pair.main : pair.pair
		if (Command.isMarginTrading) {
			currency = pair.symbol
		}
		if (!balances.hasOwnProperty(currency)) {
			balances[currency] = {
				available: 0.0,
				balance: 0.0,
			}
		}
		const ticker = yield* symbolTicker.call(this, pair.symbol)
		if (!ticker) {
			throw new ReferenceError("Ticker (" + pair.symbol + ") is not available.")
		}
		const first = ticker[book]
		let price = Command.p.relative(first).resolve(market.price_precision || 5, true)
		if (Command.fp) {
			price = Command.fp.resolve(market.price_precision || 5, true)
		}

		if (Command.isMarginTrading) {
			switch (pair.main) {
				// A] USD => BTC (pair)
				// B] USD => BTC => main => pair
				case "eur":
				case "gbp":
				case "jpy":
					balances = yield* accountConvertMajor.call(this, balances, "btcusd", book)
					if (pair.pair !== "btc") {
						balances = yield* accountConvertMinor.call(this, balances, "btc" + pair.main, book)
						balances = balancesShiftRight(balances, price)
					}
					break
				// USD => main => pair
				case "btc":
				case "eth":
					balances = yield* accountConvertMajor.call(this, balances, pair.main + "usd", book)
					balances = balancesShiftRight(balances, price)
					break
				// USD => pair
				case "usd":
					balances = balancesShiftRight(balances, price)
			}
		} else if (Command.isBid) {
			// main => pair
			balances = balancesShiftRight(balances, price)
		}

		const balance = balances[currency]
		const available = Command.y === "equity" ? balance.balance : balance.available

		if (Command.isBid) {
			if (!Command.q.getIsPercent() && Command.u === "currency") {
				Command.q.div(price) // main => pair
			}
		} else {
			if (!Command.q.getIsPercent() && Command.u === "currency") {
				Command.q.div(price) // main => pair
			}
		}
		Command.q.reference(available) // pair

		let order = {}
		order.symbol = pair.symbol
		order.amount = Command.q.resolve(8)
		order.price = price
		order.side = Command.isBid ? "buy" : "sell"
		switch (Command.t) {
			case "fok":
				order.type = "fill-or-kill"
				break
			case "market":
				order.type = "market"
				break
			case "post":
				order.is_postonly = true
			default:
				order.type = "limit"
		}
		if (Command.ts) {
			order.type = "trailing-stop"
		}
		if (Command.sl) {
			order.type = "stop"
		}
		if (!Command.isMarginTrading) {
			order.type = "exchange " + order.type
		}
		order.exchange = "bitfinex"
		if (Command.h) {
			order.is_hidden = true
		}
		/*if (Command.q.getMax() === 100 && Command.q.isPercent) {
			order.use_all_available = 1
		}*/
		// order.ocoorder = 0
		// order.buy_price_oco = 0
		// order.sell_price_oco = 0

		if (Command.d) {
			Verbose().log(this.getExchangeName(), order)
			return false // Disabled
		}

		return yield* post.call(this, "/order/new", order)
	}


	return Object.assign(
		{},
		Exchange(state),
		{
			exchangeOrdersCancelAll: ordersCancelAll,
			exchangePositionsCloseAll: positionsCloseAll,
			exchangeTrade: trade,
			exchangeTransferBalances: transferBalances,
			getExchangeTestCommand: testCommand,
		}
	)
}
