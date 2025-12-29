import { workout } from './stores/workout.svelte';

type SpeechRecognitionType = typeof window.SpeechRecognition;

interface VoiceCallbacks {
	onEnd: () => void;
	onCommand?: (command: string) => void;
}

let recognition: InstanceType<SpeechRecognitionType> | null = null;
let isListening = $state(false);
let lastCommand = $state('');

function parseCommand(transcript: string): { type: string; value?: number } | null {
	const text = transcript.toLowerCase().trim();

	// End commands
	if (text.includes('end') || text.includes('stop') || text.includes('finish')) {
		return { type: 'end' };
	}

	// Pace commands: "set pace to 28", "pace 30", "change pace to 25"
	const paceMatch = text.match(/(?:set\s+)?(?:change\s+)?pace(?:\s+to)?\s+(\d+)/);
	if (paceMatch) {
		return { type: 'pace', value: parseInt(paceMatch[1], 10) };
	}

	// Interval commands: "set interval to 3 minutes", "interval 5", "change interval to 10"
	const intervalMatch = text.match(/(?:set\s+)?(?:change\s+)?interval(?:\s+to)?\s+(\d+)/);
	if (intervalMatch) {
		return { type: 'interval', value: parseInt(intervalMatch[1], 10) };
	}

	return null;
}

export function startListening(callbacks: VoiceCallbacks) {
	const SpeechRecognition =
		window.SpeechRecognition ||
		(window as unknown as { webkitSpeechRecognition: SpeechRecognitionType })
			.webkitSpeechRecognition;

	if (!SpeechRecognition) {
		console.warn('Speech recognition not supported in this browser');
		return;
	}

	recognition = new SpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = false;
	recognition.lang = 'en-US';

	recognition.onresult = (event: SpeechRecognitionEvent) => {
		const result = event.results[event.results.length - 1];
		if (result.isFinal) {
			const transcript = result[0].transcript;
			lastCommand = transcript;

			const command = parseCommand(transcript);
			if (command) {
				callbacks.onCommand?.(transcript);

				switch (command.type) {
					case 'end':
						stopListening();
						callbacks.onEnd();
						break;
					case 'pace':
						if (command.value) {
							workout.updatePace(command.value);
						}
						break;
					case 'interval':
						if (command.value) {
							workout.updateInterval(command.value);
						}
						break;
				}
			}
		}
	};

	recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
		console.error('Speech recognition error:', event.error);
		if (event.error !== 'no-speech') {
			isListening = false;
		}
	};

	recognition.onend = () => {
		// Restart if still supposed to be listening
		if (isListening && recognition) {
			recognition.start();
		}
	};

	recognition.start();
	isListening = true;
}

export function stopListening() {
	if (recognition) {
		isListening = false;
		recognition.stop();
		recognition = null;
	}
}

export function getVoiceState() {
	return {
		get isListening() {
			return isListening;
		},
		get lastCommand() {
			return lastCommand;
		}
	};
}
