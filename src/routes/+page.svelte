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
		/>

		<div class="absolute right-4 bottom-4 z-50 flex gap-2">
			<button
				onclick={() => workout.isPaused ? workout.resume() : workout.pause()}
				class="rounded-sm px-4 py-3 text-xl text-white backdrop-blur-sm transition-colors {workout.isPaused ? 'bg-green-600/80 hover:bg-green-500' : 'bg-yellow-600/80 hover:bg-yellow-500'}"
			>
				{workout.isPaused ? 'Resume' : 'Pause'}
			</button>
			<button
				onclick={handleEnd}
				class="rounded-sm bg-red-600/80 px-4 py-3 text-xl text-white backdrop-blur-sm transition-colors hover:bg-red-500"
			>
				End Workout
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
