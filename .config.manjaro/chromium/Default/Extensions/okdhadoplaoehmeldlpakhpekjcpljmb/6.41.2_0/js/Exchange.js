"use strict"
/**
 *
 * @param state
 * @returns {*}
 * @constructor
 */
function Exchange(state) {
	state = state || {}
	state.credentials = state.credentials || {}

	function* executeCommand(Command) {
		if (typeof Command !== "object") {
			throw new TypeError("Invalid Command object provided: " + typeof Command)
		}

		// Cancel / Close
		switch (Command.c) {
			case "order":
			return yield* this.exchangeOrdersCancelAll(Command)

			case "position":
			return yield* this.exchangePositionsCloseAll(Command)
		}

		// Balance Management
		if (Command.w.length) {
			return yield* this.exchangeTransferBalances(Command)
		}

		// order Type
		switch (Command.t) {
			case "fok": // Fill Or Kill
			case "ioc": // Immediate Or Cancel
			case "limit":
			case "market":
			case "post": // Post Only
			return yield* this.exchangeTrade(Command)
		}

		throw new SyntaxError("Empty Command executed.")
	}

	function getAccount(account) {
		if (typeof account !== "string") {
			throw new TypeError("Account was not a string: " + typeof account)
		}
		if (!account.length || !account.trim()) {
			throw new SyntaxError("Account was not provided.")
		}
		return account.toUpperCase() // Uniform
	}

	function getAlias(index) {
		if (state.hasOwnProperty("aliases") && state.aliases.hasOwnProperty(index)) {
			return state.aliases[index]
		}

		return null
	}

	function getStorageAlias() {
		return getAlias(0)
	}

	function getAliases() {
		if (!state.hasOwnProperty("aliases")) {
			throw new ReferenceError("Exchange Aliases is not configured.")
		}
		if (!(state.aliases instanceof Array)) {
			throw new TypeError("Invalid Exchange Aliases: " + typeof state.aliases)
		}

		return state.aliases
	}

	function* getCredentials(requiredField) {
		requiredField = requiredField || "public"

		const account = state.account
		if (!account) {
			throw new Error("No Account provided.")
		}

		const permission = yield* hasPermission()
		if (!permission) {
			throw new ReferenceError("Connecting " + this.getExchangeName() + " is disabled until permission is granted. Please visit Autoview Permissions.")
		}

		const subscription = yield* hasSubscription()
		const legacySubscription = yield* hasLegacySubscription()
		if (!subscription && !legacySubscription) {
			throw new ReferenceError(this.getExchangeName() + ": An active subscription is required.")
		}

		const credentials = state.credentials || {}
		const accounts = Object.keys(credentials)
		if (!credentials || !credentials.hasOwnProperty(account) || !credentials[account].hasOwnProperty(requiredField)) {
			throw new ReferenceError(this.getExchangeName() + " API Account \"" + account + "\" was not found within: " + accounts.join(", "))
		}

		return credentials[account]
	}

	function getFields() {
		if (state.hasOwnProperty("fields")) {
			return state.fields
		}

		throw new ReferenceError("Exchange Fields are not configured.")
	}

	function getName() {
		if (state.hasOwnProperty("name")) {
			return state.name
		}

		throw new ReferenceError("Exchange Name is not configured")
	}

	function getPatterns() {
		return state.hasOwnProperty("patterns") ? state.patterns : []
	}

	function getPermissions() {
		if (state.hasOwnProperty("permissions")) {
			return state.permissions
		}

		throw new ReferenceError("Exchange Permissions are not configured.")
	}

	function getStateProperty(property) {
		switch (property) {
			case "glyphicon":
				if (state.hasOwnProperty(property)) {
					return state[property]
				}
		}

		return null
	}

	function getSubscriptions(key) {
		if (state.hasOwnProperty("subscriptions")) {
			if (arguments.length > 0) {
				if (typeof key !== "string") {
					throw new TypeError("Invalid Subscription key: " + typeof key)
				} else if (!state.subscriptions.hasOwnProperty(key)) {
					throw new ReferenceError("Invalid Subscription key: " + key)
				}

				return state.subscriptions[key]
			}

			return state.subscriptions
		}

		throw new ReferenceError("Exchange Subscriptions are not configured.")
	}

	function getWebsite() {
		if (state.hasOwnProperty("website")) {
			return state.website
		}

		throw new ReferenceError("Exchange Website is not configured.")
	}

	function* hasPermission() {
		const permissions = getPermissions()
		const granted = Permissions(window.ACCESS).hasAll(permissions)

		return granted
	}

	function* hasSubscription() {
		// List of possible subscriptions
		let subscriptions = getSubscriptions()
		if (subscriptions.active.length === 0) {
			return true
		}

		const permissions = {
			permissions: subscriptions.active,
		}
		const granted = Permissions(window.ACCESS).hasAny(permissions)

		return granted
	}

	function* hasLegacySubscription() {
		// List of possible subscriptions
		let subscriptions = getSubscriptions()
		if (subscriptions.inactive.length === 0) {
			return true
		}

		const permissions = {
			permissions: subscriptions.inactive,
		}
		const granted = Permissions(window.ACCESS).hasAny(permissions)

		return granted
	}

	function* overload(func) {
		throw new Error(getName() + "." + func + "() has not been implemented.")
	}

	function removeCredentials(account) {
		account = getAccount(account)
		delete state.credentials[account]
	}

	function setCredentials(account, obj) {
		state.account = getAccount(account)
		for (const field in state.fields) {
			if (state.fields.hasOwnProperty(field)) {
				if (obj.hasOwnProperty(field)) {
					if (typeof obj[field] !== "string") {
						throw new TypeError("Field was not a string: " + typeof obj[field])
					}
					if (!obj[field].length || !obj[field].trim()) {
						if (!state.fields[field].optional) {
							throw new SyntaxError("Field was not provided: " + state.fields[field].label)
						}
					}
					if (!state.credentials.hasOwnProperty(account)) {
						state.credentials[account] = {}
					}
					state.credentials[account][field] = obj[field].trim()
				} else {
					throw new SyntaxError("Field was not available: " + state.fields[field].label)
				}
			}
		}

		return state.credentials[account]
	}

	function marketPrecision(increment) {
		let precision = 0
		while (increment < 1) {
			precision++
			increment *= 10
		}
		// Precision does not dictate stepping
		if (increment !== 1) {
			precision += increment
		}

		return precision
	}

	return Object.assign(
		{},
		// Queue(state),
		// RateLimit(state), // API Throttling
		Request(), // API Calling
		{
			exchangeHasPermission: hasPermission,
			exchangeHasSubscription: hasSubscription,
			exchangeHasLegacySubscription: hasLegacySubscription,
			exchangeOrdersCancelAll: overload.bind(this, "exchangeOrdersCancelAll"),
			exchangePositionsCloseAll: overload.bind(this, "exchangePositionsCloseAll"),
			exchangeTime: overload.bind(this, "exchangeTime"),
			exchangeTrade: overload.bind(this, "exchangeTrade"),
			exchangeTransferBalances: () => {
				throw new Error(getName() + ".exchangeTransferBalances() has not been implemented.")
			},
			executeCommand: executeCommand,
			getExchangeAccount: getAccount,
			getExchangeAlias: getAlias,
			getExchangeAliases: getAliases,
			getExchangeCredentials: getCredentials,
			getExchangeName: getName,
			getExchangeFields: getFields,
			getExchangeStateProperty: getStateProperty,
			getExchangeTestCommand: () => {
				throw new Error(getName() + ".getExchangeTestCommand() has not been implemented.")
			},
			getExchangePatterns: getPatterns,
			getExchangePermissions: getPermissions,
			getExchangeStorageAlias: getStorageAlias,
			getExchangeSubscriptions: getSubscriptions,
			getExchangeWebsite: getWebsite,
			marketPrecision: marketPrecision,
			removeExchangeCredentials: removeCredentials,
			setExchangeCredentials: setCredentials,
		}
	)
}
