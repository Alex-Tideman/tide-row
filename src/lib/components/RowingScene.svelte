<script lang="ts">
	import Rower from './Rower.svelte';
	import { sceneries, type Scenery } from '$lib/scenery';

	interface Props {
		pace: number;
		sceneryId: string;
		isPaused?: boolean;
		journeyProgress?: number;
		journeyDistance?: number;
	}

	let { pace, sceneryId, isPaused = false, journeyProgress = 0, journeyDistance = 10000 }: Props = $props();

	let scenery: Scenery = $derived(sceneries[sceneryId] || sceneries['mountain-lake']);

	// Calculate progress percentage (0 to 1)
	let progressPercent = $derived(Math.min(journeyProgress / journeyDistance, 1));

	// Background transforms based on progress
	// Start at scale 1, end at scale 2.5 (much closer)
	// Start at translateY 0, end at translateY 30% (lower on screen, like arriving at shore)
	let bgScale = $derived(1 + (progressPercent * 1.5));
	let bgTranslateY = $derived(progressPercent * 30);

	// Stroke duration for ripple timing
	let strokeDuration = $derived(60 / pace);
</script>

<div class="scene" style="--sky-gradient: {scenery.sky.gradient}">
	<!-- Sky layer -->
	<div class="sky"></div>

	<!-- Background elements layer -->
	<div class="background {isPaused ? 'paused' : ''}" style="transform: scale({bgScale}) translateY({bgTranslateY}%); transform-origin: center bottom;">
		{#if scenery.background.elements === 'mountains'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<!-- Back mountains -->
				<path
					d="M0 200 L0 140 L100 80 L200 130 L300 60 L400 120 L500 40 L600 110 L700 50 L800 100 L900 70 L1000 120 L1100 90 L1200 140 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.9"
				/>
				<!-- Snow caps -->
				<path d="M300 60 L280 85 L320 85 Z" fill="#fff" opacity="0.8" />
				<path d="M500 40 L475 70 L525 70 Z" fill="#fff" opacity="0.8" />
				<path d="M700 50 L680 75 L720 75 Z" fill="#fff" opacity="0.8" />
				<!-- Front hills -->
				<path
					d="M0 200 L0 160 L150 120 L300 150 L450 100 L600 140 L750 110 L900 150 L1050 130 L1200 160 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.6"
				/>
				<!-- Pine trees -->
				{#each [80, 180, 350, 480, 620, 750, 880, 1000, 1120] as x, i}
					<g transform="translate({x}, {130 + (i % 3) * 10})">
						<rect x="-2" y="0" width="4" height="20" fill="#2d1810" />
						<path d="M0 0 L-12 20 L12 20 Z" fill="#1a472a" />
						<path d="M0 -10 L-10 10 L10 10 Z" fill="#1a472a" />
						<path d="M0 -18 L-7 0 L7 0 Z" fill="#1a472a" />
					</g>
				{/each}
				<!-- Cabin -->
				<g transform="translate(550, 145)">
					<rect x="0" y="10" width="30" height="25" fill="#8B4513" />
					<path d="M-5 10 L15 -5 L35 10 Z" fill="#5c3317" />
					<rect x="5" y="20" width="8" height="15" fill="#3d2314" />
					<rect x="18" y="15" width="7" height="7" fill="#87CEEB" opacity="0.6" />
				</g>
				<!-- Birds -->
				<path d="M200 30 Q205 25 210 30 Q215 25 220 30" stroke="#333" stroke-width="2" fill="none" />
				<path d="M850 45 Q855 40 860 45 Q865 40 870 45" stroke="#333" stroke-width="2" fill="none" />
			</svg>
		{:else if scenery.background.elements === 'palms'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<!-- Islands -->
				<ellipse cx="200" cy="200" rx="250" ry="60" fill={scenery.background.color} />
				<ellipse cx="1000" cy="200" rx="300" ry="70" fill={scenery.background.color} />
				<!-- Beach sand -->
				<ellipse cx="200" cy="200" rx="230" ry="45" fill="#f4d03f" opacity="0.4" />
				<ellipse cx="1000" cy="200" rx="280" ry="55" fill="#f4d03f" opacity="0.4" />
				<!-- Palm trees left island -->
				<g transform="translate(100, 80)">
					<rect x="0" y="40" width="8" height="60" fill="#8B4513" />
					<path d="M4 40 Q-30 20 -40 40" stroke="#228B22" stroke-width="8" fill="none" />
					<path d="M4 40 Q30 15 50 35" stroke="#228B22" stroke-width="8" fill="none" />
					<path d="M4 40 Q-10 10 -20 30" stroke="#2E8B2E" stroke-width="6" fill="none" />
					<path d="M4 40 Q20 5 35 25" stroke="#2E8B2E" stroke-width="6" fill="none" />
				</g>
				<g transform="translate(200, 90)">
					<rect x="0" y="40" width="6" height="50" fill="#8B4513" />
					<path d="M3 40 Q-25 20 -35 38" stroke="#228B22" stroke-width="7" fill="none" />
					<path d="M3 40 Q25 18 40 35" stroke="#228B22" stroke-width="7" fill="none" />
				</g>
				<!-- Beach hut -->
				<g transform="translate(280, 130)">
					<rect x="0" y="15" width="25" height="20" fill="#d2691e" />
					<path d="M-5 15 L12 0 L30 15 Z" fill="#8B4513" />
					<rect x="8" y="22" width="10" height="13" fill="#5c3317" />
				</g>
				<!-- Palm trees right island -->
				<g transform="translate(950, 85)">
					<rect x="0" y="40" width="8" height="55" fill="#8B4513" />
					<path d="M4 40 Q-30 20 -40 40" stroke="#228B22" stroke-width="8" fill="none" />
					<path d="M4 40 Q30 15 50 35" stroke="#228B22" stroke-width="8" fill="none" />
					<path d="M4 40 Q0 5 5 25" stroke="#2E8B2E" stroke-width="6" fill="none" />
				</g>
				<g transform="translate(1080, 95)">
					<rect x="0" y="40" width="7" height="45" fill="#8B4513" />
					<path d="M3 40 Q-28 22 -38 40" stroke="#228B22" stroke-width="7" fill="none" />
					<path d="M3 40 Q28 18 42 36" stroke="#228B22" stroke-width="7" fill="none" />
				</g>
				<!-- Whale -->
				<g transform="translate(600, 160)" class="whale">
					<ellipse cx="0" cy="0" rx="40" ry="15" fill="#2c3e50" />
					<path d="M35 0 Q50 -15 55 0 Q50 15 35 0" fill="#2c3e50" />
					<ellipse cx="-25" cy="-5" rx="3" ry="2" fill="#1a252f" />
					<path d="M-10 -12 Q0 -25 10 -12" stroke="#5da9e9" stroke-width="3" fill="none" opacity="0.7" />
				</g>
				<!-- Flying birds -->
				<path d="M400 40 Q405 35 410 40 Q415 35 420 40" stroke="#333" stroke-width="2" fill="none" />
				<path d="M430 50 Q435 45 440 50 Q445 45 450 50" stroke="#333" stroke-width="2" fill="none" />
				<!-- Dolphin -->
				<g transform="translate(750, 175)">
					<path d="M0 0 Q15 -20 30 -10 Q35 -5 30 0 Q15 5 0 0" fill="#4a6fa5" />
					<path d="M28 -8 Q35 -15 32 -8" fill="#4a6fa5" />
				</g>
			</svg>
		{:else if scenery.background.elements === 'trees'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<!-- Rolling hills -->
				<path
					d="M0 200 L0 150 Q100 140 200 150 Q300 130 400 145 Q500 135 600 150 Q700 140 800 150 Q900 130 1000 145 Q1100 140 1200 150 L1200 200 Z"
					fill={scenery.background.color}
				/>
				<!-- Hedgerows -->
				<path d="M0 165 Q150 160 300 165 Q450 158 600 165" stroke="#2d5016" stroke-width="4" fill="none" />
				<path d="M600 162 Q800 155 1000 162 Q1100 158 1200 165" stroke="#2d5016" stroke-width="4" fill="none" />
				<!-- Church with steeple -->
				<g transform="translate(300, 100)">
					<rect x="0" y="30" width="40" height="35" fill="#d4c4a8" />
					<rect x="12" y="0" width="16" height="30" fill="#d4c4a8" />
					<path d="M12 0 L20 -15 L28 0" fill="#5c5c5c" />
					<circle cx="20" cy="-18" r="3" fill="#ffd700" />
					<rect x="5" y="45" width="12" height="20" fill="#5c3317" />
					<rect x="25" y="38" width="8" height="10" fill="#87CEEB" opacity="0.6" />
				</g>
				<!-- Stone bridge -->
				<g transform="translate(700, 150)">
					<path d="M0 20 Q40 0 80 20" fill="#8b8b8b" />
					<rect x="5" y="20" width="70" height="8" fill="#7a7a7a" />
					<ellipse cx="40" cy="28" rx="25" ry="12" fill="#1a4a6e" opacity="0.5" />
				</g>
				<!-- Deciduous trees -->
				{#each [50, 180, 450, 550, 850, 950, 1100] as x, i}
					<g transform="translate({x}, {125 + (i % 2) * 15})">
						<rect x="-3" y="10" width="6" height="25" fill="#4a3728" />
						<ellipse cx="0" cy="0" rx="20" ry="18" fill="#2d5016" />
						<ellipse cx="-8" cy="5" rx="12" ry="10" fill="#3d6b1e" />
						<ellipse cx="10" cy="3" rx="14" ry="12" fill="#3d6b1e" />
					</g>
				{/each}
				<!-- Sheep -->
				<g transform="translate(500, 160)">
					<ellipse cx="0" cy="0" rx="8" ry="6" fill="#f5f5f5" />
					<circle cx="-6" cy="-2" r="4" fill="#f5f5f5" />
					<circle cx="-8" cy="-1" r="2" fill="#2c2c2c" />
				</g>
				<g transform="translate(530, 165)">
					<ellipse cx="0" cy="0" rx="7" ry="5" fill="#f5f5f5" />
					<circle cx="-5" cy="-2" r="3" fill="#f5f5f5" />
				</g>
				<!-- Cottage -->
				<g transform="translate(1000, 120)">
					<rect x="0" y="20" width="35" height="28" fill="#f5deb3" />
					<path d="M-5 20 L17 0 L40 20" fill="#8b4513" />
					<rect x="5" y="32" width="10" height="16" fill="#5c3317" />
					<rect x="22" y="28" width="8" height="8" fill="#87CEEB" opacity="0.6" />
					<rect x="38" y="5" width="4" height="15" fill="#8b4513" />
				</g>
			</svg>
		{:else if scenery.background.elements === 'icebergs'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<!-- Aurora borealis -->
				<path d="M100 20 Q300 0 500 30 Q700 10 900 25 Q1100 5 1200 20" stroke="#7fff7f" stroke-width="8" fill="none" opacity="0.3" />
				<path d="M0 35 Q200 15 400 40 Q600 20 800 35 Q1000 15 1200 30" stroke="#7fffcf" stroke-width="6" fill="none" opacity="0.25" />
				<!-- Icebergs -->
				<polygon points="100,200 50,140 100,100 150,130 200,200" fill="#e8f4f8" opacity="0.9" />
				<polygon points="70,200 90,170 110,175 130,200" fill="#d4e9f0" opacity="0.7" />
				<polygon points="350,200 300,160 380,120 420,150 480,200" fill="#d4e9f0" opacity="0.8" />
				<polygon points="400,200 420,165 450,170 470,200" fill="#c4dce6" opacity="0.7" />
				<polygon points="700,200 650,150 720,110 780,140 850,200" fill="#e8f4f8" opacity="0.9" />
				<polygon points="1000,200 950,170 1020,130 1080,160 1150,200" fill="#d4e9f0" opacity="0.8" />
				<!-- Polar bear -->
				<g transform="translate(130, 155)">
					<ellipse cx="0" cy="0" rx="15" ry="10" fill="#f5f5f5" />
					<ellipse cx="-12" cy="-5" rx="7" ry="6" fill="#f5f5f5" />
					<circle cx="-16" cy="-7" r="2" fill="#2c2c2c" />
					<ellipse cx="-8" cy="8" rx="4" ry="5" fill="#f5f5f5" />
					<ellipse cx="8" cy="8" rx="4" ry="5" fill="#f5f5f5" />
				</g>
				<!-- Seals -->
				<g transform="translate(720, 165)">
					<ellipse cx="0" cy="0" rx="12" ry="6" fill="#5c6b7a" />
					<ellipse cx="-10" cy="-3" rx="5" ry="4" fill="#5c6b7a" />
					<circle cx="-13" cy="-4" r="1.5" fill="#1a1a1a" />
					<path d="M10 -2 Q15 -8 12 -2" fill="#5c6b7a" />
				</g>
				<g transform="translate(760, 170)">
					<ellipse cx="0" cy="0" rx="10" ry="5" fill="#6b7a8a" />
					<ellipse cx="-8" cy="-2" rx="4" ry="3" fill="#6b7a8a" />
				</g>
				<!-- Snow/ice shelf -->
				<path d="M0 200 L0 185 Q200 180 400 188 Q600 182 800 187 Q1000 180 1200 185 L1200 200 Z" fill="#e8f4f8" opacity="0.4" />
				<!-- Flying birds -->
				<path d="M550 60 Q555 55 560 60 Q565 55 570 60" stroke="#333" stroke-width="2" fill="none" />
				<path d="M580 70 Q585 65 590 70 Q595 65 600 70" stroke="#333" stroke-width="2" fill="none" />
			</svg>
		{:else if scenery.background.elements === 'hills'}
			<svg viewBox="0 0 1200 200" preserveAspectRatio="none" class="background-svg">
				<!-- Back hills -->
				<path
					d="M0 200 Q150 100 300 180 Q450 80 600 170 Q750 90 900 180 Q1050 100 1200 160 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.8"
				/>
				<!-- Front hills -->
				<path
					d="M0 200 Q200 140 400 190 Q600 130 800 185 Q1000 150 1200 180 L1200 200 Z"
					fill={scenery.background.color}
					opacity="0.5"
				/>
				<!-- Windmill -->
				<g transform="translate(200, 100)">
					<rect x="-8" y="0" width="16" height="50" fill="#d4c4a8" />
					<circle cx="0" cy="5" r="8" fill="#8b7355" />
					<g class="windmill-blades">
						<rect x="-3" y="-35" width="6" height="40" fill="#5c4033" rx="2" />
						<rect x="-20" y="-3" width="40" height="6" fill="#5c4033" rx="2" />
					</g>
					<circle cx="0" cy="5" r="3" fill="#3d2817" />
				</g>
				<!-- Farm house -->
				<g transform="translate(800, 120)">
					<rect x="0" y="20" width="45" height="35" fill="#c9a959" />
					<path d="M-5 20 L22 -5 L50 20" fill="#8b4513" />
					<rect x="8" y="35" width="12" height="20" fill="#5c3317" />
					<rect x="28" y="28" width="10" height="10" fill="#87CEEB" opacity="0.6" />
					<rect x="48" y="25" width="5" height="12" fill="#5c3317" />
					<ellipse cx="50" cy="23" rx="4" ry="3" fill="#8b8b8b" />
				</g>
				<!-- Sheep scattered on hills -->
				{#each [[100, 165], [150, 155], [450, 145], [500, 160], [650, 150], [900, 158], [1050, 150]] as [x, y]}
					<g transform="translate({x}, {y})">
						<ellipse cx="0" cy="0" rx="6" ry="4" fill="#f5f5f5" />
						<circle cx="-4" cy="-1" r="3" fill="#f5f5f5" />
					</g>
				{/each}
				<!-- Stone walls -->
				<path d="M50 175 L250 168" stroke="#7a7a7a" stroke-width="3" stroke-dasharray="8,4" />
				<path d="M550 165 L750 172" stroke="#7a7a7a" stroke-width="3" stroke-dasharray="8,4" />
				<!-- Hay bales -->
				<ellipse cx="350" cy="170" rx="12" ry="8" fill="#d4a855" />
				<ellipse cx="380" cy="172" rx="10" ry="7" fill="#c9a040" />
				<ellipse cx="1100" cy="165" rx="11" ry="7" fill="#d4a855" />
			</svg>
		{/if}
	</div>

	<!-- Water layer -->
	<div class="water {isPaused ? 'paused' : ''}" style="--water-color: {scenery.water.color}; --wave-color: {scenery.water.waveColor}; --stroke-duration: {strokeDuration}s">
		<div class="water-base"></div>
		<svg class="waves" viewBox="0 0 1200 100" preserveAspectRatio="none">
			<path class="wave wave-1" d="M0 50 Q150 30 300 50 T600 50 T900 50 T1200 50 L1200 100 L0 100 Z" />
			<path class="wave wave-2" d="M0 60 Q150 40 300 60 T600 60 T900 60 T1200 60 L1200 100 L0 100 Z" />
			<path class="wave wave-3" d="M0 70 Q150 55 300 70 T600 70 T900 70 T1200 70 L1200 100 L0 100 Z" />
		</svg>

		<!-- Oar ripples -->
		<div class="ripple-container ripple-left">
			<div class="ripple ripple-1"></div>
			<div class="ripple ripple-2"></div>
			<div class="ripple ripple-3"></div>
		</div>
		<div class="ripple-container ripple-right">
			<div class="ripple ripple-1"></div>
			<div class="ripple ripple-2"></div>
			<div class="ripple ripple-3"></div>
		</div>
	</div>

	<!-- First-person rower view -->
	<div class="rower-container">
		<Rower {pace} {isPaused} />
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
		transition: transform 1s ease-out;
	}

	.background-svg {
		width: 100%;
		height: 100%;
	}

	.windmill-blades {
		transform-origin: 0 5px;
		animation: spin-windmill 8s linear infinite;
	}

	@keyframes spin-windmill {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.background.paused .windmill-blades {
		animation-play-state: paused;
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

	.water.paused .waves,
	.water.paused .wave-1,
	.water.paused .wave-2,
	.water.paused .wave-3 {
		animation-play-state: paused;
	}

	/* Oar ripples */
	.ripple-container {
		position: absolute;
		bottom: 8%;
		width: 150px;
		height: 80px;
		pointer-events: none;
	}

	.ripple-left {
		left: 18%;
	}

	.ripple-right {
		right: 18%;
	}

	.ripple {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 10px;
		height: 5px;
		border: 3px solid rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		opacity: 0;
		transform: translate(-50%, -50%);
		animation: ripple-expand var(--stroke-duration, 2.5s) ease-out infinite;
	}

	.ripple-2 {
		animation-delay: calc(var(--stroke-duration, 2.5s) * 0.1);
	}

	.ripple-3 {
		animation-delay: calc(var(--stroke-duration, 2.5s) * 0.2);
	}

	@keyframes ripple-expand {
		0% {
			width: 10px;
			height: 5px;
			opacity: 0;
		}
		3% {
			opacity: 0.7;
		}
		25% {
			width: 80px;
			height: 35px;
			opacity: 0.5;
		}
		50% {
			width: 140px;
			height: 55px;
			opacity: 0.2;
		}
		100% {
			width: 180px;
			height: 70px;
			opacity: 0;
		}
	}

	.water.paused .ripple {
		animation-play-state: paused;
	}
</style>
