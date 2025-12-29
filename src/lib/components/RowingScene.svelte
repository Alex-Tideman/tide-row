<script lang="ts">
	import Rower from './Rower.svelte';
	import { sceneries, type Scenery } from '$lib/scenery';

	interface Props {
		pace: number;
		sceneryId: string;
	}

	let { pace, sceneryId }: Props = $props();

	let scenery: Scenery = $derived(sceneries[sceneryId] || sceneries['mountain-lake']);
</script>

<div class="scene" style="--sky-gradient: {scenery.sky.gradient}">
	<!-- Sky layer -->
	<div class="sky"></div>

	<!-- Background elements layer -->
	<div class="background">
		{#if scenery.background.elements === 'mountains'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<path
					d="M0 200 L0 140 L100 80 L200 130 L300 60 L400 120 L500 40 L600 110 L700 50 L800 100 L900 70 L1000 120 L1100 90 L1200 140 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.9"
				/>
				<path
					d="M0 200 L0 160 L150 120 L300 150 L450 100 L600 140 L750 110 L900 150 L1050 130 L1200 160 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.6"
				/>
			</svg>
		{:else if scenery.background.elements === 'palms'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<!-- Island/shore -->
				<ellipse cx="200" cy="200" rx="250" ry="60" fill={scenery.background.color} />
				<ellipse cx="1000" cy="200" rx="300" ry="70" fill={scenery.background.color} />
				<!-- Palm trees -->
				<g transform="translate(150, 80)">
					<rect x="0" y="40" width="8" height="60" fill="#8B4513" />
					<path d="M4 40 Q-30 20 -40 40" stroke="#228B22" stroke-width="8" fill="none" />
					<path d="M4 40 Q30 15 50 35" stroke="#228B22" stroke-width="8" fill="none" />
					<path d="M4 40 Q-10 10 -20 30" stroke="#2E8B2E" stroke-width="6" fill="none" />
					<path d="M4 40 Q20 5 35 25" stroke="#2E8B2E" stroke-width="6" fill="none" />
				</g>
				<g transform="translate(1050, 90)">
					<rect x="0" y="40" width="8" height="50" fill="#8B4513" />
					<path d="M4 40 Q-30 20 -40 40" stroke="#228B22" stroke-width="8" fill="none" />
					<path d="M4 40 Q30 15 50 35" stroke="#228B22" stroke-width="8" fill="none" />
				</g>
			</svg>
		{:else if scenery.background.elements === 'trees'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<path
					d="M0 200 L0 150 Q100 140 200 150 Q300 130 400 145 Q500 135 600 150 Q700 140 800 150 Q900 130 1000 145 Q1100 140 1200 150 L1200 200 Z"
					fill={scenery.background.color}
				/>
				<!-- Tree silhouettes -->
				{#each [50, 150, 280, 400, 520, 650, 780, 900, 1020, 1150] as x}
					<path
						d="M{x} 150 L{x - 15} 150 L{x} 100 L{x + 15} 150 Z"
						fill="#0a1a0a"
						opacity="0.7"
					/>
				{/each}
			</svg>
		{:else if scenery.background.elements === 'icebergs'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<polygon points="100,200 50,140 100,100 150,130 200,200" fill="#e8f4f8" opacity="0.9" />
				<polygon points="350,200 300,160 380,120 420,150 480,200" fill="#d4e9f0" opacity="0.8" />
				<polygon points="700,200 650,150 720,110 780,140 850,200" fill="#e8f4f8" opacity="0.9" />
				<polygon points="1000,200 950,170 1020,130 1080,160 1150,200" fill="#d4e9f0" opacity="0.8" />
			</svg>
		{:else if scenery.background.elements === 'hills'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<path
					d="M0 200 Q150 100 300 180 Q450 80 600 170 Q750 90 900 180 Q1050 100 1200 160 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.8"
				/>
				<path
					d="M0 200 Q200 140 400 190 Q600 130 800 185 Q1000 150 1200 180 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.5"
				/>
			</svg>
		{/if}
	</div>

	<!-- Water layer -->
	<div class="water" style="--water-color: {scenery.water.color}; --wave-color: {scenery.water.waveColor}">
		<div class="water-base"></div>
		<svg class="waves" viewBox="0 0 1200 100" preserveAspectRatio="none">
			<path class="wave wave-1" d="M0 50 Q150 30 300 50 T600 50 T900 50 T1200 50 L1200 100 L0 100 Z" />
			<path class="wave wave-2" d="M0 60 Q150 40 300 60 T600 60 T900 60 T1200 60 L1200 100 L0 100 Z" />
			<path class="wave wave-3" d="M0 70 Q150 55 300 70 T600 70 T900 70 T1200 70 L1200 100 L0 100 Z" />
		</svg>
	</div>

	<!-- First-person rower view -->
	<div class="rower-container">
		<Rower {pace} />
	</div>
</div>

<style>
	.scene {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.sky {
		position: absolute;
		inset: 0;
		background: var(--sky-gradient);
		transition: background 1s ease;
	}

	.background {
		position: absolute;
		bottom: 40%;
		left: 0;
		right: 0;
		height: 30%;
	}

	.background-svg {
		width: 100%;
		height: 100%;
	}

	.water {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 45%;
	}

	.water-base {
		position: absolute;
		inset: 0;
		background: var(--water-color);
		transition: background 1s ease;
	}

	.waves {
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		height: 40px;
		animation: wave-scroll 8s linear infinite;
	}

	.wave {
		fill: var(--wave-color);
		opacity: 0.3;
		transition: fill 1s ease;
	}

	.wave-1 {
		opacity: 0.2;
		animation: wave-move 3s ease-in-out infinite;
	}

	.wave-2 {
		opacity: 0.3;
		animation: wave-move 4s ease-in-out infinite reverse;
	}

	.wave-3 {
		opacity: 0.2;
		animation: wave-move 5s ease-in-out infinite;
	}

	@keyframes wave-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@keyframes wave-move {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(5px);
		}
	}

	.rower-container {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 45%;
		z-index: 10;
	}
</style>
