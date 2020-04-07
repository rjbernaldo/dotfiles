"use strict"
/**
 *
 * @param {Object} [obj]
 * @returns {{description: (*|string), commands: Command[], eid: number, id: (*|number)}}
 * @constructor
 */
function Alert(obj) {
	const symbol = (obj.sym || ":").split(":")
	const description = obj.desc || ""
	const defaults = {
		a: "*",
		cm: "100%",
		cmo: "oldest",
		e: symbol[0],
		p: 0,
		q: "100%",
		s: symbol[1],
		t: "limit",
		u: "contracts",
		y: "balance",
	}

	return {
		description: description,
		commands: Command().parseRaw(description, defaults),
		eid: obj.aid ? (obj.id || 0) : 0,
		id: obj.aid || obj.id || 0,
	}
}
