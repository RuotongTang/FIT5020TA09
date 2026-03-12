<!--
  UVTracker.vue: Root orchestrator for the UV Index tracker.
  Manages state, API calls, and composes child components.
-->

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { uvLevels, victoriaLocations, skinTypes } from '../data/uvConstants.js'
import UVGauge from './UVGauge.vue'
import StatusCard from './StatusCard.vue'
import TipsCard from './TipsCard.vue'
import SkinSelector from './SkinSelector.vue'
import SkinAdviceCard from './SkinAdviceCard.vue'
import LocationModal from './LocationModal.vue'

// ==== REACTIVE STATE ====
const uvIndex = ref(null)
const loading = ref(false)
const error = ref(false)
const showData = ref(false)
const locationName = ref('Your Location')
const currentLat = ref(null)
const currentLon = ref(null)
const isDenied = ref(false)
const showLocationSearch = ref(false)
const selectedSkinType = ref(null)
const lastUpdated = ref(null)

// ==== COMPUTED PROPERTIES ====

const currentUVLevel = computed(() => {
  if (uvIndex.value === null) return null
  return Math.round(uvIndex.value)
})

const uvColor = computed(() => {
  if (currentUVLevel.value === null) return uvLevels[0]
  const clamped = Math.min(Math.max(currentUVLevel.value, 0), 11)
  return uvLevels[clamped]
})

const uvSeverity = computed(() => {
  if (currentUVLevel.value === null) return 'low'
  const level = currentUVLevel.value
  if (level <= 2) return 'low'
  if (level <= 5) return 'moderate'
  if (level <= 7) return 'high'
  if (level <= 10) return 'veryhigh'
  return 'extreme'
})

const uvColorRgb = computed(() => {
  if (currentUVLevel.value === null) return '108, 99, 255'
  const c = uvColor.value.bg
  return `${parseInt(c.slice(1, 3), 16)}, ${parseInt(c.slice(3, 5), 16)}, ${parseInt(c.slice(5, 7), 16)}`
})

const rootBackground = computed(() => {
  if (currentUVLevel.value === null) {
    return 'linear-gradient(135deg, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.99) 100%)'
  }
  const color = uvColor.value.bg
  const r = parseInt(color.substring(1, 3), 16)
  const g = parseInt(color.substring(3, 5), 16)
  const b = parseInt(color.substring(5, 7), 16)
  return `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(${r}, ${g}, ${b}, 0.12) 40%, rgba(${r}, ${g}, ${b}, 0.08) 60%, rgba(255, 255, 255, 0.98) 100%)`
})

// Tick counter to make timeAgo reactive
const tick = ref(0)
let tickTimer = null
onMounted(() => {
  tickTimer = setInterval(() => tick.value++, 30000)
})
onUnmounted(() => {
  clearInterval(tickTimer)
})

const timeAgo = computed(() => {
  void tick.value
  if (!lastUpdated.value) return ''
  const diff = Math.round((Date.now() - lastUpdated.value.getTime()) / 60000)
  if (diff < 1) return 'Updated just now'
  if (diff === 1) return 'Updated 1 min ago'
  return `Updated ${diff} min ago`
})

// ==== API CALLS ====

async function fetchUVData(lat, lon) {
  try {
    loading.value = true
    error.value = false

    const apiKey = import.meta.env.VITE_OWM_KEY
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) throw new Error('API request failed')

    const data = await response.json()
    uvIndex.value = data.current.uvi

    await reverseGeocode(lat, lon)

    currentLat.value = lat
    currentLon.value = lon
    showData.value = true
    showLocationSearch.value = false
    lastUpdated.value = new Date()
  } catch {
    error.value = true
    showData.value = false
  } finally {
    loading.value = false
  }
}

async function reverseGeocode(lat, lon) {
  try {
    const apiKey = import.meta.env.VITE_OWM_KEY
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=100&appid=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) throw new Error('Geocoding failed')

    const data = await response.json()
    if (data.length > 0) {
      const { name, state } = data[0]
      locationName.value = state ? `${name}, ${state.substring(0, 3)}` : name
    }
  } catch {
    locationName.value = 'Your Location'
  }
}

// ==== USER INTERACTIONS ====

function requestLocationAndFetch() {
  if (!navigator.geolocation) {
    useFallbackLocation()
    return
  }

  loading.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      isDenied.value = false
      fetchUVData(latitude, longitude)
    },
    (geoError) => {
      isDenied.value = geoError.code === geoError.PERMISSION_DENIED
      useFallbackLocation()
    },
  )
}

function useFallbackLocation() {
  const melbourne = victoriaLocations[0]
  locationName.value = melbourne.name
  isDenied.value = false
  fetchUVData(melbourne.lat, melbourne.lon)
}

function handleLocationSelect(location) {
  isDenied.value = false
  fetchUVData(location.lat, location.lon)
}

function toggleLocationSearch() {
  showLocationSearch.value = !showLocationSearch.value
}

function handleRefresh() {
  showData.value = false
  isDenied.value = false
  requestLocationAndFetch()
}
</script>

<template>
  <div class="uv-tracker-root" :style="{ backgroundImage: rootBackground }">
    <!-- Decorative Clouds -->
    <div class="deco-clouds" aria-hidden="true">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <!-- Header -->
    <div class="header-section">
      <h1 class="title">SunSafe Victoria</h1>
      <p class="title-tagline">Know Your UV, Own Your Day</p>
      <p class="subtitle">
        Your pocket sun safety guide — personalised sunscreen dosage, outfit recommendations, and
        outdoor activity advice based on
        <span class="highlight">live UV and your skin type</span>.
      </p>
      <p v-if="!showData" class="permission-note">
        📍 Location access helps provide accurate UV data for your area.
      </p>
    </div>

    <!-- Gauge -->
    <UVGauge
      :current-u-v-level="currentUVLevel"
      :uv-color="uvColor"
      :show-data="showData"
      :location-name="locationName"
      :is-denied="isDenied"
      :loading="loading"
      :error="error"
      @request-location="requestLocationAndFetch"
      @change-location="toggleLocationSearch"
    />

    <!-- Content -->
    <div class="content-section">
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Fetching UV data...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="error-container">
        <p class="error-message">⚠️ Unable to fetch UV data. Check your connection.</p>
        <button class="btn btn-secondary" @click="handleRefresh">🔄 Retry</button>
      </div>

      <!-- Data Display -->
      <div v-if="showData && !loading && !error" class="data-container">
        <StatusCard :uv-level="currentUVLevel" :uv-color="uvColor" :uv-color-rgb="uvColorRgb" />

        <TipsCard :uv-level="currentUVLevel" :uv-severity="uvSeverity" />

        <SkinSelector :selected-type="selectedSkinType" @select="selectedSkinType = $event" />

        <SkinAdviceCard
          v-if="selectedSkinType"
          :skin-type="skinTypes[selectedSkinType]"
          :uv-level="currentUVLevel"
        />

        <!-- Refresh -->
        <div class="refresh-row">
          <span v-if="lastUpdated" class="time-ago">{{ timeAgo }}</span>
          <button class="btn btn-primary" @click="handleRefresh">Refresh UV Data</button>
        </div>
      </div>
    </div>

    <!-- Location Modal -->
    <LocationModal
      :show="showLocationSearch"
      :locations="victoriaLocations"
      :current-lat="currentLat"
      :current-lon="currentLon"
      @select="handleLocationSelect"
      @close="toggleLocationSearch"
    />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.uv-tracker-root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
  overflow: hidden;
  transition: background 0.8s ease;
  font-family:
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  background-size: cover;
  background-attachment: fixed;
  background-color: #f0f0f8;
}

/* Header */
.header-section {
  padding: 14px 20px 4px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.3px;
  color: #2e2e4a;
  text-shadow: 0 1px 4px rgba(100, 100, 180, 0.1);
}

.title-tagline {
  font-size: 0.82rem;
  font-weight: 500;
  color: #8b8ba8;
  margin: 2px 0 6px;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.82rem;
  font-weight: 400;
  margin: 0 0 2px;
  color: #5e5e7e;
  line-height: 1.45;
}

.highlight {
  font-weight: 600;
  color: #3ea72d;
}

.permission-note {
  font-size: 0.78rem;
  color: #9a9ab0;
  margin: 4px 0 0;
  font-style: italic;
}

/* Content */
.content-section {
  flex: 1;
  padding: 6px 20px 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 80px auto;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: #3ea72d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 0.95rem;
  color: #5e5e7e;
  font-weight: 500;
}

/* Error */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 60px auto;
  max-width: 400px;
}

.error-message {
  font-size: 0.95rem;
  color: #d32f2f;
  text-align: center;
}

/* Data Container */
.data-container {
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Buttons */
.btn {
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: inherit;
}

.btn-primary {
  width: 100%;
  background: rgba(62, 167, 45, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow:
    0 4px 15px rgba(62, 167, 45, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
  background: rgba(62, 167, 45, 0.95);
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(62, 167, 45, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  color: #2c7a1e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.btn-secondary:hover {
  background: rgba(62, 167, 45, 0.1);
  border-color: rgba(62, 167, 45, 0.4);
}

/* Refresh Row */
.refresh-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.time-ago {
  font-size: 0.75rem;
  color: #9a9ab0;
  font-weight: 400;
  letter-spacing: 0.2px;
}

/* Decorative Clouds */
.deco-clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  filter: blur(35px);
}

.cloud-1 {
  width: 240px;
  height: 70px;
  top: 5%;
  left: -50px;
  animation: driftCloud 28s ease-in-out infinite;
}

.cloud-2 {
  width: 180px;
  height: 55px;
  top: 20%;
  right: -30px;
  opacity: 0.6;
  animation: driftCloud 35s ease-in-out infinite reverse;
}

.cloud-3 {
  width: 150px;
  height: 50px;
  bottom: 25%;
  left: 10%;
  opacity: 0.45;
  animation: driftCloud 40s ease-in-out infinite 5s;
}

@keyframes driftCloud {
  0%,
  100% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(40px) translateY(-8px);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .title {
    font-size: 1.6rem;
  }
}

@media (max-width: 360px) {
  .title {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.78rem;
  }
}
</style>
