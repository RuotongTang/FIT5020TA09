<script setup>
import { skinTypes } from '../data/uvConstants.js'

defineProps({
  selectedType: { type: String, default: null },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="skin-selector-section">
    <p class="skin-question">Want personalised tips to protect your skin?</p>
    <div class="skin-options">
      <button
        v-for="(type, key) in skinTypes"
        :key="key"
        class="skin-btn"
        :class="{ 'is-selected': selectedType === key }"
        @click="emit('select', key)"
      >
        {{ type.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.skin-selector-section {
  padding: 16px 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(245, 240, 255, 0.5) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-left: 4px solid #8b7cf7;
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(108, 99, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.skin-question {
  font-size: 0.88rem;
  color: #4a4a6a;
  margin: 0 0 10px;
  font-weight: 500;
}

.skin-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.skin-btn {
  padding: 8px 10px;
  font-size: 0.78rem;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #4a4a6a;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  line-height: 1.3;
  font-family: inherit;
}

.skin-btn:hover {
  border-color: rgba(62, 167, 45, 0.5);
  background: rgba(62, 167, 45, 0.08);
}

.skin-btn.is-selected {
  background: rgba(62, 167, 45, 0.8);
  border-color: rgba(62, 167, 45, 0.9);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(62, 167, 45, 0.3);
}

@media (max-width: 480px) {
  .skin-options {
    grid-template-columns: 1fr;
  }
}
</style>
