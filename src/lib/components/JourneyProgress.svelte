<script lang="ts">
	import { getJourneyById, formatDistance, type Journey } from '$lib/journeys';

	interface Props {
		journeyId: string;
		journeyProgress: number;
		sessionDistance: number;
	}

	let { journeyId, journeyProgress, sessionDistance }: Props = $props();

	let journey = $derived(getJourneyById(journeyId));
	let progressPercent = $derived(
		journey ? Math.min((journeyProgress / journey.distance) * 100, 100) : 0
	);
	let isComplete = $derived(progressPercent >= 100);
</script>

{#if journey}
	<div
		class="hidden max-h-fit w-full flex-col gap-3 rounded-xl bg-black/60 p-4 text-white backdrop-blur-sm lg:flex"
	>
		<div class="flex items-center justify-between">
			<div>
				<p class="text-lg font-semibold text-white">{journey.name}</p>
				<p class="text-sm text-slate-400">{journey.from} → {journey.to}</p>
			</div>
			{#if isComplete}
				<span class="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white"
					>COMPLETE!</span
				>
			{/if}
		</div>

		<div class="relative h-6 overflow-hidden rounded-full bg-slate-700">
			<div
				class="h-full rounded-full transition-all duration-1000 ease-linear {isComplete
					? 'bg-green-500'
					: 'bg-blue-500'}"
				style="width: {progressPercent}%"
			></div>
			<div class="absolute inset-0 flex items-center justify-center">
				<span class="text-xs font-semibold text-white drop-shadow-md">
					{progressPercent.toFixed(1)}%
				</span>
			</div>
		</div>

		<div class="flex justify-between text-sm">
			<div>
				<p class="text-slate-400">Journey Progress</p>
				<p class="font-mono text-white">
					{formatDistance(journeyProgress)} / {formatDistance(journey.distance)}
				</p>
			</div>
			<div class="text-right">
				<p class="text-slate-400">This Session</p>
				<p class="font-mono text-white">{formatDistance(sessionDistance)}</p>
			</div>
		</div>
	</div>
{/if}
