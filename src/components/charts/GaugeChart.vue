<template>
  <div class="simple-gauge-container">
    <svg ref="svgRef" :width="width" :height="height"></svg>
    <div class="gauge-text" :style="textStyle">
      <div class="gauge-value">{{ formattedValue }}</div>
    </div>
    <div class="gauge-limits">
      <span class="limit-min">{{ formattedMin }}</span>
      <span class="limit-max">{{ formattedMax }}</span>
    </div>

    <!-- HTML Tooltip -->
    <div
      ref="tooltipRef"
      class="gauge-tooltip-html"
      :style="{ opacity: tooltipVisible ? 1 : 0 }"
    >
      <div class="tooltip-content">
        <div class="tooltip-value" :style="{ color: color }">{{ tooltipValue }}</div>
        <div class="tooltip-remaining">{{ tooltipRemaining }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import * as d3 from 'd3'

interface Props {
  value: number
  min?: number
  max?: number
  label?: string
  suffix?: string
  prefix?: string
  width?: number
  height?: number
  color?: string
  backgroundColor?: string
  strokeWidth?: number
  decimals?: number
  allowNegative?: boolean
  displayMin?: number
  displayMax?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  label: '%',
  suffix: '',
  prefix: '',
  width: 250,
  height: 150,
  color: '#60a5fa',
  backgroundColor: '#dbeafe',
  strokeWidth: 25,
  decimals: 1,
  allowNegative: false,
  displayMin: undefined,
  displayMax: undefined
})

const svgRef = ref<SVGSVGElement>()
const tooltipRef = ref<HTMLDivElement>()
const tooltipVisible = ref(false)
const tooltipValue = ref('')
const tooltipRemaining = ref('')

const formattedValue = computed(() => {
  const valueToShow = props.value
  const val = valueToShow.toFixed(props.decimals)
  return `${props.prefix}${val}${props.label}`
})

const gaugeValue = computed(() => {
  if (!props.allowNegative && props.value < 0) {
    return 0
  }
  return Math.max(props.min, Math.min(props.max, props.value))
})

const formattedMin = computed(() => {
  const minToShow = props.displayMin !== undefined ? props.displayMin : props.min
  return `${props.prefix}${minToShow.toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}${props.suffix}`
})

const formattedMax = computed(() => {
  const maxToShow = props.displayMax !== undefined ? props.displayMax : props.max
  return `${props.prefix}${maxToShow.toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}${props.suffix}`
})

const textStyle = computed(() => ({
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -20%)',
  textAlign: 'center' as const
}))

const drawGauge = () => {
  if (!svgRef.value) return

  d3.select(svgRef.value).selectAll('*').remove()

  const centerX = props.width / 2
  const centerY = props.height - 20
  const radius = Math.min(props.width / 2, props.height) - props.strokeWidth

  const svg = d3.select(svgRef.value)

  const startAngle = -Math.PI / 2
  const endAngle = Math.PI / 2

  const backgroundArc = d3.arc()
    .innerRadius(radius - props.strokeWidth)
    .outerRadius(radius)
    .startAngle(startAngle)
    .endAngle(endAngle)

  svg.append('path')
    .attr('d', backgroundArc as any)
    .attr('transform', `translate(${centerX}, ${centerY})`)
    .style('fill', props.backgroundColor)

  const valueAngle = startAngle + ((gaugeValue.value - props.min) / (props.max - props.min)) * Math.PI

  const valueArc = d3.arc()
    .innerRadius(radius - props.strokeWidth)
    .outerRadius(radius)
    .startAngle(startAngle)
    .endAngle(valueAngle)

  const valuePath = svg.append('path')
    .attr('d', valueArc as any)
    .attr('transform', `translate(${centerX}, ${centerY})`)
    .style('fill', props.color)

  valuePath
    .transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attrTween('d', function() {
      const interpolate = d3.interpolate(startAngle, valueAngle)
      return function(t: number) {
        const currentArc = d3.arc()
          .innerRadius(radius - props.strokeWidth)
          .outerRadius(radius)
          .startAngle(startAngle)
          .endAngle(interpolate(t))
        return currentArc(null as any) as string
      }
    })

  const calculateEuroValues = () => {
    if (props.displayMin !== undefined && props.displayMax !== undefined) {
      const percentage = gaugeValue.value / 100
      const totalRange = props.displayMax - props.displayMin
      const filledValue = props.displayMin + (totalRange * percentage)
      const remainingValue = props.displayMax - filledValue
      return { filled: filledValue, remaining: remainingValue, total: props.displayMax }
    }
    return null
  }

  svg.append('path')
    .datum({ endAngle: endAngle })
    .attr('d', backgroundArc as any)
    .attr('transform', `translate(${centerX}, ${centerY})`)
    .style('fill', 'transparent')
    .style('cursor', 'pointer')
    .on('mouseenter', function() {
      const euroValues = calculateEuroValues()
      if (euroValues) {
        tooltipValue.value = `€${euroValues.filled.toLocaleString('it-IT', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
        tooltipRemaining.value = `Mancano: €${euroValues.remaining.toLocaleString('it-IT', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      } else {
        tooltipValue.value = `${gaugeValue.value.toFixed(1)}%`
        tooltipRemaining.value = `Mancano: ${(100 - gaugeValue.value).toFixed(1)}%`
      }
      tooltipVisible.value = true
    })
    .on('mouseleave', function() {
      tooltipVisible.value = false
    })
}

onMounted(() => {
  drawGauge()
})

watch([() => props.value, gaugeValue, () => props.displayMin, () => props.displayMax], () => {
  drawGauge()
})
</script>

<style scoped>
.simple-gauge-container {
  position: relative;
  display: inline-block;
}

.gauge-text {
  pointer-events: none;
}

.gauge-value {
  margin-top: 2.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1;
}

.gauge-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.gauge-limits {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 0.875rem;
  color: #6b7280;
}

.limit-min {
  text-align: left;
}

.limit-max {
  text-align: right;
}

.gauge-tooltip-html {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 1000;
}

.tooltip-content {
  text-align: center;
}

.tooltip-value {
  font-weight: bold;
  margin-bottom: 2px;
}

.tooltip-remaining {
  color: #9ca3af;
  font-size: 11px;
}
</style>