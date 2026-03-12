<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentUVLevel: { type: Number, default: null },
  uvColor: { type: Object, required: true },
  showData: { type: Boolean, default: false },
  locationName: { type: String, default: 'Your Location' },
  isDenied: { type: Boolean, default: false },
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
    <!-- Location Display & CTA -->
    <div class="location-display-area">
      <button
        v-if="!showData && !loading && !error"
        class="check-location-btn"
        @click="emit('request-location')"
      >
        📍 Check My UV Index
      </button>
      <div v-if="showData" class="location-info-inline">
        <p class="location-label-inline">📍 {{ isDenied ? 'Melbourne CBD' : locationName }}</p>
        <button class="btn-change-location-inline" @click="emit('change-location')">Change</button>
      </div>
    </div>

    <svg class="gauge-svg" viewBox="-5 0 310 200" preserveAspectRatio="xMidYMid meet">
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
          :x1="150 + 123 * Math.cos((Math.PI * (12 - i)) / 11)"
          :y1="150 - 123 * Math.sin((Math.PI * (12 - i)) / 11)"
          :x2="150 + 130 * Math.cos((Math.PI * (12 - i)) / 11)"
          :y2="150 - 130 * Math.sin((Math.PI * (12 - i)) / 11)"
          stroke="#9a9ab0"
          :stroke-width="[0, 3, 6, 8, 11].includes(i - 1) ? 2 : 1"
          stroke-linecap="round"
        />
        <!-- Label only at key thresholds -->
        <text
          v-if="[0, 3, 6, 8, 11].includes(i - 1)"
          :x="150 + 140 * Math.cos((Math.PI * (12 - i)) / 11)"
          :y="150 - 140 * Math.sin((Math.PI * (12 - i)) / 11)"
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
      <circle
        cx="150"
        cy="150"
        r="48"
        fill="rgba(255,255,255,0.98)"
        style="filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.08))"
      />
      <text v-if="showData" x="150" y="156" class="gauge-center-value">{{ currentUVLevel }}</text>
      <text v-else x="150" y="150" class="gauge-center-label">--</text>
    </svg>

    <!-- UV Level Label -->
    <p v-if="showData" class="uv-level-label">{{ uvColor.label }}</p>
  </div>
</template>

<style scoped>
.gauge-section {
  position: relative;
  z-index: 1;
  padding: 4px 20px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 240px;
}

.gauge-svg {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 85vw;
  height: auto;
  color: inherit;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12));
}

@media (min-width: 768px) {
  .gauge-svg {
    max-width: min(85vw, 380px);
  }
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
  font-size: 48px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #2e2e4a;
}

.gauge-center-label {
  font-size: 32px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #999;
}

.pointer-group {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.uv-level-label {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
  color: #5e5e7e;
  text-transform: uppercase;
  margin: 0;
  position: relative;
  z-index: 1;
}

.location-display-area {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.check-location-btn {
  display: inline-block;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c7a1e;
  padding: 12px 28px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-family: inherit;
}

.check-location-btn:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.check-location-btn:active {
  transform: translateY(0);
}

.location-info-inline {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.location-label-inline {
  font-size: 0.9rem;
  color: #4a4a6a;
  margin: 0;
  font-weight: 500;
}

.btn-change-location-inline {
  padding: 8px 18px;
  font-size: 0.85rem;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #2c7a1e;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-change-location-inline:hover {
  background: rgba(62, 167, 45, 0.15);
  border-color: rgba(62, 167, 45, 0.4);
  box-shadow: 0 2px 8px rgba(62, 167, 45, 0.15);
}

@media (max-width: 480px) {
  .gauge-svg {
    max-width: 250px;
  }
}

@media (max-width: 360px) {
  .gauge-svg {
    max-width: 220px;
  }
}
</style>
