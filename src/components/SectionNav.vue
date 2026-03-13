<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  activeId: {
    type: String,
    default: 'uv-index-section',
  },
  accentRgb: {
    type: String,
    default: '22, 163, 74',
  },
})

const activeId = ref(props.activeId || 'uv-index-section')

watch(
  () => props.activeId,
  (next) => {
    if (next) activeId.value = next
  },
)

function goTo(targetId) {
  activeId.value = targetId
  const el = document.getElementById(targetId)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 86
  window.scrollTo({ top, behavior: 'smooth' })
}
</script>

<template>
  <div
    class="floating-nav"
    :style="{ '--nav-accent-rgb': props.accentRgb }"
    aria-label="Section navigation"
  >
    <nav id="quick-nav-list" class="section-nav">
      <button
        v-for="item in props.items"
        :key="item.id"
        type="button"
        class="nav-pill"
        :class="{ active: activeId === item.id }"
        @click="goTo(item.id)"
      >
        {{ item.label }}
      </button>
    </nav>
  </div>
</template>

<style scoped>
.floating-nav {
  position: fixed;
  left: 0;
  right: 0;
  width: min(560px, calc(100vw - 18px));
  margin: 0 auto;
  bottom: max(10px, env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  justify-content: center;
  padding: 6px 7px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.74);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(248, 250, 252, 0.8) 100%);
  backdrop-filter: blur(8px) saturate(112%);
  -webkit-backdrop-filter: blur(8px) saturate(112%);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
  animation: navFloatIn var(--motion-medium, 420ms) cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

@keyframes navFloatIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-nav {
  display: flex;
  justify-content: center;
  gap: 3px;
  overflow-x: auto;
  padding: 2px 8px;
  scrollbar-width: none;
  width: 100%;
  scroll-padding-inline: 16px;
  white-space: nowrap;
}

.section-nav::-webkit-scrollbar {
  display: none;
}

.nav-pill {
  flex: 0 0 auto;
  min-width: 88px;
  min-height: 38px;
  border: 1px solid #b9c7dc;
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  font-size: 0.73rem;
  font-weight: 800;
  border-radius: 999px;
  padding: 7px 10px;
  letter-spacing: 0.15px;
  cursor: pointer;
  transition: all var(--motion-fast, 180ms) ease;
  font-family: inherit;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.nav-pill:hover {
  transform: translateY(-1px);
  border-color: #bfdbfe;
  background: linear-gradient(180deg, #ffffff, #f1f5f9);
  box-shadow: 0 4px 10px rgba(30, 64, 175, 0.1);
}

.nav-pill.active {
  color: #0f172a;
  border-color: rgba(var(--nav-accent-rgb, 22, 163, 74), 0.55);
  background: rgba(var(--nav-accent-rgb, 22, 163, 74), 0.35);
  box-shadow:
    0 6px 14px rgba(var(--nav-accent-rgb, 22, 163, 74), 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.nav-pill:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .floating-nav {
    width: calc(100vw - 8px);
    bottom: max(6px, env(safe-area-inset-bottom));
    padding: 5px 4px;
  }

  .section-nav {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    column-gap: 4px;
    padding: 2px 2px;
    overflow-x: hidden;
    white-space: normal;
  }

  .nav-pill {
    width: 100%;
    min-width: 0;
    min-height: 42px;
    font-size: 0.64rem;
    padding: 8px 4px;
    letter-spacing: 0.02em;
  }
}

@media (max-width: 375px) {
  .floating-nav {
    width: calc(100vw - 2px);
    padding: 5px 1px;
  }

  .section-nav {
    column-gap: 3px;
    padding: 2px 2px;
  }

  .nav-pill {
    min-width: 0;
    font-size: 0.62rem;
    padding: 9px 3px;
    min-height: 44px;
    letter-spacing: 0.01em;
  }
}
</style>
