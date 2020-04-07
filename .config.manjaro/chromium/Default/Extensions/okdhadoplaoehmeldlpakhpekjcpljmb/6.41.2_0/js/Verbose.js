"use strict"
window.VERBOSE_DEPTHS = []

/**
 * @returns object {}
 * @constructor
 */
function Verbose() {
	function append(type, ...args) {
		console[type].apply(this, args)

		const content = Array.prototype.join.call(args.map(stringify), " ")
		const now = Date.now()
		// const stack = new Error().stack
		const event = [
			now,
			type,
			content,
		]
		write(event)
	}

	function clear() {
		console.clear.apply(this, arguments)

		window.STORAGE.local.verbose = []
	}

	function group(label) {
		console.group.apply(this, arguments)

		label = label || "verbose.group"
		const content = [
			label,
		]
		const now = Date.now()
		const type = "group"
		const event = [
			now,
			type,
			content,
		]
		const index = write(event)

		window.VERBOSE_DEPTHS.push(index)
	}

	function groupEnd() {
		console.groupEnd.apply(this, arguments)

		window.VERBOSE_DEPTHS.pop()
	}

	function length() {
		const events = window.STORAGE.local.verbose || []
		return events.length
	}

	function read(limit, offset) {
		const events = window.STORAGE.local.verbose || []
		if (arguments.length) {
			limit = limit || 100
			offset = offset || 0
			const end = offset + limit
			return end ? events.slice(offset, end) : events.slice(offset)
		}
		return events
	}

	function stringify(arg) {
		if (typeof arg === "object") {
			arg = JSON.stringify(arg, null, 1)
		}

		return arg
	}

	function updated() {
		const events = window.STORAGE.local.verbose || []
		const readEvents = (events) => {
			let latest = 0
			const l = events.length
			for (let i = 0; i < l; i++) {
				const [now, type, content] = events[i]
				latest = Math.max(latest, now)
				if (type === "group") {
					const [, ...children] = content
					const then = readEvents(children) // recursive
					latest = Math.max(latest, then)
				}
			}
			return latest
		}
		return readEvents(events)
	}

	function write(event) {
		let parent = window.STORAGE.local.verbose || []
		const depth = window.VERBOSE_DEPTHS.length
		for (let i = 0; i < depth; i++) {
			const index = window.VERBOSE_DEPTHS[i]
			const event = parent[index] // type: "group"
			parent = event[2] // content
		}

		parent.push(event)
		return parent.length - 1
	}


	if (!window || !window.hasOwnProperty("STORAGE") || !window.STORAGE.hasOwnProperty("local")) {
		throw new Error("Autoview Chrome Storage Local dependency not found prior to Verbose.")
	}

	return {
		clearMessages: clear,
		error: append.bind(this, "error"),
		getLength: length,
		getMessages: read,
		getUpdated: updated,
		group,
		groupEnd,
		info: append.bind(this, "info"),
		log: append.bind(this, "log"),
		warn: append.bind(this, "warn"),
	}
}
