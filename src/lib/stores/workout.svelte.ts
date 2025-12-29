import { defaultScenery } from '$lib/scenery';

export interface WorkoutState {
	isActive: boolean;
	elapsedTime: number;
	interval: number;
	intervalCountdown: number;
	intervalsCompleted: number;
	pace: number;
	scenery: string;
}

interface PersistedState {
	isActive: boolean;
	elapsedTime: number;
	interval: number;
	intervalCountdown: number;
	intervalsCompleted: number;
	pace: number;
	scenery: string;
	lastTick: number;
}

const STORAGE_KEY = 'row-tide-workout';

function loadState(): PersistedState | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			return JSON.parse(saved);
		}
	} catch {
		// Ignore parse errors
	}
	return null;
}

function saveState(state: PersistedState) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Ignore storage errors
	}
}

function clearState() {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// Ignore storage errors
	}
}

function createWorkoutStore() {
	let isActive = $state(false);
	let elapsedTime = $state(0);
	let interval = $state(5);
	let intervalCountdown = $state(0);
	let intervalsCompleted = $state(0);
	let pace = $state(24);
	let scenery = $state(defaultScenery);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	function persist() {
		saveState({
			isActive,
			elapsedTime,
			interval,
			intervalCountdown,
			intervalsCompleted,
			pace,
			scenery,
			lastTick: Date.now()
		});
	}

	function startTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		timerInterval = setInterval(() => {
			elapsedTime += 1;
			intervalCountdown -= 1;

			if (intervalCountdown <= 0) {
				intervalsCompleted += 1;
				intervalCountdown = interval * 60;
			}

			persist();
		}, 1000);
	}

	function restore() {
		const saved = loadState();
		if (saved && saved.isActive) {
			const now = Date.now();
			const secondsPassed = Math.floor((now - saved.lastTick) / 1000);

			isActive = true;
			interval = saved.interval;
			pace = saved.pace;
			scenery = saved.scenery || defaultScenery;
			elapsedTime = saved.elapsedTime + secondsPassed;
			intervalsCompleted = saved.intervalsCompleted || 0;

			// Calculate new countdown and any completed intervals while away
			let newCountdown = saved.intervalCountdown - secondsPassed;
			const intervalSeconds = saved.interval * 60;
			while (newCountdown <= 0) {
				intervalsCompleted += 1;
				newCountdown += intervalSeconds;
			}
			intervalCountdown = newCountdown;

			startTimer();
		}
	}

	function start(initialInterval: number, initialPace: number) {
		interval = initialInterval;
		pace = initialPace;
		elapsedTime = 0;
		intervalCountdown = initialInterval * 60;
		intervalsCompleted = 0;
		isActive = true;

		persist();
		startTimer();
	}

	function end() {
		isActive = false;
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		clearState();
	}

	function updatePace(newPace: number) {
		if (newPace > 0 && newPace <= 60) {
			pace = newPace;
			intervalCountdown = interval * 60;
			persist();
		}
	}

	function updateInterval(newInterval: number) {
		if (newInterval > 0 && newInterval <= 120) {
			interval = newInterval;
			intervalCountdown = newInterval * 60;
			persist();
		}
	}

	function updateScenery(newScenery: string) {
		scenery = newScenery;
		persist();
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
		get intervalsCompleted() {
			return intervalsCompleted;
		},
		get pace() {
			return pace;
		},
		get scenery() {
			return scenery;
		},
		start,
		end,
		restore,
		updatePace,
		updateInterval,
		updateScenery
	};
}

export const workout = createWorkoutStore();
