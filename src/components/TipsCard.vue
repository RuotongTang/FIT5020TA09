<script setup>
import { computed } from 'vue'
import { Lightbulb, Shield, Shirt, Sun } from 'lucide-vue-next'

const props = defineProps({
  uvLevel: { type: Number, required: true },
  uvSeverity: { type: String, default: 'low' },
})

const tips = computed(() => {
  const level = props.uvLevel
  const items = []

  // Sunscreen dosage tip (AC: display sunscreen dosage in teaspoons or pumps)
  if (level <= 2) {
    items.push({
      icon: Shield,
      text: "Sunscreen isn't needed for most people right now — but near water, snow, or sand, consider <strong>SPF 30+</strong> as these surfaces reflect UV.",
    })
  } else if (level <= 5) {
    items.push({
      icon: Shield,
      text: 'Apply <strong>SPF 30+</strong> sunscreen: about <strong>1 teaspoon</strong> for your face & neck, and <strong>7 teaspoons (~35 ml)</strong> for your whole body — roughly <strong>2–3 pumps</strong> from a standard bottle. Reapply every 2 hours.',
    })
  } else if (level <= 7) {
    items.push({
      icon: Shield,
      text: 'Use <strong>SPF 30–50+</strong> generously: <strong>1 teaspoon</strong> for face & neck, <strong>7 teaspoons</strong> for your whole body (about <strong>2–3 pumps</strong>). Reapply every 2 hours, especially after sweating.',
    })
  } else {
    items.push({
      icon: Shield,
      text: '<strong>SPF 50+</strong> is essential — apply <strong>1 teaspoon</strong> for face & neck, <strong>7 teaspoons (~35 ml)</strong> for your body. Reapply every 2 hours, or right after swimming or sweating.',
    })
  }

  // Clothing advice (AC: clothing advice that changes by UV level)
  if (level <= 2) {
    items.push({
      icon: Shirt,
      text: 'Wear whatever you like! Just pop on some <strong>sunglasses</strong> to protect your eyes from long-term UV damage.',
    })
  } else if (level <= 5) {
    items.push({
      icon: Shirt,
      text: "Wear a <strong>hat and sunglasses</strong>. A shirt with sleeves is a smart call if you'll be out for a while.",
    })
  } else if (level <= 7) {
    items.push({
      icon: Shirt,
      text: 'Go for <strong>long sleeves, a broad-brimmed hat, and wrap-around sunnies</strong>. Darker, tightly-woven fabrics give better protection.',
    })
  } else if (level <= 10) {
    items.push({
      icon: Shirt,
      text: 'Cover up with <strong>UPF 50+ clothing, broad-brimmed hat, and wrap-around sunnies</strong>. Keep exposed skin to a minimum.',
    })
  } else {
    items.push({
      icon: Shirt,
      text: 'Full coverage: <strong>long sleeves, long pants, broad-brimmed hat, and wrap-around sunnies</strong>. UPF 50+ fabrics are ideal.',
    })
  }

  // Extra practical tip
  if (level <= 2) {
    items.push({ icon: Sun, text: 'Great day to be outdoors — enjoy it!' })
  } else if (level <= 5) {
    items.push({
      icon: Sun,
      text: 'Try to <strong>find shade between 10 am and 3 pm</strong> when UV is at its strongest.',
    })
  } else if (level <= 7) {
    items.push({
      icon: Sun,
      text: "<strong>Stick to the shade between 10 am and 3 pm</strong> — that's when UV does the most damage.",
    })
  } else if (level <= 10) {
    items.push({
      icon: Sun,
      text: '<strong>Avoid being outside between 10 am and 3 pm</strong> if you can. If you must head out, stay in the shade.',
    })
  } else {
    items.push({
      icon: Sun,
      text: '<strong>Stay indoors or in complete shade.</strong> Even a few minutes of unprotected exposure can cause damage at this level.',
    })
  }

  return items
})
</script>

<template>
  <div class="tips-section" :class="`severity-${uvSeverity}`">
    <h2 class="section-title">
      <Lightbulb :size="18" aria-hidden="true" />
      Tips for Today
    </h2>
    <div class="tips-visual-rail" aria-hidden="true">
      <span class="rail-dot"></span>
      <span class="rail-dot"></span>
      <span class="rail-dot"></span>
    </div>
    <ul class="tips-list">
      <li
        v-for="(tip, idx) in tips"
        :key="idx"
        class="tip-item reveal"
        :class="`delay-${Math.min(idx + 1, 3)}`"
      >
        <component :is="tip.icon" :size="16" class="tip-icon" aria-hidden="true" />
        <p class="tip-text" v-html="tip.text"></p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tips-section {
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #d7e4d9;
  border-left: 4px solid #3ea72d;
  border-radius: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0;
  margin: 0 0 8px;
  color: #0f172a;
}

.tips-visual-rail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
}

.rail-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(62, 167, 45, 0.28);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.5);
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
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: #1e293b;
  padding: 10px 12px;
  background: #f8fbf8;
  border-radius: 12px;
  border: 1px solid #e4ede6;
  transition: background 0.2s ease;
}

.tip-icon {
  color: #166534;
  flex-shrink: 0;
  margin-top: 1px;
}

.tip-text {
  margin: 0;
  line-height: 1.58;
}

/* UV-severity aware colours */
.severity-high {
  border-left-color: #e87d20;
}
.severity-veryhigh {
  border-left-color: #d63420;
}
.severity-extreme {
  border-left-color: #9b3a8d;
}

.severity-high .rail-dot,
.severity-veryhigh .rail-dot {
  background: rgba(232, 125, 32, 0.32);
}

.severity-extreme .rail-dot {
  background: rgba(214, 52, 32, 0.35);
}

/* Frosted glass highlight for key info */
.tip-text :deep(strong) {
  font-weight: 700;
  color: #0f172a;
}
</style>
