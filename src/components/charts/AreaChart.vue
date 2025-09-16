<template>
  <div class="area-projection-chart" ref="containerRef">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <svg ref="svgRef" :width="containerWidth" :height="containerHeight"></svg>

    <!-- HTML Tooltip -->
    <div
      ref="tooltipRef"
      class="area-tooltip-html"
      :style="{ opacity: tooltipVisible ? 1 : 0 }"
    >
      <div class="tooltip-content">
        <div class="tooltip-date">{{ tooltipDate }}</div>
        <div class="tooltip-actual" :style="{ color: '#dc2626' }">{{ tooltipActual }}</div>
        <div class="tooltip-projected" :style="{ color: '#3b82f6' }">{{ tooltipProjected }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'

interface DataPoint {
  date: string
  actual: number
  projected: number
}

interface Props {
  title?: string
  width?: number
  height?: number
  data?: DataPoint[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Area Chart',
  width: 800,
  height: 400,
  data: () => [
    { date: '2025-06-01', actual: 0, projected: 0 },
    { date: '2025-06-03', actual: 5000, projected: 8000 },
    { date: '2025-06-05', actual: 8000, projected: 15000 },
    { date: '2025-06-08', actual: 12000, projected: 25000 },
    { date: '2025-06-10', actual: 15000, projected: 35000 },
    { date: '2025-06-12', actual: 16000, projected: 45000 },
    { date: '2025-06-15', actual: 16500, projected: 55000 },
    { date: '2025-06-18', actual: 17000, projected: 65000 },
    { date: '2025-06-22', actual: 17500, projected: 75000 },
    { date: '2025-06-25', actual: 18000, projected: 85000 },
    { date: '2025-06-29', actual: 18500, projected: 95000 }
  ]
})

const svgRef = ref<SVGSVGElement>()
const containerRef = ref<HTMLDivElement>()
const tooltipRef = ref<HTMLDivElement>()
const containerWidth = ref(800)
const containerHeight = ref(400)
const tooltipVisible = ref(false)
const tooltipDate = ref('')
const tooltipActual = ref('')
const tooltipProjected = ref('')

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

  const margin = { top: 20, right: 80, bottom: 60, left: 80 }
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

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date) as [Date, Date])
    .range([0, innerWidth])

  const maxValue = Math.max(
    d3.max(data, d => d.actual) || 0,
    d3.max(data, d => d.projected) || 0
  )

  const yScale = d3.scaleLinear()
    .domain([0, maxValue * 1.1])
    .range([innerHeight, 0])

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%Y-%m-%d'))
    .ticks(5)

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => `€${(d as number).toLocaleString('it-IT')}`)

  g.selectAll('.grid-line-x')
    .data(xScale.ticks(5))
    .enter()
    .append('line')
    .attr('class', 'grid-line-x')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .style('stroke', '#e5e7eb')
    .style('stroke-width', 1)

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

  const actualArea = d3.area<any>()
    .x(d => xScale(d.date))
    .y0(innerHeight)
    .y1(d => yScale(d.actual))
    .curve(d3.curveCatmullRom)

  const actualLine = d3.line<any>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.actual))
    .curve(d3.curveCatmullRom)

  const projectedLine = d3.line<any>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.projected))
    .curve(d3.curveCatmullRom)

  const gradient1 = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'actualGradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0).attr('y1', innerHeight)
    .attr('x2', 0).attr('y2', 0)

  gradient1.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#ef4444')
    .attr('stop-opacity', 0.6)

  gradient1.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#ef4444')
    .attr('stop-opacity', 0.1)

  const gradient2 = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'projectedGradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0).attr('y1', innerHeight)
    .attr('x2', 0).attr('y2', 0)

  gradient2.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#3b82f6')
    .attr('stop-opacity', 0.3)

  gradient2.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#3b82f6')
    .attr('stop-opacity', 0.1)

  g.append('path')
    .datum(data)
    .attr('d', actualArea)
    .style('fill', 'url(#actualGradient)')


  g.append('path')
    .datum(data)
    .attr('d', actualLine)
    .style('fill', 'none')
    .style('stroke', '#dc2626')
    .style('stroke-width', 2)

  g.append('path')
    .datum(data)
    .attr('d', projectedLine)
    .style('fill', 'none')
    .style('stroke', '#3b82f6')
    .style('stroke-width', 2)
    .style('stroke-dasharray', '8,4')

  // Hover elements
  const focus = g.append('g')
    .attr('class', 'focus')
    .style('display', 'none')

  // Vertical line
  focus.append('line')
    .attr('class', 'hover-line')
    .style('stroke', '#6b7280')
    .style('stroke-width', 1)
    .style('stroke-dasharray', '3,3')
    .style('shape-rendering', 'crispEdges')

  // Point on projected line
  focus.append('circle')
    .attr('class', 'hover-point-projected')
    .attr('r', 5)
    .style('fill', '#3b82f6')
    .style('stroke', 'white')
    .style('stroke-width', 2)

  // Point on actual line
  focus.append('circle')
    .attr('class', 'hover-point-actual')
    .attr('r', 5)
    .style('fill', '#dc2626')
    .style('stroke', 'white')
    .style('stroke-width', 2)


  // Overlay for mouse events
  g.append('rect')
    .attr('class', 'overlay')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', function() {
      focus.style('display', null)
      tooltipVisible.value = true
    })
    .on('mouseout', function() {
      focus.style('display', 'none')
      tooltipVisible.value = false
    })
    .on('mousemove', function(event) {
      const bisectDate = d3.bisector((d: any) => d.date).left
      const x0 = xScale.invert(d3.pointer(event, this)[0])
      const i = bisectDate(data, x0, 1)
      const d0 = data[i - 1]
      const d1 = data[i]
      const d = d1 && x0 - d0.date > d1.date - x0 ? d1 : d0

      if (!d) return

      // Update vertical line
      focus.select('.hover-line')
        .attr('x1', xScale(d.date))
        .attr('x2', xScale(d.date))
        .attr('y1', 0)
        .attr('y2', innerHeight)

      // Update points
      focus.select('.hover-point-projected')
        .attr('cx', xScale(d.date))
        .attr('cy', yScale(d.projected))

      focus.select('.hover-point-actual')
        .attr('cx', xScale(d.date))
        .attr('cy', yScale(d.actual))

      // Update tooltip content
      tooltipDate.value = d3.timeFormat('%d/%m/%Y')(d.date)
      tooltipActual.value = `Actual: €${d.actual.toLocaleString('it-IT')}`
      tooltipProjected.value = `Projected: €${d.projected.toLocaleString('it-IT')}`

      // Position tooltip
      const xPos = xScale(d.date)
      const yPos = Math.min(yScale(d.projected), yScale(d.actual)) - 80

      if (tooltipRef.value) {
        tooltipRef.value.style.left = `${xPos}px`
        tooltipRef.value.style.top = `${yPos}px`
        tooltipRef.value.style.transform = 'translateX(-50%)'
      }
    })

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'middle')
    .attr('transform', 'rotate(-45)')
    .attr('dx', '-0.5em')
    .attr('dy', '0.5em')

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
.area-projection-chart {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.area-tooltip-html {
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
  text-align: left;
}

.tooltip-date {
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-actual,
.tooltip-projected {
  font-size: 11px;
  margin-bottom: 2px;
}
</style>