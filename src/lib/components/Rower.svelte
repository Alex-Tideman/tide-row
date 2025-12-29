<script lang="ts">
	interface Props {
		pace: number;
	}

	let { pace }: Props = $props();

	// Animation duration based on pace (strokes per minute)
	// e.g., 24 SPM = 60/24 = 2.5 seconds per stroke
	let strokeDuration = $derived(60 / pace);
</script>

<div class="first-person-view" style="--stroke-duration: {strokeDuration}s">
	<!-- Boat bow (front of boat, viewed from rower's seat) -->
	<svg viewBox="0 0 400 280" class="boat-view" preserveAspectRatio="xMidYMax meet">
		<!-- Boat hull - perspective view looking forward, elongated -->
		<path
			d="M 70 280
			   L 95 220
			   L 130 150
			   L 170 90
			   L 200 50
			   L 230 90
			   L 270 150
			   L 305 220
			   L 330 280
			   Z"
			fill="#8B4513"
			class="hull"
		/>
		<!-- Boat interior -->
		<path
			d="M 95 280
			   L 115 225
			   L 145 160
			   L 180 100
			   L 200 70
			   L 220 100
			   L 255 160
			   L 285 225
			   L 305 280
			   Z"
			fill="#A0522D"
		/>
		<!-- Center ridge -->
		<line x1="200" y1="70" x2="200" y2="280" stroke="#654321" stroke-width="3" />
		<!-- Cross beams -->
		<path d="M 140 200 Q 200 190 260 200" stroke="#654321" stroke-width="4" fill="none" />
		<path d="M 165 150 Q 200 142 235 150" stroke="#654321" stroke-width="3" fill="none" />

		<!-- Bow point decoration -->
		<circle cx="200" cy="55" r="5" fill="#654321" />
	</svg>

	<!-- Hands and oars combined - they move together -->
	<svg viewBox="0 0 500 150" class="hands-and-oars" preserveAspectRatio="xMidYMax meet">
		<!-- Left oar and hand group -->
		<g class="oar-hand-left">
			<!-- Left oar shaft extending out -->
			<rect x="0" y="95" width="140" height="8" fill="#8B6914" rx="2" />
			<!-- Left oar blade -->
			<ellipse cx="10" cy="99" rx="12" ry="25" fill="#654321" />
			<!-- Left oar handle -->
			<rect x="135" y="92" width="40" height="14" rx="4" fill="#654321" />
			<!-- Left hand gripping handle -->
			<ellipse cx="165" cy="99" rx="20" ry="14" fill="#e0b89a" />
			<ellipse cx="150" cy="92" rx="5" ry="10" fill="#e0b89a" />
			<ellipse cx="158" cy="88" rx="5" ry="12" fill="#e0b89a" />
			<ellipse cx="168" cy="87" rx="5" ry="12" fill="#e0b89a" />
			<ellipse cx="178" cy="89" rx="5" ry="11" fill="#e0b89a" />
		</g>

		<!-- Right oar and hand group -->
		<g class="oar-hand-right">
			<!-- Right oar shaft extending out -->
			<rect x="360" y="95" width="140" height="8" fill="#8B6914" rx="2" />
			<!-- Right oar blade -->
			<ellipse cx="490" cy="99" rx="12" ry="25" fill="#654321" />
			<!-- Right oar handle -->
			<rect x="325" y="92" width="40" height="14" rx="4" fill="#654321" />
			<!-- Right hand gripping handle -->
			<ellipse cx="335" cy="99" rx="20" ry="14" fill="#e0b89a" />
			<ellipse cx="350" cy="92" rx="5" ry="10" fill="#e0b89a" />
			<ellipse cx="342" cy="88" rx="5" ry="12" fill="#e0b89a" />
			<ellipse cx="332" cy="87" rx="5" ry="12" fill="#e0b89a" />
			<ellipse cx="322" cy="89" rx="5" ry="11" fill="#e0b89a" />
		</g>
	</svg>
</div>

<style>
	.first-person-view {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.boat-view {
		position: absolute;
		bottom: -5%;
		width: 90%;
		max-width: 600px;
		height: auto;
		z-index: 10;
		animation: boat-bob var(--stroke-duration, 2.5s) ease-in-out infinite;
	}

	.hands-and-oars {
		position: absolute;
		bottom: 0;
		width: 120%;
		max-width: 800px;
		height: auto;
		z-index: 15;
	}

	.oar-hand-left {
		animation: oar-row-left var(--stroke-duration, 2.5s) ease-in-out infinite;
		transform-origin: 175px 99px;
	}

	.oar-hand-right {
		animation: oar-row-right var(--stroke-duration, 2.5s) ease-in-out infinite;
		transform-origin: 325px 99px;
	}

	@keyframes boat-bob {
		0%, 100% {
			transform: translateY(0) rotate(-0.3deg);
		}
		25% {
			transform: translateY(-2px) rotate(0deg);
		}
		50% {
			transform: translateY(0) rotate(0.3deg);
		}
		75% {
			transform: translateY(2px) rotate(0deg);
		}
	}

	@keyframes oar-row-left {
		0% {
			transform: rotate(-10deg) translateX(30px);
		}
		50% {
			transform: rotate(10deg) translateX(-30px);
		}
		100% {
			transform: rotate(-10deg) translateX(30px);
		}
	}

	@keyframes oar-row-right {
		0% {
			transform: rotate(10deg) translateX(-30px);
		}
		50% {
			transform: rotate(-10deg) translateX(30px);
		}
		100% {
			transform: rotate(10deg) translateX(-30px);
		}
	}
</style>
