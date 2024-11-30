chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({
		off: 0,
		subtle: 10,
		moderate: 50,
		strong: 100,
	});

	chrome.storage.sync.set({
		config: 'off',
	});
});
