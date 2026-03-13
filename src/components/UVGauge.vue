<script setup>
import { computed } from 'vue'
import { MapPin } from 'lucide-vue-next'

const props = defineProps({
  currentUVLevel: { type: Number, default: null },
  uvColor: { type: Object, required: true },
  showData: { type: Boolean, default: false },
  locationName: { type: String, default: 'Your Location' },
  isDenied: { type: Boolean, default: false },
  fallbackNotice: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
})

const emit = defineEmits(['request-location', 'change-location'])

const gaugeAngle = computed(() => {
  if (props.currentUVLevel === null) return -90
  const clamped = Math.min(Math.max(props.currentUVLevel, 0), 11)
  return -90 + (clamped / 11) * 180
})
</script>

<template>
  <div class="gauge-section" :class="{ 'is-loading': !showData }">
    <div v-if="!showData && !loading && !error" class="prelaunch-shell">
      <div class="prelaunch-card">
        <div class="hero-main">
          <p class="prelaunch-intro">
            Your pocket sun safety guide with personalised sunscreen dosage, outfit recommendations,
            and practical UV advice for Victoria.
          </p>
          <p class="prelaunch-note">
            Location access helps provide more accurate UV data for your area.
          </p>

          <p class="prelaunch-kicker">Live UV Monitoring</p>
          <h2 class="prelaunch-title">Get your location UV index</h2>
          <p class="prelaunch-subtitle">
            Instant status, next 6-hour trend, and skin-specific actions.
          </p>

          <button class="check-location-btn" @click="emit('request-location')">
            <MapPin :size="16" aria-hidden="true" />
            Check My UV Index
          </button>
        </div>

        <div class="mini-dashboard" aria-hidden="true">
          <p class="mini-title">
            <span class="mini-live-dot"></span>
            Live UV preview
          </p>
          <div class="mini-gauge-wrap">
            <svg viewBox="0 0 140 80" class="mini-gauge">
              <path
                d="M 16 66 A 54 54 0 0 1 124 66"
                fill="none"
                stroke="#d5deea"
                stroke-width="10"
              />
              <path
                d="M 16 66 A 54 54 0 0 1 124 66"
                fill="none"
                stroke="url(#miniGradient)"
                stroke-width="10"
                stroke-linecap="round"
                opacity="0.56"
              />
              <defs>
                <linearGradient id="miniGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#22c55e" />
                  <stop offset="25%" stop-color="#fff300" />
                  <stop offset="50%" stop-color="#f18b00" />
                  <stop offset="75%" stop-color="#e53210" />
                  <stop offset="100%" stop-color="#b567a4" />
                </linearGradient>
              </defs>
              <g class="mini-needle-group">
                <line x1="70" y1="66" x2="48" y2="42" stroke="#334155" stroke-width="3" />
                <circle cx="70" cy="66" r="4" fill="#334155" />
              </g>
              <text x="70" y="64" text-anchor="middle" class="mini-value">3</text>
            </svg>
          </div>
          <div class="mini-stats">
            <span><strong>Risk</strong> Moderate</span>
            <span><strong>Burn Alert</strong> ~60m</span>
          </div>
        </div>
      </div>
    </div>

    <svg
      v-if="showData"
      class="gauge-svg"
      viewBox="-5 0 310 200"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Background arc -->
      <path
        d="M 50 150 A 100 100 0 0 1 250 150"
        stroke="rgba(0,0,0,0.08)"
        stroke-width="20"
        fill="none"
        stroke-linecap="round"
      />

      <defs>
        <linearGradient id="uvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3EA72D" />
          <stop offset="25%" stop-color="#FFF300" />
          <stop offset="50%" stop-color="#F18B00" />
          <stop offset="75%" stop-color="#E53210" />
          <stop offset="100%" stop-color="#B567A4" />
        </linearGradient>
      </defs>

      <!-- Gradient arc -->
      <path
        d="M 50 150 A 100 100 0 0 1 250 150"
        stroke="url(#uvGradient)"
        stroke-width="20"
        fill="none"
        stroke-linecap="round"
        :style="{ opacity: showData ? 0.55 : 0.2, transition: 'opacity 0.3s ease' }"
      />

      <!-- Tick marks + selective labels -->
      <g
        v-for="i in 12"
        :key="`tick-${i}`"
        :style="{ opacity: showData ? 0.8 : 0.3, pointerEvents: 'none' }"
      >
        <!-- Tick line -->
        <line
          :x1="150 + 114 * Math.cos((Math.PI * (12 - i)) / 11)"
          :y1="150 - 114 * Math.sin((Math.PI * (12 - i)) / 11)"
          :x2="150 + 120 * Math.cos((Math.PI * (12 - i)) / 11)"
          :y2="150 - 120 * Math.sin((Math.PI * (12 - i)) / 11)"
          stroke="#9a9ab0"
          :stroke-width="[0, 3, 6, 8, 11].includes(i - 1) ? 2 : 1"
          stroke-linecap="round"
        />
        <!-- Label only at key thresholds -->
        <text
          v-if="[0, 3, 6, 8, 11].includes(i - 1)"
          :x="150 + 126 * Math.cos((Math.PI * (12 - i)) / 11)"
          :y="150 - 126 * Math.sin((Math.PI * (12 - i)) / 11)"
          class="gauge-marker-text"
        >
          {{ i - 1 }}
        </text>
      </g>

      <!-- Pointer needle -->
      <g
        v-if="showData"
        class="pointer-group"
        :style="{
          transform: `rotate(${gaugeAngle}deg)`,
          transformOrigin: '150px 150px',
          transition: 'transform 0.5s ease',
        }"
      >
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="52"
          stroke="#3a3a5c"
          stroke-width="3"
          stroke-linecap="round"
        />
        <circle cx="150" cy="150" r="6" fill="#3a3a5c" />
      </g>

      <!-- Center circle with UV value -->
      <g class="center-core">
        <circle
          cx="150"
          cy="150"
          r="48"
          class="center-orb"
          fill="rgba(255,255,255,0.98)"
          style="filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.08))"
        />
        <text x="150" y="156" class="gauge-center-value">{{ currentUVLevel }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.gauge-section {
  position: relative;
  z-index: 1;
  padding: 0 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 210px;
}

.prelaunch-shell {
  width: 100%;
  display: grid;
  place-items: center;
  position: relative;
  box-sizing: border-box;
}

.hero-weather-bg {
  position: absolute;
  inset: -26px -18px auto;
  height: 282px;
  pointer-events: none;
  opacity: 0.8;
  z-index: 0;
}

.bg-aura {
  position: absolute;
  inset: 8px 2% auto;
  height: 236px;
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 32%, rgba(250, 204, 21, 0.22), rgba(250, 204, 21, 0) 44%),
    radial-gradient(circle at 84% 26%, rgba(14, 165, 233, 0.18), rgba(14, 165, 233, 0) 44%),
    linear-gradient(135deg, rgba(241, 245, 249, 0.48), rgba(255, 255, 255, 0.1));
  filter: blur(0.2px);
}

.bg-sun {
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  top: 24px;
  left: max(6%, 28px);
  background: radial-gradient(circle, #fef08a 0%, #fb923c 76%, #f97316 100%);
  filter: blur(1px);
  box-shadow:
    0 0 0 18px rgba(251, 146, 60, 0.16),
    0 0 0 34px rgba(251, 146, 60, 0.08);
  animation: sunFloat calc(var(--motion-slow, 1400ms) * 5) ease-in-out infinite;
}

.bg-ray {
  position: absolute;
  transform-origin: 0 0;
  --ray-rot: 0deg;
  background: linear-gradient(90deg, rgba(251, 146, 60, 0.3), rgba(251, 146, 60, 0));
  border-radius: 999px;
}

.bg-ray.r1 {
  width: 126px;
  height: 12px;
  left: max(11%, 56px);
  top: 64px;
  --ray-rot: 8deg;
  transform: rotate(var(--ray-rot));
  animation: rayPulse calc(var(--motion-slow, 1400ms) * 3.2) ease-in-out infinite;
}

.bg-ray.r2 {
  width: 102px;
  height: 10px;
  left: max(9%, 44px);
  top: 92px;
  --ray-rot: -12deg;
  transform: rotate(var(--ray-rot));
  animation: rayPulse calc(var(--motion-slow, 1400ms) * 3.8) ease-in-out infinite reverse;
}

.bg-cloud {
  position: absolute;
  height: 42px;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.76);
  filter: blur(0.3px);
}

.bg-cloud::before,
.bg-cloud::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(226, 232, 240, 0.76);
}

.bg-cloud.b1 {
  width: 152px;
  top: 26px;
  right: 6%;
  animation: cloudSlide calc(var(--motion-slow, 1400ms) * 10) ease-in-out infinite;
}

.bg-cloud.b1::before {
  width: 46px;
  height: 46px;
  top: -20px;
  left: 30px;
}

.bg-cloud.b1::after {
  width: 58px;
  height: 58px;
  top: -28px;
  left: 74px;
}

.bg-cloud.b2 {
  width: 118px;
  top: 108px;
  left: 24%;
  opacity: 0.82;
  animation: cloudSlide calc(var(--motion-slow, 1400ms) * 12) ease-in-out infinite reverse;
}

.hero-illustration {
  position: absolute;
  right: 4%;
  bottom: -2px;
  width: clamp(170px, 30vw, 250px);
  opacity: 0.9;
  filter: drop-shadow(0 8px 14px rgba(15, 23, 42, 0.14));
  animation: cardFloat calc(var(--motion-slow, 1400ms) * 6) ease-in-out infinite;
}

.bg-cloud.b2::before {
  width: 36px;
  height: 36px;
  top: -15px;
  left: 18px;
}

.bg-cloud.b2::after {
  width: 44px;
  height: 44px;
  top: -20px;
  left: 54px;
}

@keyframes sunFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes cloudSlide {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(16px);
  }
}

@keyframes rayPulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scaleX(1) rotate(var(--ray-rot));
  }
  50% {
    opacity: 0.88;
    transform: scaleX(1.08) rotate(var(--ray-rot));
  }
}

@keyframes cardFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.prelaunch-card {
  position: relative;
  z-index: 1;
  width: min(860px, 100%);
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(5px) saturate(102%);
  -webkit-backdrop-filter: blur(5px) saturate(102%);
  box-shadow:
    0 8px 16px rgba(15, 23, 42, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.85) inset;
  padding: 18px 24px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: fadeUpCard var(--motion-medium, 420ms)
    var(--ease-emphasis, cubic-bezier(0.22, 1, 0.36, 1));
}

.hero-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
}

@keyframes fadeUpCard {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.prelaunch-kicker {
  margin: 4px 0 0;
  font-size: 0.68rem;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #4b5563;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.82);
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.prelaunch-intro {
  margin: 0;
  max-width: 640px;
  text-align: center;
  color: rgba(15, 23, 42, 0.55);
  font-size: 0.98rem;
  line-height: 1.56;
  font-weight: 400;
}

.prelaunch-note {
  margin: 2px 0 0;
  font-size: 0.72rem;
  color: #64748b;
  letter-spacing: 0.02em;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(226, 232, 240, 0.82);
  border-radius: 999px;
  padding: 4px 10px;
}

.prelaunch-title {
  margin: 0;
  font-family: 'Sora', sans-serif;
  color: #0b1327;
  font-size: clamp(1.8rem, 2.8vw, 2.5rem);
  line-height: 1.16;
  letter-spacing: -0.025em;
  font-weight: 800;
}

.prelaunch-subtitle {
  margin: 0;
  color: #334155;
  font-size: 0.96rem;
  text-align: center;
  line-height: 1.55;
}

.gauge-svg {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: min(90vw, 420px);
  height: auto;
  color: inherit;
  filter: drop-shadow(0 10px 28px rgba(15, 23, 42, 0.2));
  margin-top: -6px;
  margin-bottom: 8px;
}

@media (min-width: 768px) {
  .gauge-svg {
    max-width: min(86vw, 470px);
  }
}

.center-core {
  transform-origin: 150px 150px;
}

.gauge-marker-text {
  font-size: 9px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #6a6a8a;
  letter-spacing: 0.2px;
}

.gauge-center-value {
  font-size: 46px;
  font-weight: 800;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #0f172a;
}

@media (min-width: 980px) {
  .gauge-center-value {
    font-size: 39px;
  }
}

.gauge-center-label {
  font-size: 32px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #999;
}

.center-orb {
  animation: orbBreath calc(var(--motion-slow, 1400ms) * 2.6) ease-in-out infinite;
}

@keyframes orbBreath {
  0%,
  100% {
    opacity: 0.96;
  }
  50% {
    opacity: 0.86;
  }
}

.pointer-group {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.mini-dashboard {
  width: min(440px, 92vw);
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px) saturate(102%);
  -webkit-backdrop-filter: blur(4px) saturate(102%);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.09);
}

.mini-title {
  margin: 0;
  font-size: 0.78rem;
  color: #0f172a;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mini-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.46);
  animation: pulseLive var(--motion-slow, 1400ms) ease-out infinite;
}

@keyframes pulseLive {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
  }
  100% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

.mini-gauge-wrap {
  width: 100%;
  display: grid;
  place-items: center;
}

.mini-gauge {
  width: 140px;
  height: 80px;
}

.mini-needle-group {
  transform-origin: 70px 66px;
  animation: sweepNeedle calc(var(--motion-slow, 1400ms) * 2) ease-in-out infinite;
}

@keyframes sweepNeedle {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(4deg);
  }
}

.mini-value {
  font-size: 18px;
  font-weight: 700;
  fill: #0f172a;
}

.mini-stats {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px dashed #d7dee9;
  padding-top: 6px;
}

.mini-stats span {
  font-size: 0.76rem;
  color: #334155;
  font-weight: 600;
}

.mini-stats strong {
  color: #1f2937;
  font-weight: 800;
  margin-right: 3px;
}

.state-illustration {
  width: min(340px, 88vw);
  height: auto;
  border-radius: 12px;
  border: 1px solid #d7dce6;
  animation: floatPreview 6s ease-in-out infinite;
}

@keyframes floatPreview {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.check-location-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-align: center;
  font-size: 0.98rem;
  font-weight: 800;
  color: #1a1a2e;
  padding: 12px 28px;
  cursor: pointer;
  transition: all var(--motion-fast, 180ms) var(--ease-emphasis, cubic-bezier(0.22, 1, 0.36, 1));
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    0 10px 22px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.32);
  font-family: inherit;
}

.check-location-btn:hover {
  background: rgba(255, 255, 255, 0.96);
  transform: translateY(-2px) scale(1.01);
  box-shadow:
    0 14px 26px rgba(15, 23, 42, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.check-location-btn:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .hero-weather-bg {
    opacity: 0.66;
  }

  .hero-illustration {
    width: clamp(130px, 44vw, 176px);
    right: 2%;
    bottom: 10px;
  }

  .bg-aura {
    inset: 14px 0 auto;
    height: 216px;
  }

  .bg-sun {
    width: 92px;
    height: 92px;
    top: 28px;
    left: 14px;
  }

  .prelaunch-intro {
    font-size: 0.89rem;
    line-height: 1.45;
  }

  .prelaunch-note {
    font-size: 0.72rem;
  }

  .prelaunch-title {
    font-size: 1.32rem;
  }

  .prelaunch-subtitle {
    font-size: 0.9rem;
  }

  .gauge-svg {
    max-width: 234px;
  }

  .gauge-center-value {
    font-size: 36px;
  }

  .center-core {
    transform: scale(0.92);
  }

  .prelaunch-card {
    padding: 14px 12px 12px;
  }
}

@media (max-width: 560px) {
  .prelaunch-card {
    width: min(100%, 94vw);
    padding: 14px 12px 12px;
    gap: 8px;
  }

  .hero-main {
    gap: 7px;
  }

  .prelaunch-intro {
    max-width: 42ch;
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .prelaunch-title {
    font-size: 1.26rem;
    line-height: 1.2;
    text-align: center;
  }

  .prelaunch-subtitle {
    max-width: 34ch;
    font-size: 0.86rem;
    line-height: 1.44;
    text-align: center;
  }

  .check-location-btn {
    padding: 11px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 430px) {
  .gauge-section {
    padding: 0 10px 12px;
  }

  .prelaunch-card {
    width: min(100%, 96vw);
    padding: 12px 10px 10px;
    gap: 8px;
    border-radius: 16px;
  }

  .hero-main {
    gap: 7px;
  }

  .prelaunch-intro {
    font-size: 0.85rem;
    line-height: 1.42;
  }

  .prelaunch-note {
    font-size: 0.68rem;
    padding: 3px 8px;
  }

  .prelaunch-title {
    font-size: 1.16rem;
    line-height: 1.2;
  }

  .prelaunch-subtitle {
    font-size: 0.82rem;
    line-height: 1.42;
  }

  .check-location-btn {
    width: 100%;
    justify-content: center;
    padding: 11px 12px;
    font-size: 0.88rem;
  }

  .mini-dashboard {
    width: 100%;
    padding: 8px 9px;
  }

  .mini-gauge {
    width: 126px;
    height: 72px;
  }
}

@media (min-width: 980px) {
  .prelaunch-card {
    min-height: 520px;
    display: grid;
    grid-template-rows: 1.62fr 1fr;
    align-items: center;
    align-content: stretch;
    gap: 12px;
    padding: 20px 26px 18px;
  }

  .hero-main {
    justify-content: center;
    align-items: flex-start;
    text-align: left;
    padding-left: 6px;
  }

  .prelaunch-intro,
  .prelaunch-subtitle {
    text-align: left;
  }

  .mini-dashboard {
    align-self: start;
    justify-self: stretch;
    width: 100%;
  }
}

@media (max-width: 360px) {
  .gauge-section {
    padding: 0 8px 12px;
  }

  .gauge-svg {
    max-width: 226px;
    margin-top: -10px;
    margin-bottom: 10px;
  }

  .gauge-center-value {
    font-size: 33px;
  }

  .center-core {
    transform: scale(0.84);
  }

  .mini-dashboard {
    width: min(318px, 94vw);
    padding: 8px;
  }

  .check-location-btn {
    width: 100%;
    justify-content: center;
    padding: 11px 14px;
    font-size: 0.9rem;
  }

  .mini-title {
    font-size: 0.74rem;
  }

  .mini-stats span {
    font-size: 0.72rem;
  }
}

@media (max-width: 344px) {
  .gauge-section {
    padding: 0 6px 10px;
  }

  .prelaunch-card {
    width: 100%;
    border-radius: 14px;
    padding: 10px 8px 9px;
    gap: 7px;
  }

  .prelaunch-intro {
    font-size: 0.8rem;
    line-height: 1.38;
  }

  .prelaunch-note {
    font-size: 0.64rem;
    padding: 3px 6px;
    text-align: center;
  }

  .prelaunch-title {
    font-size: 1.06rem;
    line-height: 1.18;
  }

  .prelaunch-subtitle {
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .mini-dashboard {
    width: 100%;
    padding: 7px;
  }
}

@media (max-width: 375px) {
  .prelaunch-title {
    font-size: 1.2rem;
  }

  .prelaunch-subtitle {
    font-size: 0.83rem;
  }

  .mini-dashboard {
    width: min(306px, 95vw);
  }
}
</style>
