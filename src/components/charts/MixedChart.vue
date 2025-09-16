<template>
  <div class="mixed-chart" ref="containerRef">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <svg ref="svgRef" :width="containerWidth" :height="containerHeight"></svg>

    <div
      ref="tooltipRef"
      class="mixed-chart-tooltip"
      :style="{ opacity: tooltipVisible ? 1 : 0 }"
    >
      <div class="tooltip-content">
        <div class="tooltip-date">{{ tooltipDate }}</div>
        <div class="tooltip-value">{{ tooltipValue }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'

interface DataPoint {
  date: string
  barValue: number
  lineValue: number
  barType: 'positive' | 'negative'
}

interface Props {
  title?: string
  width?: number
  height?: number
  data?: DataPoint[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Mixed Chart',
  width: 1000,
  height: 400,
  data: () => [
    { date: '2025-06-01', barValue: 2000, lineValue: 4500, barType: 'positive' },
    { date: '2025-06-02', barValue: 3000, lineValue: 4600, barType: 'negative' },
    { date: '2025-06-03', barValue: 4200, lineValue: 3200, barType: 'positive' },
    { date: '2025-06-04', barValue: 4000, lineValue: 3300, barType: 'positive' },
    { date: '2025-06-05', barValue: 2200, lineValue: 3100, barType: 'negative' },
    { date: '2025-06-06', barValue: 0, lineValue: 1200, barType: 'negative' },
    { date: '2025-06-07', barValue: 0, lineValue: 1300, barType: 'negative' },
    { date: '2025-06-08', barValue: 0, lineValue: 4600, barType: 'negative' },
    { date: '2025-06-09', barValue: 0, lineValue: 4500, barType: 'negative' },
    { date: '2025-06-10', barValue: 0, lineValue: 3200, barType: 'negative' },
    { date: '2025-06-11', barValue: 0, lineValue: 3300, barType: 'negative' },
    { date: '2025-06-12', barValue: 0, lineValue: 3100, barType: 'negative' },
    { date: '2025-06-13', barValue: 0, lineValue: 1200, barType: 'negative' },
    { date: '2025-06-14', barValue: 0, lineValue: 1300, barType: 'negative' },
    { date: '2025-06-15', barValue: 0, lineValue: 1100, barType: 'negative' },
    { date: '2025-06-16', barValue: 0, lineValue: 4600, barType: 'negative' },
    { date: '2025-06-17', barValue: 0, lineValue: 4500, barType: 'negative' },
    { date: '2025-06-18', barValue: 0, lineValue: 3200, barType: 'negative' },
    { date: '2025-06-19', barValue: 0, lineValue: 3300, barType: 'negative' },
    { date: '2025-06-20', barValue: 0, lineValue: 3100, barType: 'negative' },
    { date: '2025-06-21', barValue: 0, lineValue: 1200, barType: 'negative' },
    { date: '2025-06-22', barValue: 0, lineValue: 1300, barType: 'negative' },
    { date: '2025-06-23', barValue: 0, lineValue: 4600, barType: 'negative' },
    { date: '2025-06-24', barValue: 0, lineValue: 4000, barType: 'negative' },
    { date: '2025-06-25', barValue: 0, lineValue: 3600, barType: 'negative' },
    { date: '2025-06-26', barValue: 0, lineValue: 3300, barType: 'negative' },
    { date: '2025-06-27', barValue: 0, lineValue: 3100, barType: 'negative' },
    { date: '2025-06-28', barValue: 0, lineValue: 1500, barType: 'negative' },
    { date: '2025-06-29', barValue: 0, lineValue: 1200, barType: 'negative' },
    { date: '2025-06-30', barValue: 0, lineValue: 4300, barType: 'negative' }
  ]
})

const svgRef = ref<SVGSVGElement>()
const containerRef = ref<HTMLDivElement>()
const tooltipRef = ref<HTMLDivElement>()
const containerWidth = ref(1000)
const containerHeight = ref(400)
const tooltipVisible = ref(false)
const tooltipDate = ref('')
const tooltipValue = ref('')

let resizeObserver: ResizeObserver | null = null

const updateDimensions = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    containerWidth.value = Math.max(400, rect.width - 32)
    containerHeight.value = Math.max(250, Math.min(400, rect.width * 0.4))
  }
}

const drawChart = () => {
  if (!svgRef.value) return

  d3.select(svgRef.value).selectAll('*').remove()

  const margin = { top: 20, right: 80, bottom: 80, left: 80 }
  const innerWidth = containerWidth.value - margin.left - margin.right
  const innerHeight = containerHeight.value - margin.top - margin.bottom

  const svg = d3.select(svgRef.value)
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const parseDate = d3.timeParse('%Y-%m-%d')
  const data = props.data.map(d => ({
    ...d,
    date: parseDate(d.date)!
  }))

  const xScale = d3.scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .range([0, innerWidth])
    .padding(0.2)

  const maxBarValue = d3.max(data, d => d.barValue) || 0
  const maxLineValue = d3.max(data, d => d.lineValue) || 0
  const maxValue = Math.max(maxBarValue, maxLineValue)

  const yScale = d3.scaleLinear()
    .domain([0, maxValue * 1.1])
    .range([innerHeight, 0])

  const xAxis = d3.axisBottom(xScale)
    .tickFormat((_, i) => {
      const dateStr = data[i]?.date
      return dateStr ? d3.timeFormat('%Y-%m-%d')(dateStr) : ''
    })

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => `€${(d as number).toLocaleString('it-IT')}`)

  g.selectAll('.grid-line-y')
    .data(yScale.ticks(5))
    .enter()
    .append('line')
    .attr('class', 'grid-line-y')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .style('stroke', '#e5e7eb')
    .style('stroke-width', 1)


  const barsData = data.filter(d => d.barValue > 0)

  g.selectAll('.bar')
    .data(barsData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => {
      const originalIndex = data.findIndex(item => item.date.getTime() === d.date.getTime())
      return xScale(originalIndex.toString())!
    })
    .attr('y', d => yScale(d.barValue))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(d.barValue))
    .style('fill', d => d.barType === 'positive' ? '#22c55e' : '#ef4444')
    .style('cursor', 'pointer')
    .on('mouseenter', function(event, d) {
      d3.select(this).style('opacity', 0.8)
      tooltipDate.value = d3.timeFormat('%d/%m/%Y')(d.date)
      tooltipValue.value = `€${d.barValue.toLocaleString('it-IT')}`
      tooltipVisible.value = true

      const rect = containerRef.value!.getBoundingClientRect()
      const tooltipRect = tooltipRef.value!.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      tooltipRef.value!.style.left = `${Math.min(mouseX - tooltipRect.width / 2, rect.width - tooltipRect.width - 10)}px`
      tooltipRef.value!.style.top = `${mouseY - tooltipRect.height - 10}px`
    })
    .on('mouseleave', function() {
      d3.select(this).style('opacity', 1)
      tooltipVisible.value = false
    })



  const line = d3.line<any>()
    .x((_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
    .y(d => yScale(d.lineValue))
    .curve(d3.curveMonotoneX)

  g.append('path')
    .datum(data)
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', '#3b82f6')
    .style('stroke-width', 3)

  g.selectAll('.line-point')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'line-point')
    .attr('cx', (_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.lineValue))
    .attr('r', 4)
    .style('fill', '#3b82f6')
    .style('cursor', 'pointer')
    .on('mouseenter', function(event, d) {
      d3.select(this).attr('r', 6).style('fill', '#1d4ed8')
      tooltipDate.value = d3.timeFormat('%d/%m/%Y')(d.date)
      tooltipValue.value = `€${d.lineValue.toLocaleString('it-IT')}`
      tooltipVisible.value = true

      const rect = containerRef.value!.getBoundingClientRect()
      const tooltipRect = tooltipRef.value!.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      tooltipRef.value!.style.left = `${Math.min(mouseX - tooltipRect.width / 2, rect.width - tooltipRect.width - 10)}px`
      tooltipRef.value!.style.top = `${mouseY - tooltipRect.height - 10}px`
    })
    .on('mouseleave', function() {
      d3.select(this).attr('r', 4).style('fill', '#3b82f6')
      tooltipVisible.value = false
    })


  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)')
    .attr('dx', '-0.5em')
    .attr('dy', '0.5em')
    .style('font-size', '10px')

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
}

onMounted(() => {
  updateDimensions()

  resizeObserver = new ResizeObserver(() => {
    updateDimensions()
    drawChart()
  })

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  drawChart()
})

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
})

watch([containerWidth, containerHeight], () => {
  drawChart()
})

watch(() => props.data, () => {
  drawChart()
}, { deep: true })
</script>

<style scoped>
.mixed-chart {
  background: white;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.mixed-chart-tooltip {
  position: absolute;
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

.tooltip-date {
  font-size: 10px;
  color: #9ca3af;
  margin-bottom: 2px;
}

.tooltip-value {
  font-weight: bold;
}
</style>