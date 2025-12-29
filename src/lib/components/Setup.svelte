<script lang="ts">
	interface Props {
		onStart: (interval: number, pace: number) => void;
	}

	let { onStart }: Props = $props();

	let interval = $state(5);
	let pace = $state(24);

	function handleStart() {
		onStart(interval, pace);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
	<h1 class="mb-12 text-5xl font-bold text-white">Row Tide</h1>

	<div class="mb-12 flex flex-col gap-8">
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

	<button
		onclick={handleStart}
		class="rounded-2xl bg-blue-600 px-16 py-6 text-3xl font-bold text-white transition-colors hover:bg-blue-500 active:bg-blue-700"
	>
		Start
	</button>
</div>
