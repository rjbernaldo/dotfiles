"use strict"
window.OANDA_PRACTICE_SYMBOLS = {}
window.OANDA_PRACTICE_SYMBOLS_UPDATED = 0
/**
 *
 * @returns {*}
 * @constructor
 */
function OANDAPractice() {
	let state = {
		aliases: [
			"OANDAPRACTICE",
			"OANDA-PRACTICE",
		],
		endpoint: "https://api-fxpractice.oanda.com/",
		fields: {
			id: {
				label: "Account ID",
				message: "",
			},
			private: {
				label: "Access Token",
				message: "",
			},
		},
		name: "OANDA Practice (beta)",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.oanda.com/*",
			],
		},
		subscriptions: {
			active: [

			],
			inactive: [

			],
		},
		website: "https://www.oanda.com/",
	}

	function* account() {
		const credentials = yield* this.getExchangeCredentials("private")
		const accounts = yield* get.call(this, "/v3/accounts/" + credentials.id)
		const account = accounts.account
		const balance = Number(account.balance)
		const pl = Number(account.pl)

		return {
			available: balance + pl,
			balance: balance,
		}
	}

	function* get(resource, query) {
		return yield* make.call(this, "GET", resource, query)
	}

	function* instrument(instrument) {
		const expired = Date.now() - 900000 // 15 minutes
		if (window.OANDA_PRACTICE_SYMBOLS_UPDATED < expired) {
			const response = yield* get.call(this, "/v3/accounts/{accountID}/instruments")
			response.instruments.forEach((Instrument) => {
				window.OANDA_PRACTICE_SYMBOLS[Instrument.name] = Instrument
				window.OANDA_PRACTICE_SYMBOLS_UPDATED = Date.now()
			})
		}

		for (const name in window.OANDA_PRACTICE_SYMBOLS) {
			if (window.OANDA_PRACTICE_SYMBOLS.hasOwnProperty(name)) {
				const Instrument = window.OANDA_PRACTICE_SYMBOLS[name]
				if (Instrument.hasOwnProperty("displayName")) {
					const displayName = Instrument.displayName.toUpperCase()
					if (instrument === displayName) {
						instrument = Instrument.name
					}
				}
			}
		}

		if (!window.OANDA_PRACTICE_SYMBOLS.hasOwnProperty(instrument)) {
			throw new Error("Instrument not supported: " + instrument)
		}

		return window.OANDA_PRACTICE_SYMBOLS[instrument]
	}

	function* instrumentTicker(instrument) {
		let query = {}
		query.instruments = instrument

		const pricing = yield* get.call(this, "/v3/accounts/{accountID}/pricing", query)
		const prices = pricing.prices[0]
		const asks = prices.asks
		const bids = prices.bids
		const topAsk = asks.shift()
		const topBid = bids.shift()

		return {
			ask: topAsk.price,
			bid: topBid.price,
		}
	}

	function* make(method, resource, parameters, headers, format) {
		method = method.toUpperCase()
		parameters = parameters || {}
		format = format || "json"

		headers = headers || {}
		headers["Content-Type"] = "application/json"

		// Authentication
		const credentials = yield* this.getExchangeCredentials("private")
		headers["Accept-Datetime-Format"] = "UNIX"
		headers["Authorization"] = "Bearer " + credentials.private

		// Request
		resource = resource
			.replace(/^\/+/, "")
			.replace("{accountID}", credentials.id)

		if (parameters && method !== "GET") {
			parameters = JSON.stringify(parameters)
		}

		this.util.setOption("ignoreResponseCode", true)

		const func = method.toLowerCase() + "Request"
		const response = yield* this[func](state.endpoint + resource, parameters, headers, format)

		if (response.errorMessage) {
			throw new Error(response.errorMessage)
		}

		return response
	}

	function* order(params) {
		const response = yield* post.call(this, "/v3/accounts/{accountID}/orders", {
			order: params,
		})

		if (response.hasOwnProperty("orderCancelTransaction")) {
			throw new Error(response.orderCancelTransaction.reason)
		}

		return response
	}

	function* ordersCancel(order) {
		const response = yield* make.call(this, "PUT", "/v3/accounts/{accountID}/orders/" + order.id + "/cancel")

		return response
			&& response.hasOwnProperty("orderCancelTransaction")
			&& response.orderCancelTransaction.orderID === order.id
	}

	function* ordersCancelAll(Command) {
		const market = yield* instrument.call(this, Command.s)
		let orders = yield* ordersOpen.call(this, market.name)

		orders = orders.filter((order) => {
			const side  = order.units < 0 ? "ask" : "bid"
			if (Command.b && ((Command.isBid && side !== "bid") || (Command.isAsk && side !== "ask"))) {
				return false // buy (long), sell (short)
			}
			if (Command.fp && Command.fp.compare(order.price)) {
				return false // Price mismatch
			}
			if (Command.t === "open" && order.type !== "LIMIT") {
				return false // Order Type mismatch
			}
			if (Command.t === "close" && order.type === "LIMIT") {
				return false // Order Type mismatch
			}
			if (Command.tp && order.type !== "TAKE_PROFIT") {
				return false // Order Type mismatch
			}
			if (Command.sl && order.type !== "STOP_LOSS") {
				return false // Order Type mismatch
			}
			if (Command.ts && order.type !== "TRAILING_STOP_LOSS") {
				return false // Order Type mismatch
			}

			return true
		})

		// Limit the number of cancelled orders by the requested "Cancel Maximum"
		const end = Command.cm.reference(orders.length).resolve(0)
		if (Command.cm.getMax() < orders.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(orders, "createTime", true)
					break
				case "oldest":
					sortByIndex(orders, "createTime")
					break
				case "lowest":
					sortByIndex(orders, "price")
					break
				case "highest":
					sortByIndex(orders, "price", true)
					break
				case "smallest":
					sortByIndex(orders, "units")
					break
				case "biggest":
					sortByIndex(orders, "units", true)
					break
				case "random":
					shuffle(orders)
			}
			orders = orders.slice(0, end)
		}

		for (let i = 0; i < orders.length; i++) {
			const order = orders[i]
			if (Command.d) {
				const description = order.hasOwnProperty("units") ? order.units : order.type
				Verbose().info(this.getExchangeName(), "Order", description, "@", order.price, "would be cancelled")
			} else {
				yield* ordersCancel.call(this, order)
			}
		}
	}

	function* ordersOpen(instrument) {
		let query = {}
		query.count = 500
		query.instrument = instrument
		query.state = "PENDING"

		const response = yield* get.call(this, "/v3/accounts/{accountID}/orders", query)
		const orders = response.orders

		if (orders.length === 500) {
			Verbose().warn(this.getExchangeName(), "limits the maximum number of Orders to return  to 500. Not all Open Orders may not be present.")
		}

		return orders
	}

	function* positionsClose(Command, data) {
		const market = yield* instrument.call(this, Command.s)
		const ticker = yield* instrumentTicker.call(this, market.name)

		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask
		const isBid = data.long.units > 0
		const position = isBid ? data.long : data.short
		const pricePrecision = market.displayPrecision || 5
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)
		const quantityPrecision = market.tradeUnitsPrecision || 0
		const quantity = Command.q.reference(Math.abs(position.units)).resolve(quantityPrecision)
		const direction = isBid ? -1 : 1

		if (Command.ftp || Command.fsl || Command.fts || Command.tp || Command.sl || Command.ts) {
			let responses = []
			const tradeIds = position.tradeIDs
			for (let i = 0; i < tradeIds.length; i++) {
				const tradeId = tradeIds[i]
				let params = {}
				params.tradeID = tradeId
				if (Command.ftp || Command.tp) {
					const tp = Command.ftp ? Command.ftp : Command.tp.relative(position.averagePrice)
					params.type = "TAKE_PROFIT"
					params.price = tp.resolve(pricePrecision)
				}
				if (Command.fsl || Command.sl) {
					const sl = Command.fsl ? Command.fsl : Command.sl.relative(position.averagePrice)
					params.type = "STOP_LOSS"
					params.price = sl.resolve(pricePrecision)
				}
				if (Command.fts || Command.ts) {
					const ts = Command.fts ? Command.fts : Command.ts.reference(position.averagePrice).abs()
					params.type = "TRAILING_STOP_LOSS"
					params.distance = ts.resolve(pricePrecision)
				}

				if (Command.d) {
					Verbose().info(this.getExchangeName(), params)
					continue // Disabled
				}

				const response = yield* order.call(this, params)
				responses.push(response)
			}

			return responses
		}

		let params = {}
		params.instrument = market.name
		params.positionFill = Command.ro ? "REDUCE_ONLY" : "DEFAULT"
		params.triggerCondition = "DEFAULT"
		params.units = quantity * direction
		if (Command.t === "market") {
			params.type = "MARKET"
		} else {
			params.price = price
			params.type = "LIMIT"
		}
		switch (Command.t) {
			case "fok":
				params.timeInForce = "FOK"
				break
			case "ioc":
				params.timeInForce = "IOC"
				break
			case "market":
				break
		}
		if (Command.fp) {
			params.type = "FIXED_PRICE"
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* order.call(this, params)
	}

	function positionsNormalize(data) {
		const isBid = data.long.units > 0
		const position = isBid ? data.long : data.short

		Object.keys(position).forEach((key) => {
			data[key] = position[key]
		})

		return data
	}

	function* positionsCloseAll(Command) {
		const market = yield* instrument.call(this, Command.s)
		let positions = yield* positionsOpen.call(this, market.name)
		positions = positions.filter((data) => {
			const isBid = data.long.units > 0
			const position = isBid ? data.long : data.short

			if (data.long.units <= 0 && data.short.units >= 0) {
				return false // Ignore realized profits
			}
			if (market.name !== data.instrument) {
				return false // Market mismatch
			}
			if (Command.b && Command.isBid !== isBid) {
				return false // Book mismatch
			}
			if (Command.fp && Command.fp.compare(position.averagePrice)) {
				return false // Price mismatch
			}

			return true
		})
		positions = positions.map(positionsNormalize)

		// Limit the number of closed positions by the requested "Close Maximum"
		const end = Command.cm.reference(positions.length).resolve(0)
		if (Command.cm.getMax() < positions.length) {
			switch (Command.cmo) {
				case "newest":
				case "oldest":
					Verbose().warn("Close Maximum Order [" + Command.cmo + "] is currently not supported.")
					break
				case "lowest":
					sortByIndex(positions, "averagePrice")
					break
				case "highest":
					sortByIndex(positions, "averagePrice", true)
					break
				case "smallest":
					sortByIndex(positions, "units")
					break
				case "biggest":
					sortByIndex(positions, "units", true)
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

	function* positionsOpen() {
		const response = yield* get.call(this, "/v3/accounts/{accountID}/positions")

		return response.positions || []
	}

	function* post(resource, parameters) {
		return yield* make.call(this, "POST", resource, parameters)
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const balance = yield* account.call(this)
		const direction = Command.isBid ? 1 : -1
		const market = yield* instrument.call(this, Command.s)
		const ticker = yield* instrumentTicker.call(this, market.name)

		const available = Command.y === "equity" ? balance.balance : balance.available
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? ticker.bid : ticker.ask
		const pricePrecision = market.displayPrecision || 5
		const price = Command.fp
			? Command.fp.resolve(pricePrecision)
			: Command.p.relative(first).resolve(pricePrecision)
		const quantityPrecision = market.tradeUnitsPrecision || 0
		const quantity = Command.q.reference(available).resolve(quantityPrecision)

		let params = {}
		params.instrument = market.name
		params.positionFill = Command.ro ? "REDUCE_ONLY" : "DEFAULT"
		params.triggerCondition = "DEFAULT"
		params.units = quantity * direction
		if (Command.t === "market") {
			params.type = "MARKET"
		} else {
			params.price = price
			params.type = "LIMIT"
		}
		switch (Command.t) {
			case "fok":
				params.timeInForce = "FOK"
				break
			case "ioc":
				params.timeInForce = "IOC"
				break
			case "market":
				break
		}
		if (Command.fp) {
			params.type = "FIXED_PRICE"
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			params.takeProfitOnFill = {
				price: tp.resolve(pricePrecision),
			}
		}
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			params.stopLossOnFill = {
				price: sl.resolve(pricePrecision),
			}
		}
		if (Command.fts || Command.ts) {
			const ts = Command.fts ? Command.fts : Command.ts.reference(first).abs()
			params.trailingStopLossOnFill = {
				distance: ts.resolve(pricePrecision),
			}
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		return yield* order.call(this, params)
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
