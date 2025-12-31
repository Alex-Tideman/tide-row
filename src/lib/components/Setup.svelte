<script lang="ts">
	import { journeys, formatDistance, defaultJourney } from '$lib/journeys';

	interface Workout {
		id: string;
		name: string;
		description: string;
		duration: number; // total minutes
		interval: number; // interval in minutes
		pace: number; // strokes per minute
		icon: string;
		color: string;
	}

	const presetWorkouts: Workout[] = [
		{
			id: 'sprint',
			name: 'Sprint Intervals',
			description: 'High intensity 2-min bursts',
			duration: 24,
			interval: 2,
			pace: 30,
			icon: '⚡',
			color: 'from-orange-500 to-red-500'
		},
		{
			id: 'endurance',
			name: 'Steady State',
			description: 'Long continuous rowing',
			duration: 30,
			interval: 30,
			pace: 22,
			icon: '🏔️',
			color: 'from-blue-500 to-cyan-500'
		},
		{
			id: 'hiit',
			name: 'HIIT Power',
			description: 'Short explosive intervals',
			duration: 20,
			interval: 1,
			pace: 32,
			icon: '🔥',
			color: 'from-red-500 to-pink-500'
		},
		{
			id: 'tempo',
			name: 'Tempo Build',
			description: 'Progressive 5-min blocks',
			duration: 25,
			interval: 5,
			pace: 26,
			icon: '📈',
			color: 'from-green-500 to-emerald-500'
		},
		{
			id: 'recovery',
			name: 'Recovery Row',
			description: 'Easy pace, active recovery',
			duration: 20,
			interval: 10,
			pace: 20,
			icon: '🌊',
			color: 'from-purple-500 to-indigo-500'
		}
	];

	interface Props {
		onStart: (interval: number, pace: number, journeyId: string) => void;
		currentJourneyId?: string;
		currentProgress?: number;
	}

	let { onStart, currentJourneyId, currentProgress = 0 }: Props = $props();

	let interval = $state(5);
	let pace = $state(24);
	let selectedJourneyId = $state(currentJourneyId || defaultJourney.id);
	let selectedWorkoutId = $state<string | null>(null);

	function handleStart() {
		onStart(interval, pace, selectedJourneyId);
	}

	function selectWorkout(workout: Workout) {
		selectedWorkoutId = workout.id;
		interval = workout.interval;
		pace = workout.pace;
	}

	function getProgressForJourney(journeyId: string): number {
		if (journeyId === currentJourneyId) {
			return currentProgress;
		}
		return 0;
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
	<h1 class="mb-8 text-5xl font-bold text-white">Row Tide</h1>

	<div class="mb-8 flex flex-col gap-6">
		<!-- Preset Workouts -->
		<div class="flex flex-col gap-3">
			<label class="text-center text-lg text-slate-300">Choose a Workout</label>
			<div class="grid grid-cols-5 gap-2">
				{#each presetWorkouts as workout}
					<button
						onclick={() => selectWorkout(workout)}
						class="relative flex flex-col items-center rounded-lg p-3 transition-all {selectedWorkoutId === workout.id
							? 'ring-2 ring-white bg-gradient-to-br ' + workout.color
							: 'bg-slate-800 hover:bg-slate-700'}"
					>
						<span class="text-2xl">{workout.icon}</span>
						<span class="mt-1 text-sm font-semibold text-white">{workout.name}</span>
						<span class="text-xs text-slate-300">{workout.duration} min</span>
						<span class="mt-1 text-xs text-slate-400">{workout.interval}m @ {workout.pace} SPM</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Manual Settings -->
		<div class="flex flex-col gap-2">
			<label class="text-center text-sm text-slate-500">Or customize manually</label>
			<div class="flex justify-center gap-8">
				<div class="flex flex-col items-center gap-1">
					<label for="interval" class="text-sm text-slate-400">Interval (min)</label>
					<input
						id="interval"
						type="number"
						bind:value={interval}
						min="1"
						max="120"
						onchange={() => (selectedWorkoutId = null)}
						class="w-24 rounded-lg bg-slate-800 px-3 py-2 text-center text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="flex flex-col items-center gap-1">
					<label for="pace" class="text-sm text-slate-400">Pace (SPM)</label>
					<input
						id="pace"
						type="number"
						bind:value={pace}
						min="10"
						max="60"
						onchange={() => (selectedWorkoutId = null)}
						class="w-24 rounded-lg bg-slate-800 px-3 py-2 text-center text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<label class="text-center text-lg text-slate-300">Choose Your Journey</label>
			<div class="grid max-h-64 gap-2 overflow-y-auto pr-2">
				{#each journeys as journey}
					{@const progress = getProgressForJourney(journey.id)}
					{@const progressPercent = (progress / journey.distance) * 100}
					{@const isComplete = progressPercent >= 100}
					<button
						onclick={() => (selectedJourneyId = journey.id)}
						class="relative overflow-hidden rounded-lg p-3 text-left transition-all {selectedJourneyId === journey.id
							? 'bg-blue-600 ring-2 ring-blue-400'
							: 'bg-slate-800 hover:bg-slate-700'}"
					>
						{#if progress > 0}
							<div
								class="absolute inset-0 {isComplete ? 'bg-green-500/20' : 'bg-blue-500/20'}"
								style="width: {Math.min(progressPercent, 100)}%"
							></div>
						{/if}
						<div class="relative">
							<div class="flex items-center justify-between">
								<span class="font-semibold text-white">{journey.name}</span>
								<span class="text-sm text-slate-300">{formatDistance(journey.distance)}</span>
							</div>
							<div class="text-sm text-slate-400">
								{journey.from} → {journey.to}
							</div>
							{#if progress > 0}
								<div class="mt-1 text-xs {isComplete ? 'text-green-400' : 'text-blue-400'}">
									{isComplete ? 'Complete!' : `${formatDistance(progress)} (${progressPercent.toFixed(1)}%)`}
								</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<button
		onclick={handleStart}
		class="rounded-2xl bg-blue-600 px-16 py-6 text-3xl font-bold text-white transition-colors hover:bg-blue-500 active:bg-blue-700"
	>
		Start
	</button>
</div>
