import { defaultScenery } from '$lib/scenery';
import { defaultJourney, calculateMetersPerMinute } from '$lib/journeys';

export interface WorkoutState {
	isActive: boolean;
	isWarmup: boolean;
	warmupCountdown: number;
	elapsedTime: number;
	interval: number;
	intervalCountdown: number;
	intervalsCompleted: number;
	pace: number;
	scenery: string;
	sessionDistance: number;
	journeyId: string;
	journeyProgress: number;
}

interface PersistedState {
	isActive: boolean;
	isPaused: boolean;
	isWarmup: boolean;
	warmupCountdown: number;
	elapsedTime: number;
	interval: number;
	intervalCountdown: number;
	intervalsCompleted: number;
	pace: number;
	scenery: string;
	sessionDistance: number;
	journeyId: string;
	journeyProgress: number;
	lastTick: number;
}

const WARMUP_DURATION = 120; // 2 minutes in seconds

interface JourneyPersistence {
	journeyId: string;
	progress: number;
	totalDistance: number;
}

const STORAGE_KEY = 'row-tide-workout';
const JOURNEY_STORAGE_KEY = 'row-tide-journey';

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

function loadJourneyProgress(): JourneyPersistence | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const saved = localStorage.getItem(JOURNEY_STORAGE_KEY);
		if (saved) {
			return JSON.parse(saved);
		}
	} catch {
		// Ignore parse errors
	}
	return null;
}

function saveJourneyProgress(data: JourneyPersistence) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(data));
	} catch {
		// Ignore storage errors
	}
}

function createWorkoutStore() {
	// Load saved journey progress
	const savedJourney = loadJourneyProgress();

	let isActive = $state(false);
	let isPaused = $state(false);
	let isWarmup = $state(false);
	let warmupCountdown = $state(0);
	let elapsedTime = $state(0);
	let interval = $state(5);
	let intervalCountdown = $state(0);
	let intervalsCompleted = $state(0);
	let pace = $state(24);
	let scenery = $state(defaultScenery);
	let sessionDistance = $state(0);
	let journeyId = $state(savedJourney?.journeyId || defaultJourney.id);
	let journeyProgress = $state(savedJourney?.progress || 0);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	function persist() {
		saveState({
			isActive,
			isPaused,
			isWarmup,
			warmupCountdown,
			elapsedTime,
			interval,
			intervalCountdown,
			intervalsCompleted,
			pace,
			scenery,
			sessionDistance,
			journeyId,
			journeyProgress,
			lastTick: Date.now()
		});
	}

	function persistJourney() {
		saveJourneyProgress({
			journeyId,
			progress: journeyProgress,
			totalDistance: 0
		});
	}

	function startTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		timerInterval = setInterval(() => {
			if (isWarmup) {
				// During warmup, just count down
				warmupCountdown -= 1;
				if (warmupCountdown <= 0) {
					// Warmup complete, start main workout
					isWarmup = false;
					warmupCountdown = 0;
					intervalCountdown = interval * 60;
				}
				persist();
			} else {
				// Main workout
				elapsedTime += 1;
				intervalCountdown -= 1;

				// Calculate distance traveled this second
				const metersPerSecond = calculateMetersPerMinute(pace) / 60;
				sessionDistance += metersPerSecond;
				journeyProgress += metersPerSecond;

				if (intervalCountdown <= 0) {
					intervalsCompleted += 1;
					intervalCountdown = interval * 60;
				}

				persist();
				persistJourney();
			}
		}, 1000);
	}

	function restore() {
		const saved = loadState();
		if (saved && saved.isActive) {
			isActive = true;
			interval = saved.interval;
			pace = saved.pace;
			scenery = saved.scenery || defaultScenery;
			journeyId = saved.journeyId || defaultJourney.id;
			intervalsCompleted = saved.intervalsCompleted || 0;

			// If paused, restore exact state without advancing time
			if (saved.isPaused) {
				isPaused = true;
				isWarmup = saved.isWarmup || false;
				warmupCountdown = saved.warmupCountdown || 0;
				elapsedTime = saved.elapsedTime;
				intervalCountdown = saved.intervalCountdown;
				sessionDistance = saved.sessionDistance || 0;
				journeyProgress = saved.journeyProgress || 0;
				return;
			}

			// Not paused - calculate time passed while away
			const now = Date.now();
			let secondsPassed = Math.floor((now - saved.lastTick) / 1000);

			// Handle warmup time while away
			if (saved.isWarmup) {
				const warmupRemaining = saved.warmupCountdown - secondsPassed;
				if (warmupRemaining > 0) {
					// Still in warmup
					isWarmup = true;
					warmupCountdown = warmupRemaining;
					elapsedTime = 0;
					intervalCountdown = 0;
					sessionDistance = saved.sessionDistance || 0;
					journeyProgress = saved.journeyProgress || 0;
					startTimer();
					return;
				} else {
					// Warmup finished while away, calculate main workout time
					isWarmup = false;
					warmupCountdown = 0;
					secondsPassed = -warmupRemaining; // Time spent in main workout
				}
			}

			elapsedTime = (saved.isWarmup ? 0 : saved.elapsedTime) + secondsPassed;

			// Calculate distance traveled while away (only during main workout)
			const metersWhileAway = (calculateMetersPerMinute(saved.pace) / 60) * secondsPassed;
			sessionDistance = (saved.sessionDistance || 0) + metersWhileAway;
			journeyProgress = (saved.journeyProgress || 0) + metersWhileAway;

			// Calculate new countdown and any completed intervals while away
			const startingCountdown = saved.isWarmup ? saved.interval * 60 : saved.intervalCountdown;
			let newCountdown = startingCountdown - secondsPassed;
			const intervalSeconds = saved.interval * 60;
			while (newCountdown <= 0) {
				intervalsCompleted += 1;
				newCountdown += intervalSeconds;
			}
			intervalCountdown = newCountdown;

			startTimer();
		}
	}

	function start(initialInterval: number, initialPace: number, selectedJourneyId?: string) {
		interval = initialInterval;
		pace = initialPace;
		elapsedTime = 0;
		intervalCountdown = 0; // Will be set after warmup
		intervalsCompleted = 0;
		sessionDistance = 0;
		isActive = true;
		isPaused = true; // Start paused, waiting for voice command "Start"
		isWarmup = true;
		warmupCountdown = WARMUP_DURATION;

		// If a new journey is selected, reset progress
		if (selectedJourneyId && selectedJourneyId !== journeyId) {
			journeyId = selectedJourneyId;
			journeyProgress = 0;
		}

		persist();
		persistJourney();
		// Don't start timer - wait for voice command or button press
	}

	function end() {
		isActive = false;
		isPaused = false;
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		clearState();
	}

	function pause() {
		if (!isPaused && isActive) {
			isPaused = true;
			if (timerInterval) {
				clearInterval(timerInterval);
				timerInterval = null;
			}
			persist();
		}
	}

	function resume() {
		if (isPaused && isActive) {
			isPaused = false;
			startTimer();
		}
	}

	function updatePace(newPace: number) {
		if (newPace > 0 && newPace <= 120) {
			pace = newPace;
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
		get isPaused() {
			return isPaused;
		},
		get isWarmup() {
			return isWarmup;
		},
		get warmupCountdown() {
			return warmupCountdown;
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
		get sessionDistance() {
			return sessionDistance;
		},
		get journeyId() {
			return journeyId;
		},
		get journeyProgress() {
			return journeyProgress;
		},
		start,
		end,
		pause,
		resume,
		restore,
		updatePace,
		updateInterval,
		updateScenery
	};
}

export const workout = createWorkoutStore();
