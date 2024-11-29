let audioContext = null;
let highPassFilter = null;
let compressor = null;
let clarityEQ = null;
let volume = null;

const audioEffects = {
	subtle: {
		highPass: 40,
		compressor: { threshold: -10, ratio: 1.5 },
		clarity: { frequency: 3000, gain: 1 },
		volume: 1,
	},
	moderate: {
		highPass: 80,
		compressor: { threshold: -20, ratio: 2.5 },
		clarity: { frequency: 3000, gain: 2 },
		volume: 1,
	},
	strong: {
		highPass: 120,
		compressor: { threshold: -30, ratio: 4 },
		clarity: { frequency: 3000, gain: 6 },
		volume: 1.2,
	},
};

function applyEffects(config) {
	if (!audioContext) {
		audioContext = new AudioContext();

		highPassFilter = audioContext.createBiquadFilter();
		highPassFilter.type = 'highpass';

		compressor = audioContext.createDynamicsCompressor();

		volume = audioContext.createGain();
		volume.gain.value = config.volume;

		clarityEQ = audioContext.createBiquadFilter();
		clarityEQ.type = 'peaking';

		const audioElements = document.querySelectorAll('audio, video');
		audioElements.forEach((element) => {
			try {
				const source = audioContext.createMediaElementSource(element);
				source
					.connect(highPassFilter)
					.connect(compressor)
					.connect(volume)
					.connect(clarityEQ)
					.connect(audioContext.destination);
			} catch (e) {
				console.warn(`Unable to process element: ${element.src}`, e);
			}
		});

		audioContext
			.resume()
			.catch((err) =>
				console.error('AudioContext failed to resume:', err),
			);
	}

	// Apply the configuration
	highPassFilter.frequency.value = config.highPass;
	compressor.threshold.value = config.compressor.threshold;
	compressor.ratio.value = config.compressor.ratio;
	volume.gain.value = config.volume;
	clarityEQ.frequency.value = config.clarity.frequency;
	clarityEQ.gain.value = config.clarity.gain;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'SET_EFFECTS_CONFIG') {
		const config = audioEffects[message.config];
		if (config) {
			applyEffects(config);
		}
	}
});
