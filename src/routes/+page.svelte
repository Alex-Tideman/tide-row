<script lang="ts">
	import { onMount } from 'svelte';
	import Setup from '$lib/components/Setup.svelte';
	import RowingScene from '$lib/components/RowingScene.svelte';
	import WorkoutDisplay from '$lib/components/WorkoutDisplay.svelte';
	import { workout } from '$lib/stores/workout.svelte';
	import { startListening, stopListening, getVoiceState } from '$lib/voice.svelte';
	import { getJourneyById } from '$lib/journeys';

	const voiceState = getVoiceState();

	let currentJourney = $derived(getJourneyById(workout.journeyId));

	function startVoiceListening() {
		startListening({
			onEnd: () => {
				workout.end();
			},
			onCommand: (command) => {
				console.log('Voice command:', command);
			}
		});
	}

	onMount(() => {
		workout.restore();
		if (workout.isActive) {
			startVoiceListening();
		}
	});

	function handleStart(interval: number, pace: number, journeyId: string) {
		workout.start(interval, pace, journeyId);
		startVoiceListening();
	}

	function handleEnd() {
		stopListening();
		workout.end();
	}
</script>

{#if workout.isActive}
	<div class="relative h-screen w-screen overflow-hidden">
		<RowingScene
			pace={workout.pace}
			sceneryId={workout.scenery}
			isPaused={workout.isPaused}
			journeyProgress={workout.journeyProgress}
			journeyDistance={currentJourney?.distance ?? 10000}
		/>
		<WorkoutDisplay
			elapsedTime={workout.elapsedTime}
			interval={workout.interval}
			intervalCountdown={workout.intervalCountdown}
			intervalsCompleted={workout.intervalsCompleted}
			pace={workout.pace}
			sceneryId={workout.scenery}
			isListening={voiceState.isListening}
			sessionDistance={workout.sessionDistance}
			journeyId={workout.journeyId}
			journeyProgress={workout.journeyProgress}
			isWarmup={workout.isWarmup}
			warmupCountdown={workout.warmupCountdown}
		/>

		<div class="absolute right-4 bottom-4 z-50 flex gap-2">
			<button
				onclick={() => (workout.isPaused ? workout.resume() : workout.pause())}
				class="rounded-sm px-4 py-3 text-white backdrop-blur-sm transition-colors {workout.isPaused
					? 'bg-green-600/80 hover:bg-green-500'
					: 'bg-yellow-600/80 hover:bg-yellow-500'}"
			>
				{#if workout.isPaused}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M8 5v14l11-7z" />
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
					</svg>
				{/if}
			</button>
			<button
				onclick={handleEnd}
				class="rounded-sm bg-transparent p-1 backdrop-blur-sm transition-transform hover:scale-110"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
					<polygon
						points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
						fill="#dc2626"
						stroke="#991b1b"
						stroke-width="3"
					/>
					<text
						x="50"
						y="58"
						text-anchor="middle"
						font-size="22"
						font-weight="bold"
						fill="white"
						font-family="Arial, sans-serif">STOP</text
					>
				</svg>
			</button>
		</div>
	</div>
{:else}
	<Setup
		onStart={handleStart}
		currentJourneyId={workout.journeyId}
		currentProgress={workout.journeyProgress}
	/>
{/if}
