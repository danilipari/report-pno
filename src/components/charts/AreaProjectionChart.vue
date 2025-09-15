<template>
  <div class="area-projection-chart">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <svg ref="svgRef" :width="width" :height="height"></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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

const drawChart = () => {
  if (!svgRef.value) return

  d3.select(svgRef.value).selectAll('*').remove()

  const margin = { top: 20, right: 80, bottom: 60, left: 80 }
  const innerWidth = props.width - margin.left - margin.right
  const innerHeight = props.height - margin.top - margin.bottom

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

  const projectedArea = d3.area<any>()
    .x(d => xScale(d.date))
    .y0(innerHeight)
    .y1(d => yScale(d.projected))
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

  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${innerWidth - 150}, 20)`)

  const legendData = [
    { label: 'Actual', color: '#dc2626', dasharray: 'none' },
    { label: 'Projected', color: '#3b82f6', dasharray: '8,4' }
  ]

  const legendItems = legend.selectAll('.legend-item')
    .data(legendData)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 25})`)

  legendItems.append('line')
    .attr('x1', 0)
    .attr('x2', 20)
    .attr('y1', 0)
    .attr('y2', 0)
    .style('stroke', d => d.color)
    .style('stroke-width', 2)
    .style('stroke-dasharray', d => d.dasharray)

  legendItems.append('text')
    .attr('x', 25)
    .attr('y', 5)
    .text(d => d.label)
    .style('font-size', '12px')
    .style('fill', '#374151')

}

onMounted(() => {
  drawChart()
})

watch(() => props.data, () => {
  drawChart()
}, { deep: true })
</script>

<style scoped>
.area-projection-chart {
  background: white;
  border-radius: 8px;
  padding: 16px;
}
</style>