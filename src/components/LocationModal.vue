<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  locations: { type: Array, required: true },
  currentLat: { type: Number, default: null },
  currentLon: { type: Number, default: null },
})

const emit = defineEmits(['select', 'close'])

const searchQuery = ref('')

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

const filteredLocations = computed(() => {
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

function selectLocation(location) {
  emit('select', location)
  searchQuery.value = ''
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">Select a Location</h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Victoria locations..."
        class="search-input"
        autofocus
      />
      <div class="locations-list">
        <button
          v-for="location in filteredLocations"
          :key="`${location.lat}-${location.lon}`"
          class="location-item"
          @click="selectLocation(location)"
        >
          {{ location.name }}
        </button>
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
