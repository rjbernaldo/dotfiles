"use strict"
window.BITMEX_LEVERAGE = null
window.BITMEX_LISTENER = window.BITMEX_LISTENER || false

/**
 *
 * @returns {*}
 * @constructor
 */
function BitMEX() {
	let state = {
		aliases: [
			"BITMEX",
		],
		endpoint: "https://www.bitmex.com",
		fields: {
			public: {
				label: "ID",
				message: "",
			},
			private: {
				label: "Secret",
				message: "",
			}
		},
		name: "BitMEX",
		patterns: [

		],
		permissions: {
			origins: [
				"https://*.bitmex.com/*"
			],
			permissions: [
				"webRequest",
				"webRequestBlocking",
			],
		},
		subscriptions: {
			active: [
				"brnzhjdgkscloyiwtfupevmxaq", // Autoview Bronze
				"brnzvpskjlyxdewhoaguftcqmi", // Autoview Bronze - Yearly
			],
			inactive: [
				"dnsfjeqaixybukltmcorhvzpwg", // BitMEX - Yearly
				"dvytfuxeilgabhpcqknmjosrzw", // BitMEX
			],
		},
		website: "https://www.bitmex.com/register/vrkVRt",
	}

	function* account() {
		let params = {}
		params.currency = "all"

		let data = (yield* get.call(this, "/user/margin", params)) || []
		let balances = {}
		for (let i = 0; i < data.length; i++) {
			const item = data[i]
			const currency = item.currency.toUpperCase()

			balances[currency] = {
				available: item.availableMargin / 100000000,
				balance: item.marginBalance / 100000000
			}
		}

		return balances
	}

	function addRequestListener() {
		// BitMEX prevents JavaScript based requests via their X-Frame-Options header
		// Thus we need to capture and remove our "Origin" header
		if (!window.BITMEX_LISTENER) {
			window.BITMEX_LISTENER = true

			chrome.webRequest.onBeforeSendHeaders.addListener(
				function (details) {
					for (let i = 0; i < details.requestHeaders.length; i++) {
						const header = details.requestHeaders[i]
						// Remove "Origin" header ONLY from Autoview's requests
						if (header.name === "Origin" && header.value.includes(chrome.runtime.id)) {
							details.requestHeaders.splice(i, 1);
							break;
						}
					}

					return {
						requestHeaders: details.requestHeaders
					}
				},
				{
					urls: [
						"https://*.bitmex.com/*"
					]
				},
				[
					"blocking",
					"requestHeaders"
				]
			)
		}

		return true
	}

	function* get(resource, query, headers) {
		query = query || {}

		if (query) {
			resource = resource + "?" + serialize(query).replace("%20", "+")
		}

		return yield* make.call(this, "GET", resource, null, headers)
	}

	function getContracts(market, balance, leverage, price, applyFee) {
		if (applyFee) {
			const takerFee = 0.075 / 100
			const fee = (takerFee * leverage) + (takerFee * leverage) // Entry + Exit
			const margin = balance * fee
			balance -= margin
		}
		balance *= leverage
		const satoshi = 100000000
		const multiplier = market.multiplier > 0 ? market.multiplier / satoshi : 1
		const contracts = market.isInverse
			? balance * price / multiplier
			: balance / price / multiplier

		return Math.floor(contracts)
	}

	function* make(method, resource, parameters, headers) {
		parameters = parameters || {}

		headers = headers || {}

		resource = "/api/v1" + resource

		parameters = serialize(parameters).replace("%20", "+")

		addRequestListener()

		let attempts = 1
		const credentials = yield* this.getExchangeCredentials("private")
		while (true) {
			const expires = Math.ceil(Date.now() / 1000) + 15 // seconds
			const data = method + resource + expires + parameters

			headers["api-expires"] = expires
			headers["api-key"] = credentials.public
			headers["api-signature"] = signature(credentials, data)

			try {
				const func = method.toLowerCase() + "Request" // e.g. deleteRequest, postRequest
				const response = yield* this[func](state.endpoint + resource, parameters, headers, "json")

				return response
			} catch (ex) {
				const headers = this.getResponseHeaders() || []
				const settings = yield* StorageInternal("sync").getStorageValue("settings") || {}
				const retries = settings.bitmex_retries || 0
				const timeout = settings.bitmex_retry_delay || 1000
				const target = ex.target || {}

				const is503 = headers.hasOwnProperty("status") ? headers.status === "503" : false
				const isThrottle = typeof target.status !== "undefined" ? target.status === 0 : false
				if (is503 || isThrottle) {
					if (attempts >= retries) {
						Verbose().warn("Maximum retries reached: " + retries)
						return null
					}
					attempts++

					const seconds = Math.ceil(timeout / 1000)
					yield sleep.bind(this, seconds)
				} else {
					if (ex.hasOwnProperty("message")) {
						throw new Error(ex.message)
					}
					if (ex.hasOwnProperty("error")) {
						throw new Error(ex.error.message)
					}

					throw new Error("An unknown error has occurred.")
				}
			}
		}
	}

	function* ordersCancel(order) {
		let params = {}
		params.orderID = order.orderID

		return yield* make.call(this, "DELETE", "/order", params)
	}

	function* ordersCancelAll(Command) {
		let orders = yield* ordersOpen.call(this, Command)

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
					sortByIndex(orders, "orderQty")
					break
				case "biggest":
					sortByIndex(orders, "orderQty", true)
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
		const pair = symbolPair(Command.s)

		const market = yield* symbolInfo.call(this, pair.symbol)
		if (!market) {
			throw new ReferenceError("Ticker (" + pair.symbol + ") is not available.")
		}

		let filter = {}
		filter.open = true
		if (Command.b) {
			filter.side = Command.isBid ? "Buy" : "Sell"
		}
		if (Command.fp) {
			filter.price = Command.fp.resolve(market.precision)
		}

		let params = {}
		params.filter = JSON.stringify(filter)
		params.symbol = pair.symbol

		const profitTypes = ["LimitIfTouched","MarketIfTouched"]
		const stopTypes = ["Stop","StopLimit"]
		const openOrders = yield* get.call(this, "/order", params)
		const orders = openOrders.filter((order) => {
			const isSL = stopTypes.includes(order.ordType) && order.pegPriceType !== "TrailingStopPeg"
			const isTP = profitTypes.includes(order.ordType)
			const isTS = stopTypes.includes(order.ordType) && order.pegPriceType === "TrailingStopPeg"
			const type = order.ordType === "Stop" || order.ordType === "MarketIfTouched" ? "market" : "limit"

			if (Command.hasParameter("t")) {
				if (Command.t === "limit" || Command.t === "market") {
					if (Command.t !== type) {
						return false // Order Type mismatch
					}
				}
				if (isSL || isTP || isTS) {
					if (Command.t === "open") {
						return false // Advanced orders excluded
					}
				} else if (Command.t === "close") {
					return false
				}
			}
			if (Command.hasParameter("sl")) {
				if (Command.sl.compare(0) === 0) {
					if (isSL) {
						return false // Stop Loss excluded
					}
				} else if (!isSL) {
					return false // Not Stop Loss
				}
			}

			if (Command.hasParameter("tp")) {
				if (Command.tp.compare(0) === 0) {
					if (isTP) {
						return false // Take Profit excluded
					}
				} else if (!isTP) {
					return false // Not Take Profit
				}
			}
			if (Command.hasParameter("ts")) {
				if (Command.ts.compare(0) === 0) {
					if (isTS) {
						return false // Trailing Stop excluded
					}
				} else if (!isTS) {
					return false // Not Trailing Stop
				}
			}

			return true
		})

		return orders
	}

	function* positionsClose(Command, position) {
		const pair = symbolPair(Command.s)

		const market = yield* symbolInfo.call(this, pair.symbol)
		if (!market) {
			throw new ReferenceError("Ticker (" + pair.symbol + ") is not available.")
		}

		const top = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? market.bidPrice : market.askPrice
		const first = (Command.ps === "position" || Command.sl || Command.tp || Command.ts) ? position.avgCostPrice : top
		const price = Command.fp
			? Command.fp.resolve(market.precision)
			: Command.p.relative(first).resolve(market.precision)
		if (Command.u === "currency" && !Command.q.getIsPercent()) {
			const contracts = getContracts(market, Command.q.resolve(8), position.leverage, price)
			Command.q = NumberObject(contracts)
		}
		const quantity = Command.q.reference(position.quantity).resolve(0)

		let params = {}
		params.execInst = Command.ro ? "ReduceOnly" : "Close"
		if (Command.t === "post") {
			params.execInst += ",ParticipateDoNotInitiate"
		}
		params.orderQty = quantity
		if (position.currentQty > 0) {
			params.orderQty *= -1
		}
		if (Command.hasOwnProperty("h")) {
			params.displayQty = Command.h.reference(quantity).resolve(0)
		}
		if (Command.t === "market") {
			params.ordType = "Market"
		} else {
			params.ordType = "Limit"
			params.price = price
		}
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(position.avgCostPrice)
			params.ordType = Command.t === "market" ? "Stop" : "StopLimit"
			params.stopPx = sl.resolve(market.precision)
			params.execInst += ",LastPrice" // MarkPrice, LastPrice, IndexPrice
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(position.avgCostPrice)
			params.ordType = Command.t === "market" ? "MarketIfTouched" : "LimitIfTouched"
			params.stopPx = tp.resolve(market.precision)
			params.execInst += ",LastPrice" // MarkPrice, LastPrice, IndexPrice
		}
		if (Command.fts || Command.ts) {
			const ts = Command.fts ? Command.fts : Command.ts.reference(position.avgCostPrice)
			params.ordType = Command.t === "market" ? "Stop" : "StopLimit"
			params.pegPriceType = "TrailingStopPeg"
			params.pegOffsetValue = ts.resolve(market.precision)
			params.execInst += ",LastPrice" // MarkPrice, LastPrice, IndexPrice
		}
		params.symbol = position.symbol

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false
		}

		const order = yield* post.call(this, "/order", params)

		return order
	}

	/**
	 * Note: One position per symbol
	 * @param Command
	 */
	function* positionsCloseAll(Command) {
		const pair = symbolPair(Command.s)

		let filter = {}
		filter.isOpen = true
		if (Command.l) {
			filter.leverage = Command.l
		}
		filter.symbol = pair.symbol

		let query = {}
		query.filter = JSON.stringify(filter)

		let positions = (yield* get.call(this, "/position", query)) || []

		positions = positions.filter((position) => {
			if (Command.isBid && position.currentQty < 0) {
				return false // Book mismatch
			}
			if (Command.isAsk && position.currentQty > 0) {
				return false // Book mismatch
			}

			position.quantity = Math.abs(position.currentQty)

			// Open orders in the opposite book "deduct" from a position's quantity
			if (position.currentQty > 0) {
				position.quantity -= position.openOrderSellQty
			} else {
				position.quantity -= position.openOrderBuyQty
			}

			if (position.quantity <= 0) {
				return false // Position allocated
			}

			return true
		})

		// Limit the number of closed positions by the requested "Close Maximum"
		const end = Command.cm.reference(positions.length).resolve(0)
		if (Command.cm.getMax() < positions.length) {
			switch (Command.cmo) {
				case "newest":
					sortByIndex(positions, "timestamp", true)
					break
				case "oldest":
					sortByIndex(positions, "timestamp")
					break
				case "lowest":
					sortByIndex(positions, "avgCostPrice")
					break
				case "highest":
					sortByIndex(positions, "avgCostPrice", true)
					break
				case "smallest":
					sortByIndex(positions, "quantity")
					break
				case "biggest":
					sortByIndex(positions, "quantity", true)
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

	function* setLeverage(symbol, leverage) {
		if (window.BITMEX_LEVERAGE === leverage) {
			return true
		}

		window.BITMEX_LEVERAGE = leverage

		let params = {}
		params.symbol = symbol
		params.leverage = leverage

		const response = yield* post.call(this, "/position/leverage", params)

		return response
	}

	function signature(credentials, data) {
		let sha = new jsSHA("SHA-256", "TEXT")
		sha.setHMACKey(credentials.private, "TEXT")
		sha.update(data)

		return sha.getHMAC("HEX")
	}

	function symbolPair(symbol) {
		symbol = symbol.toUpperCase()

		let so = {}
		so.main = ""
		so.pair = ""
		so.precision = 8
		so.symbol = symbol

		return so
	}

	function* symbolInfo(symbol) {
		let query = {}
		query.symbol = symbol

		let instrument = yield* get.call(this, "/instrument", query)
		if (instrument.length === 0) {
			throw new Error("Instrument '" + symbol + "' was not found.")
		}

		instrument = instrument.shift()
		instrument.precision = 0

		let tickSize = instrument.tickSize
		while (tickSize < 1) {
			instrument.precision++
			tickSize *= 10
		}
		// Precision does not dictate stepping
		if (tickSize !== 1) {
			instrument.precision += instrument.tickSize
		}

		return instrument
	}

	function* testCommand() {
		return yield* account.call(this)
	}

	function* trade(Command) {
		if (!Command.b) {
			throw new SyntaxError("Command [b]ook parameter is invalid.")
		}

		const pair = symbolPair(Command.s)
		const balances = yield* account.call(this)
		const currency = "XBT"
		if (!balances.hasOwnProperty(currency)) {
			throw new ReferenceError("Account Balance (" + currency + ") not available.")
		}

		const market = yield* symbolInfo.call(this, pair.symbol)
		if (!market) {
			throw new ReferenceError("Ticker (" + pair.symbol + ") is not available.")
		}

		const balance = balances[currency]
		const available = Command.y === "equity" ? balance.balance : balance.available
		const cross = Command.hasOwnProperty("l") && Command.l === 0
		const first = ((Command.isBid && Command.t !== "market") || (Command.isAsk && Command.t === "market")) ? market.bidPrice : market.askPrice
		let price = Command.p.relative(first).resolve(market.precision)
		if (Command.fp) {
			price = Command.fp.resolve(market.precision)
		}
		const leverage = cross ? 100 : Command.l || 1
		const contracts = getContracts(market, available, leverage, price, true)
		let side = Command.isBid ? "Buy" : "Sell"
		let execInst = []

		let params = {}
		if (Command.t === "post") {
			execInst.push("ParticipateDoNotInitiate")
		}
		if (Command.ro) {
			execInst.push("ReduceOnly")
		}
		if (Command.u === "currency") {
			params.simpleOrderQty = Command.q.reference(available).resolve(market.precision) // e.g. BTC
		} else {
			params.orderQty = Command.q.reference(contracts).resolve(0) // Contracts
		}
		if (Command.hasOwnProperty("h")) {
			params.displayQty = Command.h.reference(contracts).resolve(0)
		}
		if (Command.t === "market") {
			params.ordType = "Market"
		} else {
			params.ordType = "Limit"
			params.price = price
		}
		if (Command.ftp || Command.tp) {
			const tp = Command.ftp ? Command.ftp : Command.tp.relative(first)
			side = Command.isBid ? "Sell" : "Buy"
			params.ordType = Command.t === "market" ? "MarketIfTouched" : "LimitIfTouched"
			params.stopPx = tp.resolve(market.precision)
			execInst.push("LastPrice") // MarkPrice, LastPrice, IndexPrice
		}
		if (Command.fsl || Command.sl) {
			const sl = Command.fsl ? Command.fsl : Command.sl.relative(first)
			side = Command.isBid ? "Sell" : "Buy"
			params.ordType = Command.t === "market" ? "Stop" : "StopLimit"
			params.stopPx = sl.resolve(market.precision)
			execInst.push("LastPrice") // MarkPrice, LastPrice, IndexPrice
		}
		if (Command.fts || Command.ts) {
			const ts = Command.fts ? Command.fts : Command.ts.reference(first)
			side = Command.isBid ? "Sell" : "Buy"
			params.ordType = Command.t === "market" ? "Stop" : "StopLimit"
			params.pegPriceType = "TrailingStopPeg"
			params.pegOffsetValue = ts.resolve(market.precision)
			execInst.push("LastPrice") // MarkPrice, LastPrice, IndexPrice
		}
		params.side = side
		params.symbol = pair.symbol
		if (execInst.length) {
			params.execInst = execInst.join(",")
		}

		if (Command.d) {
			Verbose().info(this.getExchangeName(), params)
			return false // Disabled
		}

		// Adjust market leverage
		if (Command.hasOwnProperty("l")) {
			yield* setLeverage.call(this, pair.symbol, cross ? 0 : leverage)
		}

		const order = yield* post.call(this, "/order", params)

		return order
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
