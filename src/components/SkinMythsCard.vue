<script setup>
import { ref } from 'vue'
import { Brain, ShieldAlert, BadgeCheck, CircleCheck, CircleX } from 'lucide-vue-next'

const activeIndex = ref(0)

const myths = [
  {
    myth: '"I only need sunscreen on very sunny days."',
    correction: 'UV can still be high through cloud cover.',
    explanation:
      'Most UV still reaches your skin on bright cloudy days. Use UV level, not cloud cover, to decide your protection.',
  },
  {
    myth: '"One morning sunscreen application lasts all day."',
    correction: 'Sunscreen needs reapplication every 2 hours.',
    explanation:
      'Sweat, friction, and water reduce protection. Reapply every 2 hours and immediately after swimming or heavy sweating.',
  },
  {
    myth: '"If my skin is darker, I cannot get sun damage."',
    correction: 'All skin tones can be damaged by UV.',
    explanation:
      'Melanin offers some natural filtering, but it does not block all UV. Sunburn, pigmentation and skin cancer risk still exist.',
  },
]

function toggleItem(index) {
  activeIndex.value = activeIndex.value === index ? -1 : index
}
</script>

<template>
  <section class="myths-section" aria-labelledby="myths-title">
    <h2 id="myths-title" class="section-title">
      <Brain :size="18" aria-hidden="true" />
      Skin Myths Zone
    </h2>
    <p class="section-subtitle">Common sun-protection myths and what is actually true.</p>

    <div class="myths-list">
      <article
        v-for="(item, index) in myths"
        :key="index"
        class="myth-item reveal"
        :class="`delay-${Math.min(index + 1, 3)}`"
      >
        <div class="myth-head" @click="toggleItem(index)">
          <div class="head-left">
            <ShieldAlert :size="16" class="myth-item-icon" aria-hidden="true" />
            <p class="myth-label">
              <CircleX v-if="activeIndex !== index" :size="14" aria-hidden="true" />
              <CircleCheck v-else :size="14" aria-hidden="true" />
              Myth
            </p>
          </div>
          <button class="expand-btn" type="button">
            {{ activeIndex === index ? 'Hide' : 'View' }}
          </button>
        </div>

        <p class="myth-text">{{ item.myth }}</p>

        <div v-if="activeIndex === index" class="myth-visual reveal delay-1">
          <div class="myth-body">
            <p class="fact-label">
              <BadgeCheck :size="14" aria-hidden="true" />
              Correction
            </p>
            <p class="fact-text">{{ item.correction }}</p>

            <p class="detail-label">Why this matters</p>
            <p class="detail-text">{{ item.explanation }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.myths-section {
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #dbe5ee;
  border-left: 4px solid #4d89ff;
  border-radius: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.section-subtitle {
  margin: 6px 0 12px;
  font-size: 0.86rem;
  color: #334155;
  line-height: 1.45;
}

.myths-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.myth-item {
  position: relative;
  padding: 12px;
  border-radius: 12px;
  background: #f8fbff;
  border: 1px solid #e5edf7;
  overflow: hidden;
  transition: transform var(--motion-fast, 180ms) ease;
}

.myth-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #cbd5e1;
}

.myth-item:hover {
  transform: translateY(-1px);
}

.myth-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.myth-item-icon {
  color: #475569;
  flex-shrink: 0;
}

.expand-btn {
  border: 1px solid #d5dfef;
  background: #ffffff;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.74rem;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
}

.myth-visual {
  margin: 10px 0 0;
  padding: 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5edf7;
}

.myth-body {
  min-width: 0;
}

.myth-label,
.fact-label,
.detail-label {
  margin: 0;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.myth-label {
  color: #b91c1c;
}

.myth-label :deep(svg) {
  color: #b91c1c;
}

.fact-label {
  color: #166534;
  margin-top: 8px;
}

.detail-label {
  color: #5f5f7f;
  margin-top: 8px;
}

.myth-text,
.fact-text,
.detail-text {
  margin: 4px 0 0;
  font-size: 0.9rem;
  line-height: 1.58;
  color: #1f2937;
}

.fact-text {
  font-weight: 600;
}

@media (max-width: 480px) {
  .myth-item {
    padding: 11px;
  }
}
</style>
