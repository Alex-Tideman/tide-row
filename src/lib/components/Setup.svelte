<script lang="ts">
	import { journeys, formatDistance, defaultJourney } from '$lib/journeys';

	interface Props {
		onStart: (interval: number, pace: number, journeyId: string) => void;
		currentJourneyId?: string;
		currentProgress?: number;
	}

	let { onStart, currentJourneyId, currentProgress = 0 }: Props = $props();

	let interval = $state(5);
	let pace = $state(24);
	let selectedJourneyId = $state(currentJourneyId || defaultJourney.id);

	function handleStart() {
		onStart(interval, pace, selectedJourneyId);
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
		<div class="flex gap-8">
			<div class="flex flex-col items-center gap-2">
				<label for="interval" class="text-lg text-slate-300">Interval (minutes)</label>
				<input
					id="interval"
					type="number"
					bind:value={interval}
					min="1"
					max="120"
					class="w-32 rounded-lg bg-slate-800 px-4 py-3 text-center text-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="flex flex-col items-center gap-2">
				<label for="pace" class="text-lg text-slate-300">Pace (strokes/min)</label>
				<input
					id="pace"
					type="number"
					bind:value={pace}
					min="10"
					max="60"
					class="w-32 rounded-lg bg-slate-800 px-4 py-3 text-center text-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
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
