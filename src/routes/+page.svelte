<script lang="ts">
	import Setup from '$lib/components/Setup.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import WorkoutDisplay from '$lib/components/WorkoutDisplay.svelte';
	import { workout } from '$lib/stores/workout.svelte';
	import { startListening, stopListening, getVoiceState } from '$lib/voice.svelte';

	const voiceState = getVoiceState();

	function handleStart(interval: number, pace: number) {
		workout.start(interval, pace);
		startListening({
			onEnd: () => {
				workout.end();
			},
			onCommand: (command) => {
				console.log('Voice command:', command);
			}
		});
	}

	function handleEnd() {
		stopListening();
		workout.end();
	}
</script>

{#if workout.isActive}
	<div class="relative h-screen w-screen overflow-hidden">
		<VideoPlayer pace={workout.pace} />
		<WorkoutDisplay
			elapsedTime={workout.elapsedTime}
			interval={workout.interval}
			intervalCountdown={workout.intervalCountdown}
			pace={workout.pace}
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
