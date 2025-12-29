export interface Journey {
	id: string;
	name: string;
	from: string;
	to: string;
	distance: number; // in meters
	description: string;
	scenery: string; // default scenery for this journey
}

export const journeys: Journey[] = [
	{
		id: 'sf-to-alcatraz',
		name: 'Alcatraz Escape',
		from: 'San Francisco',
		to: 'Alcatraz Island',
		distance: 4000, // 4 km
		description: 'A quick row across the bay to the infamous island prison',
		scenery: 'mountain-lake'
	},
	{
		id: 'english-channel',
		name: 'English Channel Crossing',
		from: 'Dover, England',
		to: 'Calais, France',
		distance: 5000, // 5 km
		description: 'Cross the famous channel between England and France',
		scenery: 'english-countryside'
	},
	{
		id: 'thames-marathon',
		name: 'Thames Marathon',
		from: 'Oxford',
		to: 'London',
		distance: 6000, // 6 km
		description: 'Row the length of the River Thames through the English countryside',
		scenery: 'english-countryside'
	},
	{
		id: 'caribbean-islands',
		name: 'Caribbean Island Hop',
		from: 'Puerto Rico',
		to: 'Virgin Islands',
		distance: 7000, // 7 km
		description: 'Island hop through the crystal blue Caribbean waters',
		scenery: 'tropical-ocean'
	},
	{
		id: 'hawaii-molokai',
		name: 'Molokai Channel',
		from: 'Molokai',
		to: 'Oahu',
		distance: 8000, // 8 km
		description: 'One of the most challenging ocean channels in the world',
		scenery: 'tropical-ocean'
	},
	{
		id: 'norway-fjords',
		name: 'Norwegian Fjords',
		from: 'Bergen',
		to: 'Flåm',
		distance: 9000, // 9 km
		description: 'Navigate through the stunning Norwegian fjord system',
		scenery: 'mountain-lake'
	},
	{
		id: 'amazon-expedition',
		name: 'Amazon Expedition',
		from: 'Manaus',
		to: 'Atlantic Ocean',
		distance: 10000, // 10 km
		description: 'An epic journey down the mighty Amazon river',
		scenery: 'tropical-ocean'
	},
	{
		id: 'arctic-passage',
		name: 'Arctic Passage',
		from: 'Greenland',
		to: 'Iceland',
		distance: 10000, // 10 km
		description: 'Brave the icy waters of the North Atlantic',
		scenery: 'arctic'
	}
];

export const defaultJourney = journeys[0];

export function formatDistance(meters: number): string {
	if (meters < 1000) {
		return `${Math.round(meters)}m`;
	} else if (meters < 10000) {
		return `${(meters / 1000).toFixed(2)}km`;
	} else {
		return `${(meters / 1000).toFixed(1)}km`;
	}
}

export function getJourneyById(id: string): Journey | undefined {
	return journeys.find((j) => j.id === id);
}

// Calculate meters per second based on pace (strokes per minute)
// Assuming ~10 meters per stroke for recreational rowing
export function calculateMetersPerMinute(pace: number): number {
	const metersPerStroke = 10;
	return pace * metersPerStroke;
}
