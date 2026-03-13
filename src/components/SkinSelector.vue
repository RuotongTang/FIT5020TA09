<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { skinTypes } from '../data/uvConstants.js'

const props = defineProps({
  sliderIndex: { type: Number, default: 3 },
  selectedType: { type: String, default: null },
})

const emit = defineEmits(['slider-change', 'confirm', 'reset'])
const shouldNudgeConfirm = ref(false)
const CONFIRM_NUDGE_SEEN_KEY = 'sunsafe-vic-confirm-nudge-seen'
let nudgeTimer = null

const skinToneMap = {
  fair: '#f7d8c6',
  light: '#efc29f',
  medium: '#cc8f63',
  olive: '#9a653f',
  dark: '#5a3926',
}

const orderedToneKeys = ['fair', 'light', 'medium', 'olive', 'dark']

const sliderLabel = computed(() => {
  const key = orderedToneKeys[props.sliderIndex - 1]
  return skinTypes[key]?.label ?? 'Medium Skin'
})

const selectedMeta = computed(() => {
  if (!props.selectedType) return null
  return skinTypes[props.selectedType]
})

function handleSliderInput(event) {
  const next = Number(event.target.value)
  emit('slider-change', next)
}

function previewLabelClass(index) {
  return {
    active: props.sliderIndex === index,
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return

  const hasSeenNudge = localStorage.getItem(CONFIRM_NUDGE_SEEN_KEY) === '1'
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!hasSeenNudge && !prefersReducedMotion && !props.selectedType) {
    shouldNudgeConfirm.value = true
    localStorage.setItem(CONFIRM_NUDGE_SEEN_KEY, '1')
    nudgeTimer = setTimeout(() => {
      shouldNudgeConfirm.value = false
    }, 2400)
  }
})

onUnmounted(() => {
  if (nudgeTimer) clearTimeout(nudgeTimer)
})
</script>

<template>
  <div class="skin-selector-section">
    <p class="skin-question">Skin tone and UV absorption tool</p>

    <div v-if="!selectedType" class="slider-panel">
      <div class="slider-header">
        <span class="slider-title">Adjust skin tone</span>
        <span class="slider-value">{{ sliderLabel }}</span>
      </div>

      <input
        class="tone-slider"
        type="range"
        min="1"
        max="5"
        step="1"
        :value="sliderIndex"
        @input="handleSliderInput"
      />

      <div class="tone-preview-row">
        <div
          v-for="(key, idx) in orderedToneKeys"
          :key="key"
          class="tone-preview"
          :class="previewLabelClass(idx + 1)"
        >
          <span class="swatch" :style="{ background: skinToneMap[key] }" aria-hidden="true"></span>
          <span class="tone-label">{{ idx + 1 }}</span>
        </div>
      </div>
    </div>

    <div v-if="!selectedType" class="action-row">
      <button
        class="action-btn confirm"
        :class="{ 'is-nudging': shouldNudgeConfirm }"
        @click="emit('confirm')"
      >
        Confirm
      </button>
      <button class="action-btn reset" @click="emit('reset')">Reset</button>
    </div>

    <p v-if="!selectedType" class="helper-note">
      Choose a tone and tap Confirm to show UV absorption details.
    </p>
    <div v-else class="selected-panel">
      <div class="selected-summary">
        <span
          class="swatch"
          :style="{ background: skinToneMap[selectedType] }"
          aria-hidden="true"
        ></span>
        <div class="selected-copy">
          <p class="selected-label">Selected tone: {{ selectedMeta?.label }}</p>
          <p class="selected-desc">{{ selectedMeta?.description }}</p>
        </div>
      </div>
      <button class="mini-reset" @click="emit('reset')">Reset</button>
    </div>

    <p v-if="selectedType" class="helper-note selected">
      You can reset to choose a different tone.
    </p>

    <div class="skin-options" aria-hidden="true">
      <button
        v-for="(type, key) in skinTypes"
        :key="key"
        class="skin-btn"
        :class="{ 'is-selected': selectedType === key }"
        tabindex="-1"
      >
        <span class="swatch" :style="{ background: skinToneMap[key] }"></span>
        <span>{{ type.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.skin-selector-section {
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #e4dff7;
  border-left: 4px solid #8b7cf7;
  border-radius: 14px;
}

.skin-question {
  font-size: 0.92rem;
  color: #0f172a;
  margin: 0 0 10px;
  font-weight: 700;
}

.slider-panel {
  padding: 12px;
  border-radius: 12px;
  background: #fbf9ff;
  border: 1px solid #ece8fb;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.slider-title {
  font-size: 0.8rem;
  color: #334155;
  font-weight: 600;
}

.slider-value {
  font-size: 0.76rem;
  color: #1e3a8a;
  font-weight: 700;
}

.tone-slider {
  width: 100%;
  accent-color: #5f81d9;
  cursor: pointer;
}

.tone-preview-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 8px;
}

.tone-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.tone-preview.active {
  opacity: 1;
}

.tone-label {
  font-size: 0.74rem;
  color: #334155;
}

.action-row {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.action-btn {
  padding: 9px 10px;
  border-radius: 10px;
  border: 1px solid #c4cddd;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
}

.action-btn.confirm {
  background: linear-gradient(160deg, #3ea72d, #2d8f2b);
  color: #fff;
  border-color: #2d8f2b;
}

.action-btn.confirm:hover {
  background: linear-gradient(160deg, #45b433, #2f992d);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(45, 143, 43, 0.35);
}

.action-btn.confirm.is-nudging {
  animation: confirmNudge 1.2s cubic-bezier(0.22, 1, 0.36, 1) 1;
}

@keyframes confirmNudge {
  0% {
    transform: translateY(0) scale(1);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  }
  30% {
    transform: translateY(-1px) scale(1.03);
    box-shadow: 0 9px 20px rgba(45, 143, 43, 0.4);
  }
  60% {
    transform: translateY(0) scale(1);
    box-shadow: 0 3px 8px rgba(15, 23, 42, 0.12);
  }
  100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .action-btn.confirm.is-nudging {
    animation: none;
  }
}

.action-btn.reset {
  background: #ffffff;
  color: #0f172a;
  border-color: #94a3b8;
}

.action-btn.reset:hover {
  background: #f8fafc;
  border-color: #64748b;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(100, 116, 139, 0.22);
}

.action-btn:focus-visible,
.mini-reset:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

.helper-note {
  margin: 10px 0 0;
  font-size: 0.8rem;
  color: #334155;
}

.helper-note.selected {
  color: #3b6a42;
  font-weight: 600;
}

.selected-panel {
  margin-top: 8px;
  padding: 10px;
  border-radius: 12px;
  background: #fbf9ff;
  border: 1px solid #ece8fb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.selected-summary {
  display: flex;
  gap: 9px;
  align-items: flex-start;
}

.selected-copy {
  min-width: 0;
}

.selected-label {
  margin: 0;
  font-size: 0.84rem;
  color: #0f172a;
  font-weight: 700;
}

.selected-desc {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #334155;
  line-height: 1.45;
}

.mini-reset {
  padding: 6px 9px;
  border-radius: 8px;
  border: 1px solid #94a3b8;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  flex-shrink: 0;
}

.mini-reset:hover {
  background: #f8fafc;
  border-color: #64748b;
}

.skin-options {
  display: none;
}

.skin-btn {
  display: flex;
  align-items: center;
  gap: 8px;
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

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.45),
    0 1px 3px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.skin-btn.is-selected {
  background: rgba(62, 167, 45, 0.8);
  border-color: rgba(62, 167, 45, 0.9);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(62, 167, 45, 0.3);
}

@media (max-width: 480px) {
  .tone-preview-row {
    gap: 4px;
  }
}
</style>
