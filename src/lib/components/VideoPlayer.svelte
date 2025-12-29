<script lang="ts">
	interface Props {
		pace: number;
	}

	let { pace }: Props = $props();

	let videoElement: HTMLVideoElement;

	// Calculate loop duration based on pace (strokes per minute)
	// e.g., 24 SPM = 60/24 = 2.5 seconds per stroke
	let loopDuration = $derived((60 / pace) * 1000);

	$effect(() => {
		if (!videoElement) return;

		// Read loopDuration to track it as a dependency
		const duration = loopDuration;

		videoElement.play();
		videoElement.currentTime = 0;

		const interval = setInterval(() => {
			videoElement.currentTime = 0;
		}, duration);

		// Cleanup when pace changes or component unmounts
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="absolute inset-0 overflow-hidden bg-black">
	<video
		bind:this={videoElement}
		src="/row.mp4"
		muted
		playsinline
		class="h-full w-full object-contain"
	>
		<track kind="captions" />
	</video>
</div>
