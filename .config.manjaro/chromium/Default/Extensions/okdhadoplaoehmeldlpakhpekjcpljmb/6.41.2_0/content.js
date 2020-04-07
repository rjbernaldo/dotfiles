"use strict";
function message(obj) {
	// Only accept messages: from the same frame, and that we "know" are ours
	if (obj && obj.data && obj.source === window) {
		relay(obj.data);
	}
}

function relay(msg) {
	try {
		chrome.runtime.sendMessage(chrome.runtime.id, msg);
	}
	catch (ex) {
		console.warn("Autoview connection lost.", ex, "message", msg);
	}
}

function resource(filename) {
	let script = document.createElement("script");
	script.src = chrome.extension.getURL(filename);
	script.type = "text/javascript";

	return script;
}


const element = document.body || document.head || document.documentElement;
const manifest = chrome.runtime.getManifest();
const resources = manifest.web_accessible_resources;

for (let i = 0; i < resources.length; i++) {
	let filename = resources[i];
	let script = resource(filename);

	if (!element.querySelector("script[src*='" + filename + "']")) {
		element.appendChild(script);
	}
}

window.addEventListener("message", message);

relay({method:"content.connect"});
