const off = document.getElementById('off');
const subtle = document.getElementById('subtle');
const moderate = document.getElementById('moderate');
const strong = document.getElementById('strong');

function applyConfig(configName) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			type: 'SET_EFFECTS_CONFIG',
			config: configName,
		});
	});
}

off.addEventListener('click', () => applyConfig('off'));
subtle.addEventListener('click', () => applyConfig('subtle'));
moderate.addEventListener('click', () => applyConfig('moderate'));
strong.addEventListener('click', () => applyConfig('strong'));
