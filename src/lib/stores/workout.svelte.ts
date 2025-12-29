export interface WorkoutState {
	isActive: boolean;
	elapsedTime: number;
	interval: number;
	intervalCountdown: number;
	pace: number;
}

function createWorkoutStore() {
	let isActive = $state(false);
	let elapsedTime = $state(0);
	let interval = $state(5);
	let intervalCountdown = $state(0);
	let pace = $state(24);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	function start(initialInterval: number, initialPace: number) {
		interval = initialInterval;
		pace = initialPace;
		elapsedTime = 0;
		intervalCountdown = initialInterval * 60;
		isActive = true;

		timerInterval = setInterval(() => {
			elapsedTime += 1;
			intervalCountdown -= 1;

			if (intervalCountdown <= 0) {
				intervalCountdown = interval * 60;
			}
		}, 1000);
	}

	function end() {
		isActive = false;
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function updatePace(newPace: number) {
		if (newPace > 0 && newPace <= 60) {
			pace = newPace;
			intervalCountdown = interval * 60;
		}
	}

	function updateInterval(newInterval: number) {
		if (newInterval > 0 && newInterval <= 120) {
			interval = newInterval;
			intervalCountdown = newInterval * 60;
		}
	}

	return {
		get isActive() {
			return isActive;
		},
		get elapsedTime() {
			return elapsedTime;
		},
		get interval() {
			return interval;
		},
		get intervalCountdown() {
			return intervalCountdown;
		},
		get pace() {
			return pace;
		},
		start,
		end,
		updatePace,
		updateInterval
	};
}

export const workout = createWorkoutStore();
