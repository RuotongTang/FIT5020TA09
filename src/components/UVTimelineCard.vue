<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { LineChart } from 'lucide-vue-next'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
)

const props = defineProps({
  hourlyData: {
    type: Array,
    default: () => [],
  },
  bare: {
    type: Boolean,
    default: false,
  },
})

const canvasRef = ref(null)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
let chartInstance = null

const isMiniBare = computed(() => props.bare && viewportWidth.value < 800)
const isUltraMiniBare = computed(() => props.bare && viewportWidth.value < 560)

const handleResize = () => {
  viewportWidth.value = window.innerWidth
}

const timelinePoints = computed(() =>
  props.hourlyData.slice(0, 6).map((entry) => ({
    label: new Date(entry.dt * 1000).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    value: Math.max(0, Math.min(11, Math.round(entry.uvi ?? 0))),
  })),
)

const peakWindow = computed(() => {
  if (!timelinePoints.value.length) return 'Unavailable'
  let peak = timelinePoints.value[0]
  for (const point of timelinePoints.value) {
    if (point.value > peak.value) peak = point
  }
  return `${peak.label} (UV ${peak.value})`
})

const dangerBands = computed(() => {
  if (!timelinePoints.value.length) return []

  const bands = []
  const n = timelinePoints.value.length
  let start = -1

  for (let i = 0; i < n; i++) {
    const isDanger = timelinePoints.value[i].value >= 8
    if (isDanger && start === -1) start = i

    const isLast = i === n - 1
    if ((!isDanger || isLast) && start !== -1) {
      const end = isDanger && isLast ? i : i - 1
      const left = (start / n) * 100
      const width = ((end - start + 1) / n) * 100
      bands.push({ left, width })
      start = -1
    }
  }

  return bands
})

function renderChart() {
  if (!canvasRef.value || !timelinePoints.value.length) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = canvasRef.value.getContext('2d')
  const canvasWidth = canvasRef.value.width || 300
  const canvasHeight = canvasRef.value.height || 150

  const lineGradient = ctx.createLinearGradient(0, 0, canvasWidth, 0)
  lineGradient.addColorStop(0, '#3EA72D')
  lineGradient.addColorStop(0.25, '#FFF300')
  lineGradient.addColorStop(0.5, '#F18B00')
  lineGradient.addColorStop(0.75, '#E53210')
  lineGradient.addColorStop(1, '#B567A4')

  const fillGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
  fillGradient.addColorStop(0, 'rgba(241, 139, 0, 0.18)')
  fillGradient.addColorStop(0.6, 'rgba(241, 139, 0, 0.06)')
  fillGradient.addColorStop(1, 'rgba(241, 139, 0, 0)')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timelinePoints.value.map((p) => p.label),
      datasets: [
        {
          label: 'UV Index',
          data: timelinePoints.value.map((p) => p.value),
          borderColor: lineGradient,
          backgroundColor: isMiniBare.value ? 'rgba(0, 0, 0, 0)' : fillGradient,
          borderWidth: isMiniBare.value ? 2 : 2.5,
          fill: !isMiniBare.value,
          tension: 0.4,
          pointRadius: isUltraMiniBare.value ? 0 : isMiniBare.value ? 1 : 4,
          pointHoverRadius: isUltraMiniBare.value ? 0 : isMiniBare.value ? 2 : 6,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: lineGradient,
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: !isMiniBare.value,
          displayColors: false,
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#f8fafc',
          callbacks: {
            label: (context) => `UV ${context.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          display: true,
          min: 0,
          max: 11,
          ticks: {
            stepSize: 2,
            color: 'rgba(100, 116, 139, 0.6)',
            font: { size: 10 },
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.12)',
            drawBorder: false,
          },
          border: { display: false },
        },
        x: {
          display: true,
          ticks: {
            color: 'rgba(100, 116, 139, 0.6)',
            font: { size: 10 },
          },
          grid: {
            display: false,
          },
          border: { display: false },
        },
      },
    },
  })
}

watch(
  () => props.hourlyData,
  () => {
    renderChart()
  },
  { deep: true },
)

watch(isMiniBare, () => {
  renderChart()
})

watch(isUltraMiniBare, () => {
  renderChart()
})

onMounted(() => {
  window.addEventListener('resize', handleResize, { passive: true })
  renderChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <section
    class="timeline-card"
    :class="{
      'is-bare': props.bare,
      'is-mini-bare': isMiniBare,
      'is-ultra-mini-bare': isUltraMiniBare,
    }"
    aria-labelledby="timeline-title"
  >
    <div class="timeline-head">
      <h2 id="timeline-title" class="timeline-title">
        <LineChart :size="18" aria-hidden="true" />
        UV Next 6 Hours
      </h2>
      <p class="timeline-subtitle">Peak risk window: {{ peakWindow }}</p>
    </div>

    <div class="chart-wrap" role="img" aria-label="UV forecast trend for next 6 hours">
      <div class="danger-overlay" aria-hidden="true">
        <span
          v-for="(band, idx) in dangerBands"
          :key="idx"
          class="danger-band"
          :style="{ left: `${band.left}%`, width: `${band.width}%` }"
        ></span>
      </div>
      <canvas ref="canvasRef"></canvas>
    </div>
  </section>
</template>

<style scoped>
.timeline-card {
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background:
    radial-gradient(circle at 14% 20%, rgba(253, 186, 116, 0.14), rgba(253, 186, 116, 0) 42%),
    radial-gradient(circle at 84% 26%, rgba(148, 163, 184, 0.1), rgba(148, 163, 184, 0) 42%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.58), rgba(255, 247, 237, 0.48));
  backdrop-filter: blur(7px) saturate(106%);
  -webkit-backdrop-filter: blur(7px) saturate(106%);
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.85) inset;
}

.timeline-card.is-bare {
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.timeline-card.is-mini-bare {
  padding: 4px 8px;
}

.timeline-card.is-bare .timeline-title {
  font-size: 0.82rem;
  gap: 6px;
}

.timeline-card.is-bare .timeline-subtitle {
  margin-top: 4px;
  font-size: 0.74rem;
}

.timeline-head {
  margin-bottom: 10px;
}

.timeline-card.is-bare .timeline-head {
  margin-bottom: 8px;
}

.timeline-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  line-height: 1.2;
  color: #0f172a;
}

.timeline-subtitle {
  margin: 6px 0 0;
  font-size: 0.8rem;
  color: #334155;
}

.chart-wrap {
  position: relative;
  height: 188px;
}

.timeline-card.is-bare .chart-wrap {
  flex: 1;
  min-height: 172px;
  height: auto;
}

.timeline-card.is-mini-bare .chart-wrap {
  min-height: 92px;
  height: 92px;
}

.timeline-card.is-ultra-mini-bare .chart-wrap {
  min-height: 72px;
  height: 72px;
}

.timeline-card.is-ultra-mini-bare {
  transform: scale(0.9);
  transform-origin: center top;
  width: 112%;
  margin-left: -6%;
}

.danger-overlay {
  position: absolute;
  inset: 8px 14px 26px 28px;
  pointer-events: none;
  z-index: 1;
}

.timeline-card.is-bare .danger-overlay {
  inset: 8px 10px 24px 22px;
}

@media (max-width: 480px) {
  .timeline-card.is-bare .chart-wrap {
    min-height: 148px;
    height: auto;
  }

  .timeline-card.is-ultra-mini-bare .chart-wrap {
    min-height: 72px;
    height: 72px;
  }

  .timeline-card.is-ultra-mini-bare {
    transform: scale(0.88);
    width: 116%;
    margin-left: -8%;
  }

  .timeline-card.is-bare .timeline-title {
    font-size: 0.78rem;
  }

  .timeline-card.is-bare .timeline-subtitle {
    font-size: 0.7rem;
  }
}

.danger-band {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 8px;
  background: linear-gradient(
    180deg,
    rgba(239, 68, 68, 0.18) 0%,
    rgba(239, 68, 68, 0.08) 60%,
    rgba(239, 68, 68, 0.02) 100%
  );
  border: 1px solid rgba(239, 68, 68, 0.14);
}
</style>
