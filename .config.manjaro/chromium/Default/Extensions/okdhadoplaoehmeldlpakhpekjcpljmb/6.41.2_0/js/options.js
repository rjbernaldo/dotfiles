"use strict"
let page_number = 1
let log_updated = 0
let state = {}
let syntax_builder = {}

document.addEventListener("DOMContentLoaded", run.bind(window, init))

function* account_address_update() {
	const address = document.getElementById("address-pinkcoin").value
	const content = document.getElementById("coupons")
	const handle = content.querySelector("h1")

	alerts_remove(content, ".alert") // Clear alerts

	try {
		// Update Account Address
		yield* PWP().setAccountAddress(address)

		alerts_create(handle, "#alert-success", "Referral Address successfully updated.")
	} catch (ex) {
		alerts_create(handle, "#alert-danger", ex.message)
	}
}

function* access_export_confirm(e) {
	const element = document.getElementById("access-export")
	const forms = element.querySelectorAll("form")
	const form = forms[0]
	const data = form_data(form)
	const aliases = Object.keys(data.exchanges).filter((alias) => data.exchanges[alias])
	const storage = yield* StorageInternal("sync").getStorageValue("exchanges")
	const content = aliases.reduce((content, alias) => {
		content[alias] = storage[alias]
		return content
	}, {})

	gaEvent("export", "exchanges", aliases.length)

	const json = JSON.stringify(content)
	const blob = new Blob([json], {type: "application/json"})
	const url = URL.createObjectURL(blob)
	const callback = (downloadId) => form.reset()
	chrome.downloads.download({
		url,
	}, callback)
}

function* access_export_init() {
	const containsCredentials = (alias) => {
		const credentials = storage[alias]
		return Object.keys(credentials).length > 0
	}
	const storage = yield* StorageInternal("sync").getStorageValue("exchanges")
	const aliases = Object.keys(storage).filter(containsCredentials).sort()

	for (let i = 0; i < aliases.length; i++) {
		const alias = aliases[i]
		const exchange = Broker().getExchangeByAlias(alias)
		if (exchange) {
			const access_field = new Template("[rel='access-export-exchange']")
			access_field.data["exchange.alias"] = exchange.getExchangeAlias(0)
			access_field.data["exchange.name"] = exchange.getExchangeName()
			access_field.data["glyphicon"] = exchange.getExchangeStateProperty("glyphicon") || "globe"
			access_field.clone()
		}
	}
}

function* access_export_permission_request(permissions) {
	const granted = yield permissions_request.bind(this, permissions)
	if (granted) {
		Permissions(window.ACCESS).grant(permissions)
	}
}

function* access_import_confirm(event) {
	const element = document.getElementById("access-import")
	const forms = element.querySelectorAll("form")
	const form = forms[0]
	const data = form_data(form)
	const files = document.getElementById("access-import-file").files
	const file = files[0]

	const credentials = yield function(next) {
		const reader = new FileReader()
		reader.addEventListener("load", function(event) {
			const content = event.target.result
			const json = safeJSON(content)

			next(undefined, json)
		})
		reader.readAsText(file)
	}

	switch (data.method) {
		case "replace":
			yield* StorageInternal("sync").removeStorageValue("exchanges")
		case "merge":
			yield* StorageInternal("sync").setStorageValue("exchanges", credentials)
	}

	window.location.reload()
}

function* action_access_create(e) {
	const exchange = this
	const fields = exchange.getExchangeFields()

	const content = new Template("#exchange-access-create")
	content.data["exchange.alias"] = exchange.getExchangeAlias(0)
	content.data["exchange.name"] = exchange.getExchangeName()

	for (const field in fields) {
		if (fields.hasOwnProperty(field)) {
			const metadata = fields[field]
			const access_field = new Template("[rel='exchange-access-field']", content)
			access_field.data["field.label"] = metadata.label
			access_field.data["field.message"] = metadata.message
			access_field.data["field.key"] = field
			// access_field.data["field.value"] = ""
			access_field.data["field.type"] = metadata.type || "password"
			access_field.clone()
		}
	}

	content.clone()

	const modal = document.getElementById("exchange-access-create-modal")
	$(modal).modal({
		backdrop: "static",
	}).on("hidden.bs.modal", (event) => {
		modal.remove()
	})
}

function* action_access_create_test(e) {
	const button = e.target
	const container = button.closest(".modal-content")
	const form = container.querySelector("form")
	const data = form_data(form)
	const account = this.getExchangeAccount(data.account)
	const handle = container.querySelector(".modal-body")
	const saveButton = container.querySelector("button.btn[name='save']")
	const testButton = container.querySelector("button.btn[name='test']")
	testButton.disabled = true

	// Clear alerts
	container.querySelectorAll(".alert").forEach((element) => element.remove())

	try {
		gaEvent(this.getExchangeName(), "command", "test")

		this.setExchangeCredentials(account, data)
		yield* this.getExchangeTestCommand()
		this.removeExchangeCredentials(account)

		// Freeze form
		const inputs = form.querySelectorAll("input")
		Array.prototype.filter.call(inputs, (element) => element.name !== "account")
			.forEach((element) => element.readOnly = true)
		saveButton.classList.remove("hide")
		testButton.classList.add("hide")

		alerts_create(handle, "#alert-success", "Credentials successfully tested.", true)
	} catch (ex) {
		alerts_create(handle, "#alert-danger", ex.message, true)
		// TODO Provide additional information for debugging
		ga("send", "exception", ex.message)
	} finally {
		testButton.disabled = false
	}
}

function* action_access_export(event) {
	const permissions = {
		permissions: [
			"downloads",
		],
	}

	yield* access_export_permission_request(permissions)

	const granted = Permissions(window.ACCESS).hasAll(permissions)
	if (granted) {
		$("#access-export").modal({
			backdrop: "static",
		})
	}
}

function* action_access_import(event) {
	$("#access-import").modal({
		backdrop: "static",
	})
}

function* action_access_reset(e) {
	const button = e.target
	const container = button.closest(".modal-content")
	const form = container.querySelector("form")
	const saveButton = container.querySelector("[name='save']")
	const testButton = container.querySelector("[name='test']")

	// Clear alerts
	container.querySelectorAll(".alert").forEach((element) => element.remove())

	// Unfreeze form
	form.querySelectorAll("input").forEach((element) => element.readOnly = false)
	saveButton.classList.add("hide")
	testButton.classList.remove("hide")
	form.reset()
}

function* action_access_save(e) {
	const button = e.target
	const container = button.closest(".modal-content")
	const form = container.querySelector("form")
	const data = form_data(form)
	const exchange = this
	const handle = container.querySelector(".modal-body")

	const alias = exchange.getExchangeStorageAlias()
	const stored = (yield* StorageInternal("sync").getStorageValue("exchanges", alias)) || {}

	const account = this.getExchangeAccount(data.account)
	const accounts = Object.keys(stored)

	// Clear alerts
	handle.querySelectorAll(".alert").forEach((element) => element.remove())

	try {
		if (accounts.includes(account)) {
			throw new ReferenceError("Account already exists: " + account)
		}

		const credentials = this.setExchangeCredentials(account, data)
		yield* StorageInternal("sync").setStorageValue("exchanges", alias, account, credentials)
		this.removeExchangeCredentials(account)

		yield* exchange_alert.call(this, "#alert-success", this.getExchangeName() + " successfully saved.")

		yield* elements_remove.call(this, "form")
		yield* exchange_fields.call(this)

		const modal = document.getElementById("exchange-access-create-modal")
		$(modal).modal("hide")

		setTimeout(run.bind(this, elements_remove.bind(this, ".alert-success")), 5000)  // Clear alert
	} catch (ex) {
		alerts_create(handle, "#alert-danger", ex.message, true)
	}
}

function* action_access_test(e) {
	const button = e.target
	const data = button.dataset
	const account = data.account
	const alias = this.getExchangeStorageAlias()
	const credentials = (yield* StorageInternal("sync").getStorageValue("exchanges", alias, account)) || {}
	const content = getState(this).content
	const handle = content.querySelector("h1")

	yield* elements_remove.call(this, ".alert") // Clear alerts

	try {
		gaEvent(this.getExchangeName(), "command", "test")

		this.setExchangeCredentials(account, credentials)
		yield* this.getExchangeTestCommand()
		this.removeExchangeCredentials(account)

		alerts_create(handle, "#alert-success", "Credentials (" + account + ") successfully tested.")
	} catch (ex) {
		alerts_create(handle, "#alert-danger", account + ": " + ex.message)
		// TODO Provide additional information for debugging
		ga("send", "exception", ex.message)
	}
}

function* action_access_remove(e) {
	const alias = this.getExchangeStorageAlias()
	const element = e.target
	const account = element.dataset.account || ""

	yield* elements_remove.call(this, ".alert") // Clear alerts

	element.closest("form").remove()

	if (account) {
		yield* StorageInternal("sync").removeStorageValue("exchanges", alias, account)
	}
}

function alerts_remove(content, selectorString) {
	const elements = content.querySelectorAll(selectorString)
	for (let i = 0; i < elements.length; i++) {
		elements[i].remove()
	}
}

function alerts_create(content, templateSelector, message, first) {
	const method = first ? "cloneFirst" : "clone"
	let alert = new Template(templateSelector)
	alert.data.message = message || "(No message provided)"
	alert[method](content)
}

function* carbon_copy_init() {
	const cc = (yield* StorageInternal("sync").getStorageValue("cc")) || {}
	const command = Command()
	const parameters = command.getCommandParameters
	let element

	for (const parameter in parameters) {
		const title = parameters[parameter]
		let item = new Template("[rel='parameter']")
		item.data = {}
		item.data["parameter"] = parameter
		item.data["title"] = title || ""
		item.clone()
	}

	// Form: Enabled
	if (cc.enabled) {
		document.querySelector("[name='cc\[enabled\]']").checked = true
	}
	// Form: Method
	element = document.querySelector("[name='cc\[method\]'][value='" + cc.method + "']")
	if (element) {
		element.checked = true
	}
	// Form: Protocol
	if (cc.protocol === "http") {
		element = document.querySelector("[name='cc\[protocol\]']")
		element.selectedIndex = 1
	}
	// Form: Endpoint
	element = document.querySelector("[name='cc\[endpoint\]']")
	element.value = cc.endpoint || ""
}

function* cc_test(e) {
	const bgWindow = yield background
	const container = document.getElementById("carbon-copy")
	const content = container.querySelector("h1")
	const element = e.target
	const form = element.closest("form")
	const data = form_data(form)
	let cc = data.cc
	cc.test = true

	try {
		if (!cc.endpoint) {
			throw new Error("Please provide a valid Endpoint")
		}

		gaEvent("cc", "command", "test")

		const command = Command("cc=1 d=1 e=exchange fp=123.45 s=symbol")
		const result = yield* bgWindow.carbonCopy(command, cc)

		alerts_create(content, "#alert-success", "Carbon Copy tested: " + result.substr(0, 100))

		setTimeout(alerts_remove.bind(this, content.parentNode, ".alert"), 5000) // Clear alerts
	} catch (ex) {
		alerts_create(content, "#alert-danger", ex.message)
	}
}

function* cc_update(e) {
	const element = e.target
	const form = element.closest("form")
	const data = form_data(form)
	const cc = data.cc
	const container = document.getElementById("carbon-copy")
	const content = container.querySelector("h1")

	alerts_remove(content, ".alert") // Clear alerts

	try {
		if (cc.enabled && !cc.endpoint) {
			throw new Error("Please provide a valid Endpoint")
		}

		yield* StorageInternal("sync").setStorageValue("cc", cc)

		alerts_create(content, "#alert-success", "Carbon Copy settings have been saved successfully.")

		setTimeout(alerts_remove.bind(this, content.parentNode, ".alert"), 5000) // Clear alerts
	} catch (ex) {
		alerts_create(content, "#alert-danger", ex.message)
	}
}

function click(e) {
	let element = e.target
	let data = element.dataset

	switch (element.nodeName) {
		case "A":
		case "BUTTON":
			// [target='_blank']
			if (element.hasAttribute("target") && element.getAttribute("target") === "_blank") {
				gaEvent("navigation", "external", element.href, true)
				break
			}

			// [data-page='#id']
			if (data.hasOwnProperty("page")) {
				e.preventDefault()
				window.location.hash = "#" + data.page
				return true // @see hashChange()
			}

			// [data-action='function']
			if (data.hasOwnProperty("action")) {
				if (typeof window[data.action] !== "function") {
					throw new SyntaxError("Action not found: " + data.action)
				}

				let callback = window[data.action]

				// ...[data-exchange='alias']
				if (data.hasOwnProperty("exchange")) {
					let Exchange = Broker().getExchangeByAlias(data.exchange) // global
					if (!Exchange) {
						throw new ReferenceError("Exchange Alias was not found: " + data.exchange)
					}

					// Generator - Exchange context
					callback = callback.bind(Exchange)
				}

				// Event relay
				e.preventDefault()
				return run(callback, e)
			}
		break

		case "SPAN":
		case "STRONG":
			e.preventDefault()
			return element.parentNode.click()
	}
}

function coupons_add(coupon) {
	let row = new Template("[rel='coupon']")
	row.data = {}
	row.data["coupon.code"] = coupon.code
	row.data["coupon.description"] = coupon.description || ""
	row.data["coupon.id"] = coupon.coupon
	row.clone()
}

function* coupons_archive(e) {
	const element = e.target
	const data = element.dataset
	const couponId = data.coupon || 0
	const confirmed = confirm("Are you sure you want to archive this coupon?")

	if (confirmed) {
		element.setAttribute("disabled", "disabled")

		const result = yield* PWP().setCouponDeleted(couponId)
		if (result) {
			const row = element.closest("div[class='form-group']")
			row.parentNode.removeChild(row)
		}
	}
}

function* coupons_generate(e) {
	const element = e.target
	const content = document.getElementById("coupon-assigned")
	const handle = document.getElementById("coupon-generation")

	element.setAttribute("disabled", "disabled")

	alerts_remove(content, ".alert") // Clear alerts

	try {
		const coupon = yield* PWP().getNewCoupon()
		coupons_add(coupon)
	} catch (ex) {
		alerts_create(handle, "#alert-danger", ex.message)
	}

	element.removeAttribute("disabled")
}

function* coupons_update(e) {
	const element = e.target
	const data = element.dataset
	const couponId = data.coupon || 0
	const description = document.getElementById("coupon-" + couponId).value
	const content = document.getElementById("coupon-generation")

	element.setAttribute("disabled", "disabled")

	alerts_remove(content.parentNode, ".alert") // Clear alerts

	if (!couponId) {
		throw new Error("Coupon reference not found")
	}

	try {
		// Coupon (description) update
		yield* PWP().setCouponDescription(couponId, description)

		// Alert: Success
		alerts_create(content, "#alert-success", "Coupon description successfully updated.")
	} catch (ex) {
		// Alert: Error
		alerts_create(content, "#alert-danger", ex.message)
	}

	setTimeout(alerts_remove.bind(this, content.parentNode, ".alert"), 5000) // Clear alerts

	element.removeAttribute("disabled")
}

function* elements_remove(selectorString) {
	let elements = getState(this).content.querySelectorAll(selectorString)
	let l = elements.length

	for (let i = 0; i < l; i++) {
		elements[i].remove()
	}
}

function* exchange_init() {
	const exchanges = Broker().getExchanges()
	for (let i = 0; i < exchanges.length; i++) {
		yield* exchange_page.call(exchanges[i])
	}
}

function* exchange_access(account) {
	const alias = this.getExchangeStorageAlias()
	let state = getState(this)

	let access = new Template("[rel='exchange-access']", state.content)
	const credentials = (yield* StorageInternal("sync").getStorageValue("exchanges", alias, account)) || {}

	access.data = state.template_data
	access.data["access.#"] = (state.content.getElementsByTagName("form") || []).length
	access.data["access.account"] = account

	const fields = this.getExchangeFields()
	for (let field in fields) {
		if (fields.hasOwnProperty(field)) {
			const metadata = fields[field]
			const type = metadata.type || "password"
			const value = credentials.hasOwnProperty(field) ? credentials[field] : ""
			const access_field = new Template("[rel='exchange-access-field']", access)
			access_field.data["field.label"] = metadata.label
			access_field.data["field.message"] = metadata.message
			access_field.data["field.key"] = field
			access_field.data["field.value"] = type === "password" ? "*".repeat(value.length) : value
			access_field.data["field.type"] = type
			access_field.clone()
		}
	}

	access.clone()
}

function* exchange_alert(selectorString, message) {
	let alert = new Template(selectorString)
	let state = getState(this)
	let position = state.content.querySelector("h1")
	alert.data = state.template_data
	alert.data.message = message || ""
	alert.clone(position)
}

function* exchange_buttons() {
	let state = getState(this)
	let granted = state.permissions.granted
	let elements = state.content.querySelectorAll(".btn")
	for (let i = 0; i < elements.length; i++) {
		let element = elements[i]

		element.classList.toggle("hide", !granted)
	}
}

function* exchange_fields() {
	const state = getState(this)
	if (state.permissions.granted) {
		const alias = this.getExchangeStorageAlias()
		const credentials = (yield* StorageInternal("sync").getStorageValue("exchanges", alias)) || {}
		let accounts = Object.keys(credentials)
		if (accounts.length > 0) {
			for (let i = 0; i < accounts.length; i++) {
				yield* exchange_access.call(this, accounts[i])
			}
		}
	}
	else {
		yield* elements_remove.call(this, "form")
	}
}

function* exchange_page() {
	// TODO Create multi-dimensional variables (e.g. data:name:level-3)
	const id = this.getExchangeAlias(0).toLowerCase()
	let state = getState(this)

	state.content = document.getElementById("exchange-" + id)
	if (!state.content) {
		// Template: Page
		let page = new Template("#exchange-page")
		page.data = state.template_data
		page.clone()

		state.content = document.getElementById("exchange-" + id)

		// Template: Sidebar
		let link = new Template("#exchange-link")
		link.data = state.template_data
		link.clone()
	}

	// Permissions: Check
	yield* exchange_permissions_check.call(this)
}

function* exchange_permissions_check() {
	const alias = this.getExchangeAlias(0)
	const storageAlias = this.getExchangeStorageAlias()
	const delegatedCredentials = alias !== storageAlias
	const hasPermission = yield* this.exchangeHasPermission()
	const hasSubscription = yield* this.exchangeHasSubscription()
	const hasLegacySubscription = yield* this.exchangeHasLegacySubscription()
	const granted = hasSubscription || hasLegacySubscription
	const state = getState(this)

	state.permissions.granted = (hasPermission && granted)

	if (!hasPermission) {
		yield* exchange_alert.call(this, "#alert-permissions-missing")
	} else if (!granted) {
		yield* exchange_alert.call(this, "#alert-subscription-missing")
	}

	if (delegatedCredentials) {
		const delegatee =  Broker().getExchangeByAlias(storageAlias)
		state.template_data["exchange.delegatee.alias"] = delegatee.getExchangeAlias(0)
		state.template_data["exchange.delegatee.id"] = state.template_data["exchange.delegatee.alias"].toLowerCase()
		state.template_data["exchange.delegatee.name"] = delegatee.getExchangeName()

		yield* exchange_alert.call(this, "#alert-delegated-credentials")
	} else {
		yield* exchange_buttons.call(this)

		yield* exchange_fields.call(this)
	}
}

function* exchange_remove() {
	// Exchange links
	document.querySelectorAll("#exchange-links li").forEach((element) => element.remove())
	// Exchange pages
	document.querySelectorAll("article.exchange-page").forEach((element) => element.remove())

	// Rebuild
	yield* exchange_init()
}

function form_data(form) {
	let ret = {}

	for (let i = 0; i < form.length; i++) {
		let element = form.elements[i]
		let value = element.value

		if (element.type === "button" || element.type === "file" || element.type === "submit") {
			continue // Ignore
		}
		if (element.type === "radio" && !element.checked) {
			continue // Value not selected
		}

		// Validation
		if (element.type === "checkbox") {
			value = element.checked
		}
		if (element.type === "number" || element.type === "range") {
			const step = element.hasOwnProperty("step") ? element.step : "1"
			if (step.indexOf(".") === -1) {
				value = parseInt(value)
			} else {
				value = parseFloat(value)
			}
		}

		// Form Data resolving
		if (element.name) {
			const names = element.name.match(/([^\[\]]+)/g)
			let obj = ret

			for (let j = 0; j < names.length; j++) {
				const name = names[j]
				if (!obj.hasOwnProperty(name)) {
					obj[name] = {}
				}
				if ((j + 1) < names.length) {
					obj = obj[name]
				} else {
					obj[name] = value
				}
			}
		}
	}

	return ret
}

function getHash() {
	const hash = window.location.hash.replace("#", "") || "alert-syntax"
	const array = hash.split(":")
	const id = array.length ? array.shift() : ""
	const page = array.length ? Math.max(1, Number(array.shift())) : 1
	return {
		id,
		page,
	}
}

function getPage() {
	const {id,} = getHash()
	return id
}

function getState(exchange) {
	const alias = exchange.getExchangeAlias(0)
	if (!state.hasOwnProperty(alias)) {
		state[alias] = {
			content: null,
			permissions: {
				connected: false,
				granted: false
			},
			template_data: {
				"exchange.alias": alias,
				"exchange.id": alias.toLowerCase(),
				"exchange.name": exchange.getExchangeName(),
				"glyphicon" : exchange.getExchangeStateProperty("glyphicon") || "globe",
			}
		}
	}

	return state[alias]
}

function hashChange(event) {
	const {id, page} = getHash()
	page_open(id)
	page_number = page

	if (id === "log") {
		run(log_init.bind(window))
	}
}

function* init() {
	const bgWindow = yield background
	const {id: page, page: number} = getHash()
	page_number = number
	window.addEventListener("hashchange", hashChange)

	// Globals
	window.ACCESS = bgWindow.ACCESS
	window.STORAGE = bgWindow.STORAGE

	document.querySelectorAll(".year").forEach((element) => element.innerText = new Date().getFullYear())
	document.addEventListener("click", click)

	yield* log_init()

	yield* carbon_copy_init()

	yield* exchange_init()

	yield page_open(page)

	yield* permissions_init(true)
	yield* permissions_init_methods(true)

	yield* settings_init()

	yield* subscription_init()

	yield* syntax_builder_init()

	yield* pwp_init()

	yield* access_export_init()

	interval(syntax_builder_output, 1000)
	interval(run.bind(window, log_refresh.bind(window)), 1000)
}

function* log_clear() {
	Verbose().clearMessages()
}

function* log_init() {
	const activeFilters = []
	const container = document.getElementById("log")
	const buttons = container.querySelectorAll("button[data-filter]")
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i]
		const data = button.dataset
		const filter = data.filter
		if (filter && button.classList.contains("active")) {
			activeFilters.push(filter)
		}
	}

	const displayEvents = (events, depth) => {
		depth = depth || 0
		const l = events.length
		for (let i = 0; i < l; i++) {
			const event = events[i]
			const [now, type, content] = event

			if (type === "group") {
				const active = activeFilters.includes("log")
				const classes = []
				if (!active) {
					classes.push("hide")
				}
				const [title, ...children] = content
				const item = new Template("[rel='log-row-parent']")
				item.data["content"] = suffix(depth) + title
				item.data["timestamp"] = timestamp(now)
				item.data["type"] = "log"
				item.data["tr.class"] = classes.join(" ")
				item.cloneFirst()

				displayEvents(children, depth + 1)
			} else {
				displayEvent(event, depth)
			}
		}
	}
	const displayEvent = (event, depth) => {
		depth = depth || 0
		const [now, type, content] = event
		const active = activeFilters.includes(type)
		const classes = []

		switch (type) {
			case "error":
				classes.push("danger")
				break
			case "warn":
				classes.push("warning")
				break
			default:
				classes.push(type)
		}
		if (!active) {
			classes.push("hide")
		}

		const item = new Template("[rel='log-row']")
		item.data["content"] = suffix(depth) + content
		item.data["type"] = type
		item.data["timestamp"] = timestamp(now)
		item.data["tr.class"] = classes.join(" ")
		item.cloneFirst()
	}
	const displayPagination = () => {
		const container = document.getElementById("log-pagination")
		const info = pagination()

		// Clear existing
		const buttons = container.querySelectorAll("button")
		for (const button of buttons) {
			button.remove()
		}

		// Display pagination buttons
		if (info.prefix) {
			displayPaginationButton(info.prefix)
		}
		for (let c = info.a; c <= info.b; c++) {
			displayPaginationButton(c)
		}
		if (info.suffix) {
			displayPaginationButton(info.suffix)
		}
	}
	const displayPaginationButton = (number) => {
		const container = document.getElementById("log-pagination")
		const button = document.createElement("button")
		button.classList.add("btn", "btn-sm", "btn-default")
		button.innerText = number
		button.dataset.action = "log_change_page"
		button.dataset.logPage = number
		if (page_number === number) {
			button.classList.add("disabled")
		}
		container.append(button)
	}
	const pagination = () => {
		const events = Verbose().getLength()
		const pages = Math.ceil(events / limit)
		const width = 2
		const length = (width * 2) + 1
		const e = pages - length
		const a = Math.max(1, Math.min(e, page_number - width))
		const b = Math.min(Math.max(length + 1, page_number + width), pages)
		const prefix = a > 1 ? 1 : null
		const suffix = b < pages ? pages : null
		return {
			a,
			b,
			prefix,
			suffix,
		}
	}
	const limit = 25
	const suffix = (depth) => "- ".repeat(depth) + " "
	const timestamp = (ms) => {
		const d = new Date(ms)
		const l2 = (n) => n > 9 ? n : "0" + n
		const date = [d.getFullYear(), l2(d.getMonth() + 1), l2(d.getDate())].join("-")
		const time = [l2(d.getHours()), l2(d.getMinutes()), l2(d.getSeconds())].join(":")

		return date + " " + time + "." + d.getMilliseconds()
	}

	// Clear any events
	const rows = container.querySelectorAll("table tbody tr")
	for (const row of rows) {
		row.remove()
	}

	// Display page of events
	const offset = page_number * -limit
	const events = Verbose().getMessages(limit, offset)
	displayEvents(events)
	displayPagination()
}

function* log_refresh() {
	const updated = Verbose().getUpdated()
	if (updated > log_updated) {
		log_updated = updated
		yield* log_init()
	}
}

function* log_filter_toggle(e) {
	const element = e.target
	const active = element.classList.contains("active")
	const data = element.dataset
	const filter = data.filter

	element.blur()

	if (filter) {
		if (active) {
			element.classList.remove("active")
		} else {
			element.classList.add("active")
		}

		const container = document.getElementById("log")
		const tbody = container.querySelector("table tbody")
		const rows = tbody.querySelectorAll("tr[data-filter='" + filter + "']")
		for (const row of rows) {
			if (active) {
				row.classList.add("hide")
			} else {
				row.classList.remove("hide")
			}
		}
	}
}

function* log_change_page(e) {
	const element = e.target
	if (!element.classList.contains("disabled")) {
		const data = element.dataset
		const p = data.logPage || 1
		window.location.hash = "#log:" + p
	}
}

function page_open(id) {
	let pages = document.querySelectorAll("article")
	if (pages.length <= 0) {
		throw new ReferenceError("No pages found.")
	}

	// Hide any pages
	for (let i = pages.length; i--;) {
		let page = pages[i]
		page.classList.toggle("hide", page.id !== id)
	}

	// Deselect all sidebar links
	let elements = document.querySelectorAll("ul.nav li")
	for (let i = 0; i < elements.length; i++) {
		elements[i].classList.remove("active")
	}

	// Activate initiated link
	let element = document.querySelector("[data-page='" + id + "']")
	if (element) {
		element.parentNode.classList.add("active")

		const pageName = element.innerText
		gaEvent("navigation", "page", pageName)

		document.title = [pageName, "Options", "Autoview"].join(" - ")

		const footer = document.getElementById("footer")
		if (id === "syntax-builder") {
			footer.classList.add("pb-15")
		} else {
			footer.classList.remove("pb-15")
		}
	}
}

function* pwp_init() {
	// TODO Nicer asynchronous requests inside generators
	run(function* () {
		try {
			const account = yield* PWP().getAccount()
			document.getElementById("address-pinkcoin").value = account.referral.destination

			const coupons = yield* PWP().getCouponList()
			coupons.forEach(coupons_add)
		} catch (ex) {
			let element
			element = document.getElementById("settings").querySelector(".page-header")
			alerts_create(element, "#alert-danger", ex.message)

			element = document.getElementById("coupons").querySelector(".page-header")
			alerts_create(element, "#alert-danger", ex.message)
		}
	})
}

function* permissions_init(register) {
	const parent = document.getElementById("settings-permissions")
	const items = parent.querySelectorAll("li.list-group-item")

	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const alias = item.dataset.exchange
		const exchange = Broker().getExchangeByAlias(alias)

		let granted = false
		if (exchange) {
			granted = yield* exchange.exchangeHasPermission()
		}

		const element = item.querySelector("input[type='checkbox']")
		if (granted !== element.checked) {
			element.checked = granted
		}
		if (register) {
			const callback = run.bind(this, settings_permission_toggle.bind(exchange))
			element.addEventListener("change", callback)
		}
	}
}

function* permissions_init_methods(register) {
	let permissions = (yield* StorageInternal("sync").getStorageValue("permissions")) || {}
	permissions.origins = permissions.origins || []
	permissions.permissions = permissions.permissions || []
	const parent = document.getElementById("settings-permissions-methods")
	const items = parent.querySelectorAll("li.list-group-item")

	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const data = item.dataset
		const granted = permissions.hasOwnProperty(data.permission) && permissions[data.permission]

		let element = item.querySelector("[type='checkbox']")
		if (granted !== element.checked) {
			element.checked = granted
		}
		if (register) {
			const callback = run.bind(this, settings_permission_toggle_google)
			element.addEventListener("change", callback)
		}
	}
}

function* settings_init() {
	const settings = (yield* StorageInternal("sync").getStorageValue("settings")) || {}
	const refresh_duration = (settings.refresh_duration || 0) / 60 / 1000 // Microseconds => Seconds => Minutes

	document.getElementById("settings-bitmex-retries").value = settings.bitmex_retries || 0
	document.getElementById("settings-bitmex-retry-delay").value = settings.bitmex_retry_delay || 500
	document.getElementById("settings-refresh-duration").value = refresh_duration
}

function* settings_save(event) {
	const container = document.getElementById("settings")
	const handle = container.querySelector("h1")
	const form = container.querySelector("form")
	const data = form_data(form)

	alerts_remove(container, ".alert") // Clear alerts

	try {
		if (isNaN(data.settings.refresh_duration) || data.settings.refresh_duration < 0) {
			throw new Error("Invalid number of refresh minutes provided")
		}
		if (isNaN(data.settings.bitmex_retries) || data.settings.bitmex_retries < 0 || data.settings.bitmex_retries > 99) {
			throw new Error("Invalid number of BitMEX Retries provided")
		}
		if (isNaN(data.settings.bitmex_retry_delay) || data.settings.bitmex_retry_delay < 500) {
			throw new Error("Invalid number of BitMEX Retry Delay milliseconds provided")
		}

		data.settings.refresh_duration *= 60 * 1000 // Minutes => Seconds => Microseconds

		yield* StorageInternal("sync").setStorageValue("settings", data.settings)

		alerts_create(handle, "#alert-success", "Settings successfully saved.")
	} catch (ex) {
		alerts_create(handle, "#alert-danger", ex.message)
	}
}

function* settings_permission_toggle(e) {
	const element = e.target

	if (element.checked) {
		yield* settings_permission_request.call(this)
	} else {
		yield* settings_permission_remove.call(this)
	}
}

function* settings_permission_toggle_google(e) {
	const element = e.target

	if (element.checked) {
		yield* settings_permission_request_google.call(this)
	} else {
		yield* settings_permission_remove_google.call(this)
	}
}

function* settings_permission_request() {
	const permissions = this.getExchangePermissions()
	const granted = yield permissions_request.bind(this, permissions)

	if (granted) {
		Permissions(window.ACCESS).grant(permissions)
	}

	gaEvent("permissions", "request", this.getExchangeName())

	// Refresh
	yield* permissions_init()
	yield* exchange_remove()
}

function* settings_permission_request_google() {
	yield* StorageInternal("sync").setStorageValue("permissions", "google_payments", true)

	yield* permissions_init()
	yield* permissions_init_methods()
}

function* settings_permission_remove() {
	const permissions = this.getExchangePermissions()
	const revoked = yield permissions_remove.bind(this, permissions)

	if (revoked) {
		Permissions(window.ACCESS).revoke(permissions)

		const alias = this.getExchangeStorageAlias()
		yield* StorageInternal("sync").removeStorageValue("exchanges", alias)
	}

	gaEvent("permissions", "remove", this.getExchangeName())

	// Refresh
	yield* permissions_init()
	yield* exchange_remove()
}

function* settings_permission_remove_google() {
	yield* StorageInternal("sync").setStorageValue("permissions", "google_payments", false)

	yield* permissions_init()
	yield* permissions_init_methods()
}

function* settings_subscription_cancel(e) {
	const element = e.target
	const dialog = element.closest("div[role='dialog']")

	$("#" + dialog.id).modal("hide")
}

function* settings_subscription_create(e) {
	const modal = e.target.closest(".modal-dialog")
	const form = modal.querySelector("form")
	const formData = new FormData(form)
	const gateway = formData.get("gateway")
	const func = "subscription_" + gateway
	const content = modal.querySelector(".modal-header")

	alerts_remove(content.parentNode, ".alert") // Clear alerts

	try {
		if (!gateway) {
			throw new Error("Please select a Payment Method")
		}
		if (!window.hasOwnProperty(func) || typeof window[func] !== "function") {
			throw new Error("Gateway function not defined: " + func)
		}

		form.querySelectorAll(".modal-footer .btn-success").forEach((element) => element.setAttribute("disabled", "disabled"))

		return yield* window[func](form)
	} catch (ex) {
		alerts_create(content, "#alert-danger", ex.message)

		form.querySelectorAll(".modal-footer .btn-success").forEach((element) => element.removeAttribute("disabled"))
	}
}

function* settings_subscription_request(e) {
	const element = e.target
	const data = element.dataset
	const sku = data.subscription
	const title = element.title

	const dialog = element.closest("div[role='dialog']")
	$("#" + dialog.id).modal("hide")

	gaEvent("subscriptions", "request", title)

	let subscription = new Template("#exchange-subscription")
	subscription.data["product.id"] = Math.floor(Date.now() / 1000)
	subscription.data["product.name"] = title
	subscription.data["product.sku"] = sku
	subscription.clone()
	$("#subscription-" + subscription.data["product.id"])
		.on("hidden.bs.modal", function() {
			this.parentNode.removeChild(this)
		})
		.modal({
			backdrop: "static",
		})
}

function* settings_subscription_request_yearly(e) {
	$("#subscription-yearly")
		.modal({
			backdrop: "static",
		})
}

function* subscription_init() {
	const exchangesContainer = document.getElementById("subscription-exchanges")
	const exchangeRows = exchangesContainer.querySelectorAll("table tbody tr[data-exchange]")

	// Legacy Subscriptions (< 7.0.0)
	for (let i = 0; i < exchangeRows.length; i++) {
		const row = exchangeRows[i]
		const data = row.dataset
		const exchange = Broker().getExchangeByAlias(data.exchange)
		const subscriptions = exchange.getExchangeSubscriptions()
		const hasSubscriptions = subscriptions.inactive.length > 0
		if (hasSubscriptions) {
			const hasSubscription = yield* exchange.exchangeHasLegacySubscription()
			if (hasSubscription) {
				row.classList.add("success")

				const legacy = row.querySelector("th small")
				legacy.classList.remove("hide")
			}
		}
	}

	// Package Subscription
	const subscriptionContainer = document.getElementById("subscription")
	const packages = subscriptionContainer.querySelectorAll("div[data-package]")
	const rows = subscriptionContainer.querySelectorAll("table tbody tr")

	for (let i = 0; i < packages.length; i++) {
		const container = packages[i]
		const data = container.dataset
		const plan = Packages().getPackage(data.package)
		const hasSubscription = Permissions(window.ACCESS).hasAny(plan)
		if (hasSubscription) {
			container.classList.add("panel-success")
			container.classList.remove("panel-default")
			container.querySelector("[name='subscription-start']").classList.add("hide")
			container.querySelector("[name='subscribed']").classList.remove("hide")

			for (let j = 0; j < rows.length; j++) {
				const row = rows[j]
				const cells = row.querySelectorAll("td")
				cells[i].classList.add("success")
			}
		}
	}
}

function* subscription_paypal(form) {
	const element = form.querySelector("[name='gateway'][value='paypal']")
	const formData = new FormData(form)
	let data = element.dataset
	const market = data.major_currency + "_" + data.minor_currency

	gaEvent("subscriptions", "request", market)

	data.coupon = formData.get("coupon")

	const purchase = yield* PWP().getNewSubscription(data)
	if (!purchase.hasOwnProperty("location") || !purchase.location) {
		throw new Error("No purchase invoice destination received.")
	}

	window.open(purchase.location)

	const dialog = element.closest("div[role='dialog']")
	$("#" + dialog.id).modal("hide")
}

function* subscription_bitcoin(form) {
	yield* subscription_pwp.call(this, form, "bitcoin")
}

function* subscription_pinkcoin(form) {
	yield* subscription_pwp.call(this, form, "pinkcoin")
}

function* subscription_pwp(form, value) {
	value = value || "pwp"
	const element = form.querySelector("[name='gateway'][value='" + value + "']")
	const formData = new FormData(form)
	let data = element.dataset
	const market = data.major_currency + "_" + data.minor_currency

	gaEvent("subscriptions", "request", market)

	data.coupon = formData.get("coupon")

	const purchase = yield* PWP().getNewSubscription(data)
	if (!purchase.hasOwnProperty("location") || !purchase.location) {
		throw new Error("No purchase invoice destination received.")
	}

	window.open(purchase.location)

	const dialog = element.closest("div[role='dialog']")
	$("#" + dialog.id).modal("hide")
}

function syntax_builder_attributes() {
	const builder = document.getElementById("syntax-builder")
	const form = builder.querySelector("form")
	const fd = new FormData(form)
	const reg_field_group = /(.+)\[(.*)\]/ // Note: Single depth

	// Merge in button group value
	builder.querySelectorAll("button.active[name]").forEach((element) => {
		fd.set(element.name, element.value)
	})

	const attributes = {}
	for (const pair of fd.entries()) {
		const name = pair[0]
		const names = reg_field_group.exec(name)
		const key = names ? names[1] : name
		const property = names ? names[2] : null
		const value = pair[1]

		if (property) {
			if (typeof attributes[key] !== "object") {
				attributes[key] = {}
			}
			attributes[key][property] = value
		} else {
			attributes[name] = value
		}
	}

	return attributes
}

function syntax_builder_properties(attributes) {
	const properties = {}
	for (const name in attributes) {
		if (attributes.hasOwnProperty(name)) {
			const value = syntax_builder_attribute(attributes[name])
			if (value) {
				properties[name] = value
			}
		}
	}

	return properties
}

function* syntax_builder_init() {
	const attributes = syntax_builder_attributes()
	syntax_builder = syntax_builder_properties(attributes)

	const select = document.getElementById("syntax-builder-e")
	const exchanges = Broker().getExchanges()
	for (let i = 0; i < exchanges.length; i++) {
		const exchange = exchanges[i]
		const alias = exchange.getExchangeAlias(0)
		const option = document.createElement("option")
		option.value = alias.toLowerCase()
		option.text = exchange.getExchangeName()
		select.appendChild(option)
	}
}

function* syntax_builder_button_group(event) {
	const element = event.target
	const group = element.closest(".btn-group")
	const toolbar = group.closest(".btn-toolbar") || group
	const buttons = toolbar.querySelectorAll("button[name='" + element.name + "']")
	const toggleable = toolbar.dataset.hasOwnProperty("toggleable")
	// Mimic radio buttons
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i]
		if (button === element) {
			if (toggleable && button.classList.contains("active")) {
				button.classList.remove("active")
			} else {
				button.classList.add("active")
			}
		} else {
			button.classList.remove("active")
		}
		button.blur()
	}
}

function syntax_builder_output() {
	const attributes = syntax_builder_attributes()
	const properties = syntax_builder_properties(attributes)
	for (const name in properties) {
		if (properties.hasOwnProperty(name)) {
			const value = properties[name]
			if (syntax_builder.hasOwnProperty(name) && syntax_builder[name] === value) {
				delete properties[name] // Remove default
			}
			if ((name === "delay" || name === "l") && Number(value) <= 0) {
				delete properties[name] // Invalid
			}
		}
	}
	const syntax = syntax_builder_syntax(properties)
	document.getElementById("syntax-builder-syntax").innerText = syntax

	const placeholder = document.getElementById("syntax-builder-syntax-default")
	if (syntax) {
		placeholder.classList.add("hide")
	} else {
		placeholder.classList.remove("hide")
	}
}

function* syntax_builder_output_copy(e) {
	const element = document.getElementById("syntax-builder-syntax")
	navigator.clipboard.writeText(element.innerText)

	$("#syntax-builder-output-copy").popover("show")
}
function syntax_builder_attribute(attribute) {
	if (typeof attribute === "object") {
		const min = attribute.hasOwnProperty("min") && attribute.min !== "" ? Number(attribute.min) : null
		const max = attribute.hasOwnProperty("max") && attribute.max !== "" ? Number(attribute.max) : null
		const percent = attribute.hasOwnProperty("percent") && attribute.percent === "1" ? "%" : ""
		const da = decimals(max)
		const di = decimals(min)
		if (min !== null && max !== null && min !== max) {
			if (min > max) {
				attribute = max.toFixed(da) + percent + "-" + min.toFixed(di) + percent
			} else {
				attribute = min.toFixed(di) + percent + "-" + max.toFixed(da) + percent
			}
		} else if (min !== null) {
			attribute = min.toFixed(di) + percent
		} else if (max !== null) {
			attribute = max.toFixed(da) + percent
		} else {
			attribute = ""
		}
	}

	return attribute
}

function syntax_builder_syntax(attributes) {
	const names = Object.keys(attributes).sort()
	let pairs = []
	for (let i = 0; i < names.length; i++) {
		const name = names[i]
		if (attributes.hasOwnProperty(name)) {
			const value = syntax_builder_attribute(attributes[name])
			if (value) {
				pairs.push(name + "=" + value)
			}
		}
	}

	return pairs.join(" ")
}
