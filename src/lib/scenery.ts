export interface Scenery {
	id: string;
	name: string;
	sky: {
		gradient: string;
	};
	background: {
		color: string;
		elements: 'mountains' | 'palms' | 'trees' | 'icebergs' | 'hills';
	};
	water: {
		color: string;
		waveColor: string;
	};
}

export const sceneries: Record<string, Scenery> = {
	'mountain-lake': {
		id: 'mountain-lake',
		name: 'Mountain Lake',
		sky: {
			gradient: 'linear-gradient(to bottom, #1e3a5f 0%, #4a90a4 50%, #87CEEB 100%)'
		},
		background: {
			color: '#2d4a3e',
			elements: 'mountains'
		},
		water: {
			color: '#1a4a5e',
			waveColor: '#2d6a7a'
		}
	},
	'tropical-ocean': {
		id: 'tropical-ocean',
		name: 'Tropical Ocean',
		sky: {
			gradient: 'linear-gradient(to bottom, #00b4db 0%, #48d1cc 50%, #87CEEB 100%)'
		},
		background: {
			color: '#228B22',
			elements: 'palms'
		},
		water: {
			color: '#006994',
			waveColor: '#00a0b0'
		}
	},
	'sunset-river': {
		id: 'sunset-river',
		name: 'Sunset River',
		sky: {
			gradient: 'linear-gradient(to bottom, #4a1a4a 0%, #c84b31 30%, #ffaa5c 60%, #ffd89b 100%)'
		},
		background: {
			color: '#1a3a1a',
			elements: 'trees'
		},
		water: {
			color: '#8b4513',
			waveColor: '#cd853f'
		}
	},
	arctic: {
		id: 'arctic',
		name: 'Arctic',
		sky: {
			gradient: 'linear-gradient(to bottom, #a8d5e5 0%, #d4e9f0 50%, #f0f8ff 100%)'
		},
		background: {
			color: '#e8f4f8',
			elements: 'icebergs'
		},
		water: {
			color: '#4a6670',
			waveColor: '#6a8a94'
		}
	},
	'english-countryside': {
		id: 'english-countryside',
		name: 'English Countryside',
		sky: {
			gradient: 'linear-gradient(to bottom, #6b7b8a 0%, #9ca8b3 50%, #bdc3c7 100%)'
		},
		background: {
			color: '#4a7c4e',
			elements: 'hills'
		},
		water: {
			color: '#3d5a5a',
			waveColor: '#5a7a7a'
		}
	}
};

export const defaultScenery = 'mountain-lake';

export function findSceneryByVoice(text: string): string | null {
	const lowerText = text.toLowerCase();

	if (lowerText.includes('mountain') || lowerText.includes('lake')) {
		return 'mountain-lake';
	}
	if (lowerText.includes('tropical') || lowerText.includes('ocean') || lowerText.includes('beach')) {
		return 'tropical-ocean';
	}
	if (lowerText.includes('sunset') || lowerText.includes('river')) {
		return 'sunset-river';
	}
	if (lowerText.includes('arctic') || lowerText.includes('ice') || lowerText.includes('cold')) {
		return 'arctic';
	}
	if (lowerText.includes('english') || lowerText.includes('countryside') || lowerText.includes('england')) {
		return 'english-countryside';
	}

	return null;
}
