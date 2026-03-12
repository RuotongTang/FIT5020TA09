<script setup>
import { computed } from 'vue'

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
    <h2 class="section-title">🛡️ Advice for Your Skin</h2>
    <p class="skin-description">{{ skinType.description }}</p>

    <div class="advice-items">
      <div class="advice-item">
        <span class="advice-icon">🧴</span>
        <div class="advice-body">
          <h3 class="advice-label">Sunscreen</h3>
          <p class="advice-text" v-html="sunscreenAdvice"></p>
        </div>
      </div>

      <div class="advice-item">
        <span class="advice-icon">👕</span>
        <div class="advice-body">
          <h3 class="advice-label">What to Wear</h3>
          <p class="advice-text">{{ clothingAdvice }}</p>
        </div>
      </div>

      <div class="advice-item">
        <span class="advice-icon">💡</span>
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(235, 255, 240, 0.5) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-left: 4px solid #3ea72d;
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(62, 167, 45, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.2px;
  margin: 0 0 10px;
  color: #2e2e4a;
}

.skin-description {
  font-size: 0.85rem;
  color: #5e5e7e;
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
  background: rgba(255, 255, 255, 0.35);
  border-radius: 12px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.advice-icon {
  font-size: 1.3rem;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.advice-body {
  flex: 1;
  min-width: 0;
}

.advice-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2e2e4a;
  margin: 0 0 4px;
  letter-spacing: 0.2px;
}

.advice-text {
  font-size: 0.84rem;
  color: #4a4a6a;
  margin: 0;
  line-height: 1.55;
}

/* Frosted glass highlight for key info */
.advice-text :deep(strong) {
  font-weight: 500;
  color: #2e2e4a;
  background: rgba(255, 255, 255, 0.5);
  padding: 1px 6px;
  border-radius: 6px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
</style>
