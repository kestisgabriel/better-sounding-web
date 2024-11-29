chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({
		subtle: 80,
		moderate: 120,
		strong: 160,
	});

	chrome.storage.sync.set({
		config: 'subtle',
	});

	console.log('BetterAudio for Chrome extension installed and initialized.');
});
