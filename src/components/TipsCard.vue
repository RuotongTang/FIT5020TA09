<script setup>
import { computed } from 'vue'

const props = defineProps({
  uvLevel: { type: Number, required: true },
  uvSeverity: { type: String, default: 'low' },
})

const tips = computed(() => {
  const level = props.uvLevel
  const items = []

  // Sunscreen dosage tip (AC: display sunscreen dosage in teaspoons or pumps)
  if (level <= 2) {
    items.push(
      "Sunscreen isn't needed for most people right now — but near water, snow, or sand, consider <strong>SPF 30+</strong> as these surfaces reflect UV.",
    )
  } else if (level <= 5) {
    items.push(
      'Apply <strong>SPF 30+</strong> sunscreen: about <strong>1 teaspoon</strong> for your face & neck, and <strong>7 teaspoons (~35 ml)</strong> for your whole body — roughly <strong>2–3 pumps</strong> from a standard bottle. Reapply every 2 hours.',
    )
  } else if (level <= 7) {
    items.push(
      'Use <strong>SPF 30–50+</strong> generously: <strong>1 teaspoon</strong> for face & neck, <strong>7 teaspoons</strong> for your whole body (about <strong>2–3 pumps</strong>). Reapply every 2 hours, especially after sweating.',
    )
  } else {
    items.push(
      '<strong>SPF 50+</strong> is essential — apply <strong>1 teaspoon</strong> for face & neck, <strong>7 teaspoons (~35 ml)</strong> for your body. Reapply every 2 hours, or right after swimming or sweating.',
    )
  }

  // Clothing advice (AC: clothing advice that changes by UV level)
  if (level <= 2) {
    items.push(
      'Wear whatever you like! Just pop on some <strong>sunglasses</strong> to protect your eyes from long-term UV damage.',
    )
  } else if (level <= 5) {
    items.push(
      "Wear a <strong>hat and sunglasses</strong>. A shirt with sleeves is a smart call if you'll be out for a while.",
    )
  } else if (level <= 7) {
    items.push(
      'Go for <strong>long sleeves, a broad-brimmed hat, and wrap-around sunnies</strong>. Darker, tightly-woven fabrics give better protection.',
    )
  } else if (level <= 10) {
    items.push(
      'Cover up with <strong>UPF 50+ clothing, broad-brimmed hat, and wrap-around sunnies</strong>. Keep exposed skin to a minimum.',
    )
  } else {
    items.push(
      'Full coverage: <strong>long sleeves, long pants, broad-brimmed hat, and wrap-around sunnies</strong>. UPF 50+ fabrics are ideal.',
    )
  }

  // Extra practical tip
  if (level <= 2) {
    items.push('Great day to be outdoors — enjoy it!')
  } else if (level <= 5) {
    items.push(
      'Try to <strong>find shade between 10 am and 3 pm</strong> when UV is at its strongest.',
    )
  } else if (level <= 7) {
    items.push(
      "<strong>Stick to the shade between 10 am and 3 pm</strong> — that's when UV does the most damage.",
    )
  } else if (level <= 10) {
    items.push(
      '<strong>Avoid being outside between 10 am and 3 pm</strong> if you can. If you must head out, stay in the shade.',
    )
  } else {
    items.push(
      '<strong>Stay indoors or in complete shade.</strong> Even a few minutes of unprotected exposure can cause damage at this level.',
    )
  }

  return items
})
</script>

<template>
  <div class="tips-section" :class="`severity-${uvSeverity}`">
    <h2 class="section-title">💡 Tips for Today</h2>
    <ul class="tips-list">
      <li v-for="(tip, idx) in tips" :key="idx" class="tip-item" v-html="tip"></li>
    </ul>
  </div>
</template>

<style scoped>
.tips-section {
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

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #4a4a6a;
  padding: 10px 12px 10px 34px;
  position: relative;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 12px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  transition: background 0.2s ease;
}

.tip-item::before {
  content: '✓';
  position: absolute;
  left: 12px;
  top: 10px;
  color: #3ea72d;
  font-weight: 700;
  font-size: 0.85rem;
}

/* UV-severity aware colours */
.severity-high .tip-item::before,
.severity-veryhigh .tip-item::before {
  color: #e87d20;
}

.severity-extreme .tip-item::before {
  color: #d63420;
}

.severity-high {
  border-left-color: #e87d20;
}
.severity-veryhigh {
  border-left-color: #d63420;
}
.severity-extreme {
  border-left-color: #9b3a8d;
}

/* Frosted glass highlight for key info */
.tip-item :deep(strong) {
  font-weight: 500;
  color: #2e2e4a;
  background: rgba(255, 255, 255, 0.5);
  padding: 1px 6px;
  border-radius: 6px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
</style>
