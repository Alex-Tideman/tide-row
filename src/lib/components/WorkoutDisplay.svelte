<script lang="ts">
	interface Props {
		elapsedTime: number;
		interval: number;
		intervalCountdown: number;
		pace: number;
		isListening?: boolean;
	}

	let { elapsedTime, interval, intervalCountdown, pace, isListening = false }: Props = $props();

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="absolute top-4 left-4 rounded-xl bg-black/60 p-6 text-white backdrop-blur-sm">
	<div class="flex flex-col gap-3">
		<div class="font-mono text-8xl font-bold tracking-tight">
			{formatTime(intervalCountdown)}
		</div>

		<div class="flex items-center gap-2">
			<span class="text-xl text-slate-400">Total:</span>
			<span class="font-mono text-3xl font-semibold text-white">{formatTime(elapsedTime)}</span>
		</div>

		{#if isListening}
			<div class="flex items-center gap-2 text-sm text-green-400">
				<span class="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
				Voice active
			</div>
		{/if}
	</div>
</div>

<div class="absolute top-4 right-4 rounded-xl bg-black/60 p-6 text-white backdrop-blur-sm">
	<div class="flex flex-col gap-4 text-right">
		<div>
			<span class="text-lg text-slate-400">Interval</span>
			<div class="text-4xl font-semibold">{interval} min</div>
		</div>
		<div>
			<span class="text-lg text-slate-400">Pace</span>
			<div class="text-7xl font-bold"><span class="text-3xl text-slate-300">SPM</span> {pace}</div>
		</div>
	</div>
</div>
