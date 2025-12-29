<script lang="ts">
	import { sceneries } from '$lib/scenery';
	import JourneyProgress from './JourneyProgress.svelte';

	interface Props {
		elapsedTime: number;
		interval: number;
		intervalCountdown: number;
		intervalsCompleted: number;
		pace: number;
		sceneryId: string;
		isListening?: boolean;
		sessionDistance: number;
		journeyId: string;
		journeyProgress: number;
	}

	let {
		elapsedTime,
		interval,
		intervalCountdown,
		intervalsCompleted,
		pace,
		sceneryId,
		isListening = false,
		sessionDistance,
		journeyId,
		journeyProgress
	}: Props = $props();

	const sceneryList = Object.values(sceneries);

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	// Circle progress calculations
	const radius = 120;
	const circumference = 2 * Math.PI * radius;

	let progress = $derived(() => {
		const totalSeconds = interval * 60;
		const elapsedInInterval = totalSeconds - intervalCountdown;
		return elapsedInInterval / totalSeconds;
	});

	let strokeDashoffset = $derived(circumference * (1 - progress()));
</script>

<div class="flex w-full justify-between gap-4 p-3">
	<div class="scale-80 rounded-xl bg-black/60 p-6 text-white backdrop-blur-sm lg:scale-100">
		<div class="relative flex flex-col items-center gap-2">
			<svg width="400" height="400" class="-rotate-90">
				<circle cx="200" cy="200" r={radius} fill="none" stroke="#374151" stroke-width="24" />
				<circle
					cx="200"
					cy="200"
					r={radius}
					fill="none"
					stroke="#22c55e"
					stroke-width="24"
					stroke-linecap="round"
					stroke-dasharray={circumference}
					stroke-dashoffset={strokeDashoffset}
					class="transition-all duration-1000 ease-linear"
				/>
			</svg>
			<div class="absolute inset-0 flex flex-col items-center justify-center">
				<p class="font-mono text-5xl font-bold">{formatTime(intervalCountdown)}</p>
				<p class="text-2xl text-slate-400">/ {formatTime(interval * 60)}</p>
			</div>
		</div>
	</div>
	<JourneyProgress {journeyId} {journeyProgress} {sessionDistance} />

	<div class="flex flex-col gap-4">
		<div
			class="flex flex-col items-end gap-4 rounded-xl bg-black/60 p-6 text-right text-white backdrop-blur-sm"
		>
			<div class="leading-12 md:leading-24">
				{#if isListening}
					<div class="flex items-center gap-2 text-xs text-green-400 lg:text-sm">
						<p>Voice active</p>
						<p class="h-2 w-2 animate-pulse rounded-full bg-green-400"></p>
					</div>
				{/if}
				<p class="text-6xl font-bold md:text-8xl">
					{pace}
				</p>
				<p class="text-2xl text-slate-300">SPM</p>
			</div>
		</div>
		<div class="flex flex-col gap-2 rounded-xl bg-black/60 p-6 text-white backdrop-blur-sm">
			{#each sceneryList as scenery}
				<div
					class="rounded-lg px-3 py-2 text-xs transition-all {scenery.id === sceneryId
						? 'bg-green-600/80 font-semibold text-white'
						: 'text-slate-200'}"
				>
					{scenery.name}
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="absolute bottom-4 left-4 flex flex-col gap-4">
	<div class="rounded-xl bg-black/60 p-6 text-white backdrop-blur-sm">
		<div class="flex flex-wrap items-center gap-8 text-left">
			<div>
				<div class="leading-12">
					<p class="text-xl text-slate-400">Total</p>
					<p class="font-mono text-5xl font-semibold text-white">{formatTime(elapsedTime)}</p>
				</div>

				<div class="leading-12">
					<p class="text-xl text-slate-400">Intervals</p>
					<p class="font-mono text-5xl font-semibold text-white">{intervalsCompleted}</p>
				</div>
			</div>
		</div>
	</div>
</div>
