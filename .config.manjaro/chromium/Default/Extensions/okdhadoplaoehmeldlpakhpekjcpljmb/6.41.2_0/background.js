"use strict"

// Globals
window.ACCESS = {
	origins: [],
	permissions: [],
}
window.STORAGE = {
	local: {},
	sync: {},
}
window.TRADINGVIEW = TradingView()
window.last_load_account = 0
window.previous_alerts = {}

chrome.runtime.onInstalled.addListener(run.bind(window, chrome_runtime_onInstall))
chrome.runtime.onMessage.addListener(run.bind(window, executeMessage))

BigNumber.config({
	EXPONENTIAL_AT: [-20, 20],
})

run(init)

Verbose().log("Initialized")


function* carbonCopy(command, cc) {
	cc = cc || (yield* StorageInternal("sync").getStorageValue("cc"))
	const plan = Packages().getPackage("BRONZE")
	const hasSubscription = Permissions(window.ACCESS).hasAny(plan)

	if (!hasSubscription) {
		throw new Error("Carbon Copy requires an active subscription.")
	}

	if (cc && (cc.enabled || cc.test)) {
		let payload = JSON.stringify(command)
		if (cc.method === "GET") {
			payload = "json=" + payload
		}
		const resource = cc.protocol + "://" + cc.endpoint

		const func = cc.method.toLowerCase() + "Request"
		let request = Request()
		request.util.excludeHeader("X-Ajax-Engine")
		request.util.excludeHeader("X-Requested-With")
		const response = (yield* request[func](resource, payload)) || "Empty response"

		return response
	}

	return false
}

function* chrome_runtime_onInstall(details) {
	const manifest = chrome.runtime.getManifest()

	Verbose().info("Event:", details.reason)

	switch (details.reason) {
		case "shared_module_update":
		break

		case "install":
			gaEvent("Autoview", "install", manifest.version)
			break

		case "chrome_update":
		case "update":
			gaEvent("Autoview", "update", manifest.version)
	}
}

/**
 *
 * @param message
 * @param sender
 * @param sendResponse
 */
function* executeMessage(message, sender, sendResponse) {
	if (sender && sender.hasOwnProperty("tab") && sender.tab.index < 0) {
		return null // Ignore pre-render tabs
	}

	if (chrome.runtime.lastError) {
		throw new Error(chrome.runtime.lastError)
	}

	if (!message || !message.method) {
		return null // Unknown message provided
	}

	const methods = {
		// TradingView
		"content.connect": function* (msg) {},
		"content.disconnect": function* (msg) {},
		"create_alert": function* (msg) {
			msg.request.id = msg.response.p.id
			msg.response.p = msg.request

			yield* methods["event"](msg)
		},
		"event": function* (msg) {
			const alert = Alert(msg.response.p)
			const lastEventId = yield* window.TRADINGVIEW.getTradingViewAttribute("EVENT_ID")
			const eid = window.previous_alerts.hasOwnProperty(alert.id) ? window.previous_alerts[alert.id] : lastEventId
			const raw = Command().splitCommand(alert.description)

			if (alert.eid > eid) {
				window.previous_alerts[alert.id] = alert.eid
				yield* window.TRADINGVIEW.setTradingViewAttribute("EVENT_ID", alert.eid)

				Verbose().group("Alert " + alert.eid + " (" + alert.id + ")")
				for (let i = 0; i < alert.commands.length; i++) {
					const command = alert.commands[i]
					const isBlindCopy = command.hasOwnProperty("bcc")
					const isDelay = command.hasOwnProperty("delay")
					const isCommand = !isDelay || command.hasOwnProperty("c") || command.hasOwnProperty("b")
					const isCopy = command.hasOwnProperty("cc")

					Verbose().group("Command " + (i + 1) + ": " + raw[i])
					try {
						// Delay
						if (isDelay) {
							const delay = Number(command.delay.resolve(0))
							yield sleep.bind(this, delay)
						}

						// Copy
						if (isCopy || isBlindCopy) {
							try {
								yield* carbonCopy(command)
							} catch (ex) {
								Verbose().warn(ex.message)
							}
						}

						// Exchange
						if (isCommand && !isBlindCopy) {
							let exchange = Broker().getExchange(command.e, command.s)
							if (exchange) {
								gaEvent(exchange.getExchangeName(), "command", command.s)

								const account = command.a
								const alias = exchange.getExchangeStorageAlias()
								const credentials = (yield* StorageInternal("sync").getStorageValue("exchanges", alias, account)) || {}
								exchange.setExchangeCredentials(account, credentials)

								yield* exchange.executeCommand(command)

								exchange.removeExchangeCredentials(account)
							}
						}
					} catch (ex) {
						Verbose().warn(ex.message || ex)
						// TODO Provide additional information for debugging
						ga("send", "exception", {
							"exDescription": ex.message,
							"exFatal": false,
						})
					} finally {
						Verbose().groupEnd()
					}
				}
				Verbose().groupEnd()
			}
		},
		// Ping
		"ping": function* (msg) {},
		// Storage
		"storage.clear": function* (msg) {
			const namespace = msg.namespace
			const result = yield* StorageInternal(namespace).clearStorage()

			sendResponse(result)
		},
		"storage.get": function* (msg) {
			const keys = msg.keys
			const namespace = msg.namespace
			const value = yield* StorageInternal(namespace).getStorageValue(keys)

			sendResponse(value)
		},
		"storage.set": function* (msg) {
			const keysEndWithValue = msg.value
			const namespace = msg.namespace
			const value = yield* StorageInternal(namespace).setStorageValue(keysEndWithValue)

			sendResponse(value)
		},
		// TradingView
		"tradingview.set": function* (msg) {
			const value = msg.value.pop()
			const key = msg.value.pop()
			const result = yield* window.TRADINGVIEW.setTradingViewAttribute(key, value)
			yield* window.TRADINGVIEW.toggleTradingViewListener()
			sendResponse(result)
		},
	}

	if (methods.hasOwnProperty(message.method)) {
		yield* methods[message.method](message)
	}
}

function* init() {
	// Save and sync internal cache
	interval(run.bind(this, storage_save.bind(this, "local")), 5000) // 5 seconds
	interval(run.bind(this, storage_save.bind(this, "sync")), 15000) // 15 seconds
	// Load permissions, subscriptions
	interval(run.bind(this, refresh_account.bind(this)), 300000) // 5 minutes
	// Refresh Autoview
	interval(run.bind(this, refresh_autoview.bind(this)), 20000) // 20 seconds

	yield* load_storage_local()
	yield* load_storage()
	yield* refresh_account()
	yield* window.TRADINGVIEW.toggleTradingViewListener()

	const exchanges = Broker().getExchanges()
	for (let i = 0; i < exchanges.length; i++) {
		try {
			const exchange = exchanges[i]
			const hasPermission = yield* exchange.exchangeHasPermission()
			if (hasPermission) {
				yield* exchange.exchangeTime()
			}
		} catch (ex) {
			// Ignore
		}
	}
}

function* load_access() {
	const access = yield permissions_all.bind(this)

	return access
}

function* load_account() {
	let permissions = Permissions().validateState()
	let purchases = []
	try {
		const google_payments = (yield* StorageInternal("sync").getStorageValue("permissions", "google_payments")) || false
		if (google_payments) {
			// Retrieve active subscriptions
			const cws_purchases = yield* inapp().getPurchases()
			purchases = [].concat(purchases, cws_purchases)
		}
	} catch (ex) {
		// TODO console.warn("Google", ex.message)
	}

	try {
		// Retrieve active subscriptions
		const pwp_purchases = yield* PWP().getExchangeSubscriptions()
		purchases = [].concat(purchases, pwp_purchases)
		window.last_load_account = Date.now()
	} catch (ex) {
		// TODO console.warn("Pay with Pink", ex.message)
	}

	// Uniquely include newly obtained permissions
	for (let i = 0; i < purchases.length; i++) {
		const purchase = purchases[i]
		const permission = purchase.sku

		if (purchase.state === "ACTIVE") {
			permissions.permissions.push(permission)
		}
	}

	return permissions
}

function* load_storage() {
	const namespace = "sync"
	let storage = (yield* Storage(namespace).getStorageValue()) || {}

	if (!storage.hasOwnProperty("exchanges")) {
		storage.exchanges = {}
	}
	if (!storage.hasOwnProperty("permissions")) {
		storage.permissions = {
			google_payments: false,
		}
	}
	if (!storage.hasOwnProperty("settings")) {
		storage.settings = {
			refresh_duration: 0,
			refresh_last: 0,
		}
	}
	storage.settings.refresh_last = Date.now()

	for (let key in storage) {
		if (storage.hasOwnProperty(key)) {
			const alias = key.toUpperCase()
			let value = storage[key]

			// Original model (< 1.0.0)
			if (Broker().isExchangeAlias(alias)) {
				value.private = value.private || ""
				value.public = value.public || ""

				// Convert to new model
				storage.exchanges[alias] = {
					"*": value
				}

				// Unset original model
				delete storage[key]
			}
			// Account access
			else if (key === "exchanges") {
				// Skip; Credentials are loaded upon request via Exchange()
			}
			// TradingView
			else if (key === "event_id" || key === "private_channel") {
				yield* window.TRADINGVIEW.setTradingViewAttribute(key, value)
				// Unset original model
				delete storage[key]
			}
		}
	}

	// Storage is kept internally to avoid hitting chrome.storage rate limits (refer to storage_save())
	window.STORAGE[namespace] = storage

	Verbose().log("Storage sync loaded.")
}

function* load_storage_local() {
	const namespace = "local"
	let storage = (yield* Storage(namespace).getStorageValue()) || {}

	if (!storage.hasOwnProperty("verbose")) {
		storage.verbose = []
	}

	// Storage is kept internally to avoid hitting chrome.storage rate limits (refer to storage_save())
	window.STORAGE[namespace] = storage

	Verbose().log("Storage local loaded.")
}

function* refresh_autoview() {
	const now = Date.now()
	const settings = (yield* StorageInternal("sync").getStorageValue("settings")) || {}
	const elapsed = (now - settings.refresh_last)

	if (settings.refresh_duration >= 60000 && elapsed >= settings.refresh_duration) {
		window.location.reload(true)
	}
}

function* refresh_account() {
	// Cache value prior to load_account()
	const lastAccount = window.last_load_account
	const access = yield* load_access()
	const account = yield* load_account()
	const ack = lastAccount === 0 || lastAccount < window.last_load_account
	if (Permissions(access).getLength() && ack) {
		window.ACCESS = {}
		Permissions(window.ACCESS).grant(access)
		Permissions(window.ACCESS).grant(account)
	}
}

function* storage_save(namespace) {
	try {
		const storage = yield* StorageInternal(namespace).getStorageValue()

		const json = JSON.stringify(storage)
		const hash = md5(json)
		const name = "storage_" + namespace + "_hash"

		// Save any changes when they occurred
		if (!window.hasOwnProperty(name) || window[name] !== hash) {
			window[name] = hash

			yield* Storage(namespace).setStorageValue(storage)
		}
	} catch (e) {
		Verbose().warn("Storage", namespace, "error", e.message)
	}
}
