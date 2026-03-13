<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  locations: { type: Array, required: true },
  onlineResults: { type: Array, default: () => [] },
  searching: { type: Boolean, default: false },
  currentLat: { type: Number, default: null },
  currentLon: { type: Number, default: null },
})

const emit = defineEmits(['select', 'close', 'search-query'])

const searchQuery = ref('')
let searchDebounce = null

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const localFilteredLocations = computed(() => {
  if (!searchQuery.value) {
    if (props.currentLat && props.currentLon) {
      return [...props.locations].sort((a, b) => {
        const distA = calculateDistance(props.currentLat, props.currentLon, a.lat, a.lon)
        const distB = calculateDistance(props.currentLat, props.currentLon, b.lat, b.lon)
        return distA - distB
      })
    }
    return props.locations
  }
  return props.locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const mergedLocations = computed(() => {
  if (!searchQuery.value) return localFilteredLocations.value

  const map = new Map()
  ;[...localFilteredLocations.value, ...props.onlineResults].forEach((item) => {
    map.set(`${item.lat}-${item.lon}`, item)
  })
  return [...map.values()]
})

watch(searchQuery, (query) => {
  if (searchDebounce) clearTimeout(searchDebounce)
  const normalized = query.trim()

  if (normalized.length < 2) {
    emit('search-query', '')
    return
  }

  searchDebounce = setTimeout(() => {
    emit('search-query', normalized)
  }, 320)
})

onUnmounted(() => {
  if (searchDebounce) clearTimeout(searchDebounce)
})

function selectLocation(location) {
  emit('select', location)
  searchQuery.value = ''
  emit('search-query', '')
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">Select a Location</h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search VIC suburb/city or postcode..."
        class="search-input"
        autofocus
      />
      <p class="search-hint">Type at least 2 letters. For postcode, enter 4 digits (e.g. 3000).</p>

      <p v-if="searching" class="search-status">Searching Victoria locations...</p>

      <div class="locations-list">
        <button
          v-for="location in mergedLocations"
          :key="`${location.lat}-${location.lon}`"
          class="location-item"
          @click="selectLocation(location)"
        >
          {{ location.name }}
        </button>
        <p v-if="!searching && mergedLocations.length === 0" class="empty-state">
          No matching VIC location found. Try another suburb or postcode.
        </p>
      </div>
      <button class="btn-close-modal" @click="emit('close')">Close</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  width: 100%;
  max-width: 540px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border-radius: 28px 28px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.9);
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
}

.modal-title {
  margin: 0 0 14px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2e2e4a;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 1rem;
  margin-bottom: 16px;
  color: #2c2c2c;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: rgba(62, 167, 45, 0.6);
  box-shadow: 0 0 0 3px rgba(62, 167, 45, 0.1);
  background: rgba(255, 255, 255, 0.8);
}

.search-input::placeholder {
  color: #999999;
}

.search-hint {
  margin: -6px 0 8px;
  font-size: 0.75rem;
  color: #7a7a93;
}

.search-status {
  margin: 0 0 10px;
  font-size: 0.8rem;
  color: #4c7d4f;
  font-weight: 500;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  flex: 1;
  overflow-y: auto;
}

.location-item {
  padding: 12px;
  text-align: left;
  background: rgba(240, 240, 240, 0.7);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c2c2c;
  transition: all 0.2s ease;
  font-family: inherit;
}

.location-item:hover {
  background: rgba(62, 167, 45, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(62, 167, 45, 0.2);
}

.empty-state {
  margin: 8px 0;
  font-size: 0.82rem;
  color: #6f6f8f;
  text-align: center;
}

.btn-close-modal {
  padding: 12px;
  background: rgba(240, 240, 240, 0.7);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c2c2c;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-close-modal:hover {
  background: rgba(230, 230, 230, 0.8);
}
</style>
