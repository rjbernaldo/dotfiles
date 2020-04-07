"use strict"

/**
 * @param target
 * @param args
 * @returns {{}}
 */
Object.assignDeep = function(target, ...args) {
	const isObject = (o) => typeof o === "function" || Object.prototype.toString.call(o) === "[object Object]"
	const isPrimitive = (o) => typeof o === "object" ? o === null : typeof o !== "function"
	const isValidKey = (key) => key !== "__proto__" && key !== "constructor" && key !== "prototype"

	if (isPrimitive(target)) {
		target = args.shift()
	}
	if (!target) {
		target = {}
	}
	for (let i = 0; i < args.length; i++) {
		const value = args[i]
		if (isObject(value)) {
			const keys = Object.keys(value)
			for (let j = 0; j < keys.length; j++) {
				const key = keys[j]
				if (isValidKey(key)) {
					if (isObject(target[key]) && isObject(value[key])) {
						target[key] = Object.assignDeep(target[key], value[key])
					} else {
						target[key] = value[key]
					}
				}
			}
		}
	}

	return target
}


function clipboard(format, data) {
	const tmp = document.oncopy;

	document.oncopy = function clipboard_oncopy(e) {
		e.clipboardData.setData(format, data);
		e.preventDefault();
	};
	document.execCommand("copy", false, null);
	alert("Copied to Clipboard");

	document.oncopy = tmp;
}

// http://stackoverflow.com/a/20334744/3022603
function decimals(n) {
	const a = Math.abs(n);
	let x = a;
	let d = 1;

	while (!Number.isInteger(x) && isFinite(x)) {
		x = a * Math.pow(10, d);
		d++;
	}

	return d - 1;
}

function getObjectStack(value, ...keys) {
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i]
		if (value === null || !value.hasOwnProperty(key)) {
			return null
		}

		value = value[key]
	}

	return value
}

function interval(handler, timeout) {
	const now = Date.now()
	let last = now + timeout
	const step = () => {
		// Callback
		handler()

		// Next iteration (after callback execution)
		const now = Date.now()
		const offset = now - last // the drift (positive for overshooting)
		let wait = Math.max(1, timeout - offset)

		if (offset > timeout) {
			// something really bad happened. Maybe the browser (tab) was inactive?
			// possibly special handling to avoid futile "catch up" run
			// Reset interval
			last = now
			wait = timeout
		}
		last += timeout

		// Recursive
		return setTimeout(step, wait);
	}

	return setTimeout(step, timeout);
}

function parseQuery(str) {
	if (typeof str !== "string") {
		throw new TypeError("Invalid string provided");
	}

	const a = str.split("&");
	const l = a.length;
	const query = {};

	for (let i = 0; i < l; i++) {
		let b = a[i].split("=");
		query[urldecode(b[0] || "")] = urldecode(b[1] || "");
	}

	return query;
}

// Thanks: http://phpjs.org/functions/mt_rand/
function rand_num(min, max) {
	switch (arguments.length) {
		case 0:
			min = 0;
			max = 2147483647;
		break;

		case 1:
		throw new SyntaxError("0 or 2 parameters required");

		default:
			min = parseInt(min, 10);
			max = parseInt(max, 10);
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rand_num_float(min, max, precision) {
	const d = Math.max(decimals(min), decimals(max));
	if (typeof precision === "undefined" || precision < 0) {
		precision = d
	}
	const m = Math.pow(10, d + 1);
	const r = rand_num(min * m, max * m);

	return (r / m).toFixed(precision);
}

function removeObjectStack(value, ...keys) {
	const key = keys.shift() || null

	if (!key || !value.hasOwnProperty(key)) {
		return false
	}

	if (keys.length === 0) {
		delete value[key]
		return true
	}

	return removeObjectStack(value[key], ...keys) // recursive
}

function run(generator, ...args) {
	// Spread deconstructor not implemented in Chrome
	// i.e. let it = generator(...args);
	let it = generator.apply(this, args);

	function next(err, arg) {
		let result;
		try {
			result = err ? it.throw(err) : it.next(arg);
		}
		catch (err) {
			return it.throw(err);
		}

		if (result.done) {
			return arg;
		}
		if (typeof result.value === "function") {
			return result.value(next);
		}

		return setTimeout(next, 10, null, result.value);
	}

	next();
}

function safeJSON(str) {
	try {
		const json = JSON.parse(str);
		if (typeof json === "object" && json !== null) {
			return json;
		}
	}
	catch(e) {}

	return {};
}

function serialize(obj, prefix) {
	let ret = [];

	for (let p in obj) {
		if (obj.hasOwnProperty(p)) {
			let k = (prefix) ? prefix + "[" + p + "]" : p;
			let v = obj[p];

			ret.push(typeof v === "object"
				? serialize(v, k)
				: encodeURIComponent(k) + "=" + encodeURIComponent(v)
			);
		}
	}

	return ret.join("&");
}

function setObjectStack(...args) {
	let value = args.length ? args.pop() : null
	while (args.length) {
		let tmp = {}
		tmp[args.pop()] = value
		value = tmp
	}

	return value
}

function shuffle(array) {
	let m = array.length
	// While there elements to shuffle...
	while (m) {
		// Pick a remaining element…
		let i = Math.floor(Math.random() * m--)
		// And swap it with the current element.
		let t = array[m]
		array[m] = array[i]
		array[i] = t
	}

	return array
}

function sleep(seconds, callback) {
	if (typeof seconds !== "number" || isNaN(seconds) || seconds <= 0) {
		Verbose().warn("Invalid delay provided: " + seconds)
		seconds = 0
	} else {
		Verbose().info(seconds, "second delay")
	}
	setTimeout(callback, seconds * 1000)
}

function sortByIndex(array, index, reverse) {
	if (typeof index === "string") {
		index = [index]
	}

	array.sort((a, b) => {
		let c = a
		let d = b
		index.forEach((key) => {
			if (!c.hasOwnProperty(key)) {
				throw new ReferenceError("A Index was not found: " + index.join("."))
			}
			if (!d.hasOwnProperty(key)) {
				throw new ReferenceError("B Index was not found: " + index.join("."))
			}

			c = c[key]
			d = d[key]
		})

		if (c === d) {
			return 0 // equal
		}
		if (c < d) {
			return (reverse)
				? 1 // a after b
				: -1 // a before b
		}
		return (reverse)
			? -1 // a before b
			: 1 // a after b
	})
}

function str_rand(length) {
	if (typeof length !== "number" || length !== parseInt(length, 10) || length <= 0) {
		throw new SyntaxError("Invalid length provided");
	}

	let ret = [];
	while (length--) {
		let rand = rand_num(0, 61);
		if (rand < 10) {
			rand += 48;
		}
		else if (rand < 36) {
			rand += 55;
		}
		else if (rand < 62) {
			rand += 61;
		}

		ret.push(String.fromCharCode(rand));
	}

	return ret.join("");
}

function ucfirst(str) {
	if (typeof str !== "string") {
		throw new SyntaxError("Invalid string provided");
	}

	return str.charAt(0).toUpperCase() + str.substring(1);
}

function urldecode(str) {
	if (typeof str !== "string") {
		throw new SyntaxError("Invalid string provided");
	}

	str = str.replace(/%(?![\da-f]{2})/gi);
	str = str.replace(/\+/g, "%20");

	return decodeURIComponent(str);
}
