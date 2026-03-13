<script setup>
import { computed } from 'vue'
import { Shield, Shirt, Info } from 'lucide-vue-next'

const props = defineProps({
  skinType: { type: Object, required: true },
  uvLevel: { type: Number, required: true },
})

// AC: sunscreen dosage in teaspoons or pumps, personalised to skin type SPF
const sunscreenAdvice = computed(() => {
  const spf = props.skinType.spf
  if (props.uvLevel <= 2) {
    return `Most people don't need sunscreen at this UV level — but if you're near reflective surfaces like water or sand, pop on some <strong>SPF ${spf}</strong>.`
  }
  return `Apply <strong>SPF ${spf}</strong> sunscreen: about <strong>1 teaspoon</strong> for your face & neck, and <strong>7 teaspoons (~35 ml)</strong> for your whole body — that's roughly <strong>2–3 pumps</strong> from a standard bottle. Reapply every <strong>2 hours</strong>, or straight after swimming or sweating.`
})

// AC: clothing advice that changes by UV level
const clothingAdvice = computed(() => {
  const level = props.uvLevel
  if (level <= 2)
    return 'No special gear needed — just grab your sunglasses to keep your eyes protected.'
  if (level <= 5)
    return "Pop on a hat and sunglasses. A shirt with sleeves is a smart choice if you're spending time outdoors."
  if (level <= 7)
    return 'Go for long sleeves, a broad-brimmed hat, and wrap-around sunnies. Darker, tightly-woven fabrics give better protection.'
  if (level <= 10)
    return 'Cover up with UPF 50+ clothing if you have it, a broad-brimmed hat, and wrap-around sunnies. Keep as little skin exposed as possible.'
  return 'Full coverage is a must: long sleeves, long pants, broad-brimmed hat, and wrap-around sunnies. UPF 50+ fabrics are ideal.'
})
</script>

<template>
  <div class="skin-advice-card">
    <h2 class="section-title">Advice for Your Skin</h2>
    <p class="skin-description">{{ skinType.description }}</p>

    <div class="advice-items">
      <div class="advice-item">
        <Shield :size="18" class="advice-icon" aria-hidden="true" />
        <div class="advice-body">
          <h3 class="advice-label">Sunscreen</h3>
          <p class="advice-text" v-html="sunscreenAdvice"></p>
        </div>
      </div>

      <div class="advice-item">
        <Shirt :size="18" class="advice-icon" aria-hidden="true" />
        <div class="advice-body">
          <h3 class="advice-label">What to Wear</h3>
          <p class="advice-text">{{ clothingAdvice }}</p>
        </div>
      </div>

      <div class="advice-item">
        <Info :size="18" class="advice-icon" aria-hidden="true" />
        <div class="advice-body">
          <h3 class="advice-label">Good to Know</h3>
          <p class="advice-text">{{ skinType.extraTip }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skin-advice-card {
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #d7e4d9;
  border-left: 4px solid #3ea72d;
  border-radius: 14px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 10px;
  color: #0f172a;
}

.skin-description {
  font-size: 0.9rem;
  color: #334155;
  margin: 0 0 14px;
  line-height: 1.55;
  font-style: italic;
}

.advice-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  background: #f8fbf8;
  border-radius: 12px;
  border: 1px solid #e4ede6;
}

.advice-icon {
  color: #166534;
  flex-shrink: 0;
  margin-top: 2px;
}

.advice-body {
  flex: 1;
  min-width: 0;
}

.advice-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
  letter-spacing: 0.2px;
}

.advice-text {
  font-size: 0.9rem;
  color: #1f2937;
  margin: 0;
  line-height: 1.6;
}

/* Frosted glass highlight for key info */
.advice-text :deep(strong) {
  font-weight: 700;
  color: #0f172a;
}
</style>
