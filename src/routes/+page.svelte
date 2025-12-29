<script lang="ts">
	import { onMount } from 'svelte';
	import Setup from '$lib/components/Setup.svelte';
	import RowingScene from '$lib/components/RowingScene.svelte';
	import WorkoutDisplay from '$lib/components/WorkoutDisplay.svelte';
	import { workout } from '$lib/stores/workout.svelte';
	import { startListening, stopListening, getVoiceState } from '$lib/voice.svelte';

	const voiceState = getVoiceState();

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

	function handleStart(interval: number, pace: number) {
		workout.start(interval, pace);
		startVoiceListening();
	}

	function handleEnd() {
		stopListening();
		workout.end();
	}
</script>

{#if workout.isActive}
	<div class="relative h-screen w-screen overflow-hidden">
		<RowingScene pace={workout.pace} sceneryId={workout.scenery} />
		<WorkoutDisplay
			elapsedTime={workout.elapsedTime}
			interval={workout.interval}
			intervalCountdown={workout.intervalCountdown}
			intervalsCompleted={workout.intervalsCompleted}
			pace={workout.pace}
			sceneryId={workout.scenery}
			isListening={voiceState.isListening}
		/>

		<button
			onclick={handleEnd}
			class="absolute right-4 bottom-4 rounded-sm bg-red-600/80 px-4 py-3 text-xl text-white backdrop-blur-sm transition-colors hover:bg-red-500"
		>
			End Workout
		</button>
	</div>
{:else}
	<Setup onStart={handleStart} />
{/if}
