<template>
  <div class="mixed-chart">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <svg ref="svgRef" :width="width" :height="height"></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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

const drawChart = () => {
  if (!svgRef.value) return

  d3.select(svgRef.value).selectAll('*').remove()

  const margin = { top: 20, right: 80, bottom: 80, left: 80 }
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

  const barGradientPositive = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'barGradientPositive')
    .attr('x1', '0%').attr('y1', '0%')
    .attr('x2', '100%').attr('y2', '100%')

  barGradientPositive.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#22c55e')

  barGradientPositive.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#16a34a')

  const barGradientNegative = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'barGradientNegative')
    .attr('x1', '0%').attr('y1', '0%')
    .attr('x2', '100%').attr('y2', '100%')

  barGradientNegative.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#ef4444')

  barGradientNegative.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#dc2626')

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
    .style('fill', d => d.barType === 'positive' ? 'url(#barGradientPositive)' : 'url(#barGradientNegative)')
    .style('stroke', d => d.barType === 'positive' ? '#16a34a' : '#dc2626')
    .style('stroke-width', 1)

  g.selectAll('.bar-shadow')
    .data(barsData)
    .enter()
    .append('rect')
    .attr('class', 'bar-shadow')
    .attr('x', (d) => {
      const originalIndex = data.findIndex(item => item.date.getTime() === d.date.getTime())
      return xScale(originalIndex.toString())! + xScale.bandwidth() + 2
    })
    .attr('y', d => yScale(d.barValue) + 4)
    .attr('width', 6)
    .attr('height', d => innerHeight - yScale(d.barValue))
    .style('fill', '#00000020')

  g.selectAll('.bar-top')
    .data(barsData)
    .enter()
    .append('polygon')
    .attr('class', 'bar-top')
    .attr('points', (d) => {
      const originalIndex = data.findIndex(item => item.date.getTime() === d.date.getTime())
      const x = xScale(originalIndex.toString())!
      const y = yScale(d.barValue)
      const w = xScale.bandwidth()
      return `${x},${y} ${x + w},${y} ${x + w + 6},${y - 4} ${x + 6},${y - 4}`
    })
    .style('fill', d => d.barType === 'positive' ? '#22c55e' : '#ef4444')
    .style('stroke', d => d.barType === 'positive' ? '#16a34a' : '#dc2626')
    .style('stroke-width', 1)

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
    .style('stroke', 'white')
    .style('stroke-width', 2)

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

  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${innerWidth - 150}, 20)`)

  const legendData = [
    { label: 'Bars (Positive)', color: '#22c55e', type: 'bar' },
    { label: 'Bars (Negative)', color: '#ef4444', type: 'bar' },
    { label: 'Line', color: '#3b82f6', type: 'line' }
  ]

  const legendItems = legend.selectAll('.legend-item')
    .data(legendData)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (_, i) => `translate(0, ${i * 25})`)

  legendItems.each(function(d) {
    const item = d3.select(this)
    if (d.type === 'bar') {
      item.append('rect')
        .attr('width', 15)
        .attr('height', 10)
        .style('fill', d.color)
    } else {
      item.append('line')
        .attr('x1', 0)
        .attr('x2', 15)
        .attr('y1', 5)
        .attr('y2', 5)
        .style('stroke', d.color)
        .style('stroke-width', 3)
    }
  })

  legendItems.append('text')
    .attr('x', 20)
    .attr('y', 8)
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
.mixed-chart {
  background: white;
  border-radius: 8px;
  padding: 16px;
}
</style>