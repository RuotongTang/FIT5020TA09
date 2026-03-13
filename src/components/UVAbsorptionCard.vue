<script setup>
import { computed } from 'vue'
import { Activity } from 'lucide-vue-next'

const props = defineProps({
  uvLevel: { type: Number, required: true },
  skinTypeKey: { type: String, required: true },
})

const skinMeta = {
  fair: { label: 'Fair', factor: 1.0, tone: '#f7d8c6' },
  light: { label: 'Light', factor: 0.86, tone: '#efc29f' },
  medium: { label: 'Medium', factor: 0.72, tone: '#cc8f63' },
  olive: { label: 'Olive', factor: 0.58, tone: '#9a653f' },
  dark: { label: 'Dark', factor: 0.45, tone: '#5a3926' },
}

const selected = computed(() => skinMeta[props.skinTypeKey] ?? skinMeta.medium)

const absorptionPercent = computed(() => {
  const normalizedUv = Math.max(0, Math.min(props.uvLevel, 11)) / 11
  const value = normalizedUv * selected.value.factor * 100
  return Math.max(3, Math.min(100, Math.round(value)))
})

const protectionAdvice = computed(() => {
  const uv = props.uvLevel
  if (uv <= 2) return 'UV is low. Sunglasses and basic sun care are usually enough.'
  if (uv <= 5) return 'Use SPF 30+, hat, and sunglasses. Reapply sunscreen every 2 hours.'
  if (uv <= 7) return 'Seek shade at midday and use SPF 50+, protective clothing, and sunglasses.'
  if (uv <= 10)
    return 'Limit direct sun exposure. Cover up and reapply SPF 50+ strictly every 2 hours.'
  return 'Extreme UV: stay indoors or in full shade where possible and use full coverage if outside.'
})
</script>

<template>
  <section class="absorption-card" aria-live="polite">
    <h2 class="section-title">
      <Activity :size="18" aria-hidden="true" />
      UV Absorption Report
    </h2>
    <p class="subtitle">Based on your selected skin tone and live UV level.</p>

    <div class="report-grid">
      <div class="tone-chip" :style="{ '--tone': selected.tone }">
        <span class="tone-dot"></span>
        <span>{{ selected.label }} tone</span>
      </div>

      <div class="meter-wrap">
        <div class="meter-label-row">
          <span>Estimated UV absorption load</span>
          <strong>{{ absorptionPercent }}%</strong>
        </div>
        <div class="meter-track">
          <div class="meter-fill" :style="{ width: `${absorptionPercent}%` }"></div>
        </div>
      </div>
    </div>

    <p class="advice-title">What to do now</p>
    <p class="advice-text">{{ protectionAdvice }}</p>
  </section>
</template>

<style scoped>
.absorption-card {
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #ebdec3;
  border-left: 4px solid #f3a000;
  border-radius: 14px;
}

.section-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.subtitle {
  margin: 6px 0 12px;
  font-size: 0.86rem;
  color: #334155;
}

.report-grid {
  display: grid;
  gap: 10px;
}

.tone-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fffcf5;
  border: 1px solid #f4e5c4;
  color: #1f2937;
  font-size: 0.8rem;
  font-weight: 600;
}

.tone-dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--tone);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.14);
}

.meter-wrap {
  padding: 10px;
  border-radius: 12px;
  background: #fffdf7;
  border: 1px solid #f2e6cb;
}

.meter-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #334155;
  margin-bottom: 8px;
}

.meter-track {
  height: 10px;
  border-radius: 999px;
  background: #e7eaf0;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #f7cb4a 0%, #f18b00 58%, #d3412a 100%);
  border-radius: 999px;
  transition: width 0.45s ease;
}

.advice-title {
  margin: 12px 0 4px;
  font-size: 0.8rem;
  color: #334155;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.advice-text {
  margin: 0;
  font-size: 0.9rem;
  color: #1f2937;
  line-height: 1.58;
}
</style>
