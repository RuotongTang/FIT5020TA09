<script setup>
import { computed } from 'vue'
import { Sun, CloudSun, ShieldAlert, Flame } from 'lucide-vue-next'

const props = defineProps({
  uvLevel: { type: Number, default: null },
  uvColor: { type: Object, required: true },
  uvColorRgb: { type: String, default: '108, 99, 255' },
})

const statusIcon = computed(() => {
  if (props.uvLevel === null) return Sun
  const level = props.uvLevel
  if (level <= 2) return Sun
  if (level <= 5) return CloudSun
  if (level <= 7) return ShieldAlert
  if (level <= 10) return ShieldAlert
  return Flame
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

const uvDots = computed(() => {
  const level = props.uvLevel ?? 0
  return Array.from({ length: 11 }, (_, idx) => idx < Math.min(level, 11))
})

const burnStartMinutes = computed(() => {
  if (props.uvLevel === null || props.uvLevel < 3) return null
  const minuteByUv = {
    3: 60,
    4: 45,
    5: 35,
    6: 30,
    7: 25,
    8: 20,
    9: 15,
    10: 12,
    11: 10,
  }
  const level = Math.min(Math.max(props.uvLevel, 3), 11)
  return minuteByUv[level] ?? 10
})

const immediateAction = computed(() => {
  if (props.uvLevel === null || props.uvLevel < 3) return ''
  if (props.uvLevel <= 5) return 'Apply SPF 30+ now and find nearby shade around midday.'
  if (props.uvLevel <= 7) return 'Move to shade now, apply SPF 50+, and wear a hat and sunglasses.'
  return 'Go to full shade now, apply SPF 50+ immediately, and cover exposed skin.'
})
</script>

<template>
  <div class="status-box" :style="{ '--accent-rgb': uvColorRgb }">
    <div class="status-hero">
      <component :is="statusIcon" :size="34" class="status-deco-icon" aria-hidden="true" />
      <span class="status-level-badge">{{ uvColor.label }}</span>
    </div>

    <div class="uv-dot-meter" aria-label="UV intensity meter">
      <span
        v-for="(active, index) in uvDots"
        :key="index"
        class="uv-dot"
        :class="{ active }"
      ></span>
    </div>

    <p v-if="burnStartMinutes" class="damage-warning">
      Skin damage may start in about <strong>{{ burnStartMinutes }} minutes</strong>.
      <span class="action-inline">Do this now: {{ immediateAction }}</span>
    </p>

    <p class="status-message">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
.status-box {
  text-align: center;
  padding: 20px 18px 16px;
  background: #ffffff;
  border: 1px solid #dbe5ee;
  border-top: 3px solid rgba(var(--accent-rgb, 108, 99, 255), 0.6);
  border-radius: 14px;
}

.status-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.status-deco-icon {
  color: rgba(var(--accent-rgb, 108, 99, 255), 0.88);
  animation: gentleBounce calc(var(--motion-slow, 1400ms) * 2.2) ease-in-out infinite;
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
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: rgba(var(--accent-rgb, 108, 99, 255), 0.1);
  color: #0f172a;
  border: 1px solid rgba(var(--accent-rgb, 108, 99, 255), 0.2);
}

.uv-dot-meter {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 0 0 12px;
}

.uv-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(125, 125, 155, 0.22);
  transition: all var(--motion-fast, 180ms) ease;
}

.uv-dot.active {
  background: rgba(var(--accent-rgb, 108, 99, 255), 0.72);
  box-shadow: 0 0 8px rgba(var(--accent-rgb, 108, 99, 255), 0.45);
}

.damage-warning {
  margin: 0 0 10px;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 0.86rem;
  line-height: 1.45;
  color: #7f1d1d;
  background: #fff4f2;
  border: 1px solid #fecaca;
}

.damage-warning strong {
  font-weight: 700;
}

.action-inline {
  display: block;
  margin-top: 3px;
}

.status-message {
  font-size: 0.94rem;
  color: #1f2937;
  margin: 0;
  line-height: 1.65;
  font-weight: 400;
}
</style>
