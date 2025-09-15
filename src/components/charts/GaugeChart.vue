<template>
  <div class="simple-gauge-container">
    <svg ref="svgRef" :width="width" :height="height"></svg>
    <div class="gauge-text" :style="textStyle">
      <div class="gauge-value">{{ formattedValue }}</div>
      <!-- <div class="gauge-label">{{ label }}</div> -->
    </div>
    <div class="gauge-limits">
      <span class="limit-min">{{ formattedMin }}</span>
      <span class="limit-max">{{ formattedMax }}</span>
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
  allowNegative: false
})

const svgRef = ref<SVGSVGElement>()

const formattedValue = computed(() => {
  const val = props.value.toFixed(props.decimals)
  return `${props.prefix}${val}${props.label}`
})

const displayValue = computed(() => {
  if (!props.allowNegative && props.value < 0) {
    return 0
  }
  return Math.max(props.min, Math.min(props.max, props.value))
})

const formattedMin = computed(() => {
  return `${props.prefix}${props.min.toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}${props.suffix}`
})

const formattedMax = computed(() => {
  return `${props.prefix}${props.max.toLocaleString('it-IT', {
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

  const valueAngle = startAngle + ((displayValue.value - props.min) / (props.max - props.min)) * Math.PI

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
}

onMounted(() => {
  drawGauge()
})

watch([() => props.value, displayValue], () => {
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
  margin-top: 3rem;
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
</style>