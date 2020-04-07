"use strict"
/**
 *
 * @param {String} str
 * @returns {*}
 * @constructor
 */
function NumberObject(str) {
	// e.g. -10, 10%, 10-20%
	const reg = /^([-+]?(?:\d+|\d*\.\d+))(%)?(?:-([-+]?(?:\d+|\d*\.\d+))(%)?)?$/
	const res = reg.exec("" + str) || []

	let state = {}
	state.isPercent = Boolean(res[2] || res[4])
	state.isRange = typeof res[3] !== "undefined"
	state.min = Number(res[1]) || 0
	state.max = state.isRange ? Number(res[3]) : state.min

	// Silently correct high-low scenario
	if (state.max < state.min) {
		const tmp = state.max
		state.max = state.min
		state.min = tmp
	}

	if (state.isPercent) {
		// int => float
		state.min /= 100
		state.max /= 100
	}

	function perform(action, x) {
		x = validateNumber(x)

		switch (action) {
			case "/":
				state.min /= x
				state.max /= x
				break
			case "*":
				state.min *= x
				state.max *= x
				break
			case "+":
				state.min += x
				state.max += x
				break
			case "-":
				state.min -= x
				state.max -= x
				break
			case "<":
				if (state.max > x) {
					state.max = x
					state.min = Math.min(state.min, x)
				}
				break
			case ">":
				if (state.min < x) {
					state.max = Math.max(state.max, x)
					state.min = x
				}
				break
		}

		return self
	}

	function validateNumber(x) {
		const n = Number(x)
		if (isNaN(n)) {
			throw new TypeError("Invalid number provided: " + typeof x + " " + x)
		}
		return n
	}

	const self = {
		abs: () => {
			state.min = Math.abs(state.min)
			state.max = Math.abs(state.max)

			return self
		},
		add: (x) => perform("+", x),
		ceil: () => {
			state.max = Math.ceil(state.max)
			state.min = Math.ceil(state.min)

			return self
		},
		compare: (x) => {
			x = validateNumber(x)

			if (x < state.min) {
				return -1
			}
			if (x > state.max) {
				return 1
			}
			return 0 // Within range
		},
		div: (x) => perform("/", x),
		floor: () => () => {
			state.max = Math.floor(state.max)
			state.min = Math.floor(state.min)

			return self
		},
		getMax: () => state.max,
		getMin: () => state.min,
		getIsPercent: () => state.isPercent,
		highest: (x) => perform("<", x),
		lowest: (x) => perform(">", x),
		mul: (x) => perform("*", x),
		reference: (x) => {
			if (state.isPercent) {
				self.mul(x)
			}

			return self
		},
		relative: (x) => {
			if (state.isPercent) {
				self.mul(x)
			}
			self.add(x)

			return self
		},
		reset: () => NumberObject(str),
		resolve: (precision, significant) => {
			if (typeof precision === "undefined") {
				precision = 2
			} else if (typeof precision !== "number") {
				throw new TypeError("Invalid precision provided: " + typeof precision)
			}

			const decimals = Math.max(0, parseInt(precision, 10))
			let stepping = new BigNumber(precision)
			stepping = stepping.minus(decimals)
			let result = state.isRange
				? rand_num_float(state.min, state.max)
				: state.max
			result = new BigNumber(result)
			if (stepping.comparedTo(0) !== 0) {
				// Round down to ensure sufficient funds
				result = result.div(stepping)
				result = result.decimalPlaces(0)
				result = result.times(stepping)
			}

			const func = significant ? "toPrecision" : "toFixed"
			result = result[func](decimals, BigNumber.ROUND_DOWN)

			return result
		},
		stepping: (x, m=Math.floor) => {
			x = validateNumber(x)
			if (x <= 0) {
				throw new RangeError("Invalid stepping provided: " + x)
			}
			const step = (n) => {
				// Round down to ensure sufficient funds
				const steps = Math.max(1, m(n / x))
				return steps * x
			}
			state.max = step(state.max)
			state.min = step(state.min)

			return self
		},
		sub: (x) => perform("-", x),
		toJSON: () => {
			return self.resolve(8)
		},
	}

	return self
}
