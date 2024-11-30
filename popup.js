const buttons = document.querySelectorAll('#container button');

function applyConfig(configName) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			type: 'SET_EFFECTS_CONFIG',
			config: configName,
		});
	});
}

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		buttons.forEach((btn) => btn.classList.remove('selected'));
		button.classList.add('selected');
		applyConfig(button.id);
	});
});
