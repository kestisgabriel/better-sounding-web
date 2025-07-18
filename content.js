let audioContext = null;
let highPassFilter = null;
let compressor = null;
let clarityEQ = null;
let murkinessEQ = null;
let volume = null;

const audioEffects = {
	off: {
		highPass: 20,
		compressor: { threshold: 0, ratio: 0 },
		clarity: { frequency: 3000, gain: 0 },
		murkiness: { frequency: 400, gain: 0 },
		volume: 1,
	},
	subtle: {
		highPass: 40,
		compressor: { threshold: -10, ratio: 1.5 },
		clarity: { frequency: 3000, gain: 1 },
		murkiness: { frequency: 400, gain: -1 },
		volume: 1,
	},
	moderate: {
		highPass: 60,
		compressor: { threshold: -15, ratio: 2 },
		clarity: { frequency: 3000, gain: 2 },
		murkiness: { frequency: 400, gain: -2 },
		volume: 1,
	},
	strong: {
		highPass: 80,
		compressor: { threshold: -20, ratio: 4 },
		clarity: { frequency: 3000, gain: 3 },
		murkiness: { frequency: 400, gain: -3 },
		volume: 1,
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

		murkinessEQ = audioContext.createBiquadFilter();
		murkinessEQ.type = 'peaking';

		// connect to audio sources on DOM and apply processing
		const audioElements = document.querySelectorAll('audio, video');
		audioElements.forEach((element) => {
			try {
				const source = audioContext.createMediaElementSource(element);
				source
					.connect(highPassFilter)
					.connect(compressor)
					.connect(volume)
					.connect(clarityEQ)
					.connect(murkinessEQ)
					.connect(audioContext.destination);
			} catch (e) {
				console.warn(
					`Unable to process sound source: ${element.src}`,
					e,
				);
			}
		});

		audioContext
			.resume()
			.catch((err) =>
				console.error('AudioContext failed to resume:', err),
			);
	}

	highPassFilter.frequency.value = config.highPass;
	compressor.threshold.value = config.compressor.threshold;
	compressor.ratio.value = config.compressor.ratio;
	volume.gain.value = config.volume;
	clarityEQ.frequency.value = config.clarity.frequency;
	clarityEQ.gain.value = config.clarity.gain;
	murkinessEQ.frequency.value = config.murkiness.frequency;
	murkinessEQ.gain.value = config.murkiness.gain;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'SET_EFFECTS_CONFIG') {
		const config = audioEffects[message.config];
		if (config) {
			applyEffects(config);
		}
	}
});
