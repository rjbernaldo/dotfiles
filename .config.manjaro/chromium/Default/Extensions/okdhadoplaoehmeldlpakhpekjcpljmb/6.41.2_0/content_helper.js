"use strict";
function document_init() {
	if (window.hasOwnProperty("user")) {
		relay({
			method: "tradingview.set",
			value: [
				"TRADINGVIEW",
				"private_channel",
				window.user.private_channel,
			],
		});
	}
}

function init() {
	console.log("Autoview Content Helper initialized.");

	window.Autoview.init();
	document_init();
}

function relay(msg) {
	window.postMessage(msg, location.origin);
}


document.addEventListener("DOMContentLoaded", init);
