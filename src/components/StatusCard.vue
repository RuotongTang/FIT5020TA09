<script setup>
import { computed } from 'vue'

const props = defineProps({
  uvLevel: { type: Number, default: null },
  uvColor: { type: Object, required: true },
  uvColorRgb: { type: String, default: '108, 99, 255' },
})

const statusIcon = computed(() => {
  if (props.uvLevel === null) return '☀️'
  const level = props.uvLevel
  if (level <= 2) return '😎'
  if (level <= 5) return '⛅'
  if (level <= 7) return '☀️'
  if (level <= 10) return '🥵'
  return '🔥'
})

const statusMessage = computed(() => {
  if (props.uvLevel === null) return ''
  const level = props.uvLevel

  if (level <= 2)
    return 'Great news — UV is nice and low right now! Perfect for getting outdoors. Just grab your sunnies to keep your eyes happy.'
  if (level <= 5)
    return 'UV is picking up — time to think about sun protection. Pop on some sunscreen, a hat, and sunnies, and try to find shade around midday.'
  if (level <= 7)
    return 'Heads up — UV is high! Your skin can start burning in as little as 15–25 minutes without protection. Stick to the shade between 10am and 3pm.'
  if (level <= 10)
    return "UV is really intense right now. Try to stay out of the sun between 10am and 3pm. If you're heading out, gear up: SPF 50+, hat, sunnies, and long sleeves."
  return 'Dangerous UV levels today! Your skin can burn in under 10 minutes. Stay indoors or in full shade. If you must head out, cover up completely.'
})
</script>

<template>
  <div class="status-box" :style="{ '--accent-rgb': uvColorRgb }">
    <div class="status-hero">
      <span class="status-deco-icon">{{ statusIcon }}</span>
      <span class="status-level-badge">{{ uvColor.label }}</span>
    </div>
    <p class="status-message">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
.status-box {
  text-align: center;
  padding: 20px 18px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(240, 245, 255, 0.55) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-top: 3px solid rgba(var(--accent-rgb, 108, 99, 255), 0.6);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(var(--accent-rgb, 108, 99, 255), 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.status-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.status-deco-icon {
  font-size: 2.6rem;
  line-height: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
  animation: gentleBounce 3s ease-in-out infinite;
}

@keyframes gentleBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.status-level-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: rgba(var(--accent-rgb, 108, 99, 255), 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #2e2e4a;
  border: 1px solid rgba(var(--accent-rgb, 108, 99, 255), 0.15);
}

.status-message {
  font-size: 0.86rem;
  color: #4a4a6a;
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
}
</style>
