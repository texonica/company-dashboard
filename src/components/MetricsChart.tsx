// src/components/MetricsChart.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Card } from '@/components/ui/card'
import { format, isFirstDayOfMonth } from 'date-fns'
import { formatCurrencyForAxis, formatConversionsForAxis } from '@/lib/utils'

type ChartType = 'line' | 'bar'

interface ChartData {
  date: string
  index?: number // Add optional index for uniqueness
  [key: string]: any
}

interface MetricsChartProps {
  data: ChartData[]
  metrics: Array<{
    key: string
    label: string
    color: string
    format: (value: number) => string
  }>
  chartType?: ChartType
  barColors?: {
    [key: string]: (value: number) => string
  }
  hideControls?: boolean
}

export function MetricsChart({
  data,
  metrics,
  chartType: initialChartType = 'line',
  barColors,
  hideControls = false
}: MetricsChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [currentChartType, setCurrentChartType] = useState<ChartType>(initialChartType)
  
  // For backward compatibility
  const metric1 = metrics[0]
  const metric2 = metrics.length > 1 ? metrics[1] : undefined

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Setup dimensions
    const margin = { top: 20, right: 60, bottom: 40, left: 60 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create tooltip div
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)

    // Parse dates and filter labels to show only first of month
    const dates = data
      .map(d => {
        try {
          // Create and validate date object
          const date = new Date(d.date);
          // Check if date is valid
          if (isNaN(date.getTime())) {
            console.warn(`Invalid date found: ${d.date}, using current date instead`);
            return new Date(); // Fallback to current date
          }
          return date;
        } catch (e) {
          console.warn(`Error parsing date: ${d.date}`, e);
          return new Date(); // Fallback to current date
        }
      })
      .sort((a, b) => a.getTime() - b.getTime())
    
    const filteredDates = dates.filter((d, i) =>
      isFirstDayOfMonth(d) || i === 0 || i === dates.length - 1
    )

    // Calculate tick values based on data length
    const getTickValues = () => {
      if (data.length <= 14) return dates;  // Show all dates if 2 weeks or less
      if (data.length <= 31) return dates.filter((_, i) => i % 2 === 0);  // Show every other date if month or less
      return filteredDates;  // Show first of month for longer periods
    };

    // Setup scales
    const xScale = currentChartType === 'bar'
      ? d3.scaleBand()
        .domain(dates.map(d => format(d, 'MMM d')))
        .range([0, width])
        .padding(0.2)
      : d3.scaleTime()
        .domain(d3.extent(dates) as [Date, Date])
        .range([0, width])

    const xGroupScale = currentChartType === 'bar'
      ? d3.scaleBand()
        .domain(metrics.map((_, i) => `metric${i + 1}`))
        .range([0, (xScale as d3.ScaleBand<string>).bandwidth()])
        .padding(0.1)
      : null

    // Create Y-scales for each metric
    const yScales = metrics.map(metric => {
      return d3.scaleLinear()
        .domain([0, d3.max(data, d => d[metric.key] as number) || 0])
        .range([height, 0])
        .nice()
    })

    // Helper function to format y-axis ticks
    const formatYAxisTick = (d: number, key: string) => {
      // Check if the metric is cost or value (currency)
      if (key.includes('cost') || key.includes('value') || key.includes('CPC') || key.includes('CPA') || key.includes('AOV')) {
        return formatCurrencyForAxis(d, '$')
      }
      // Check if the metric is conversions
      else if (key.includes('conv')) {
        return formatConversionsForAxis(d)
      }
      // For percentage metrics
      else if (key.includes('CTR') || key.includes('CvR') || key.includes('imprShare') || key.includes('lost')) {
        return `${Math.round(d)}%`
      }
      // For other metrics (impressions, clicks)
      return d.toLocaleString('en-US', { maximumFractionDigits: 0 })
    }

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        currentChartType === 'bar'
          ? d3.axisBottom(xScale as d3.ScaleBand<string>)
            .tickValues(getTickValues().map(d => format(d, 'MMM d')))
          : d3.axisBottom(xScale as d3.ScaleTime<number, number>)
            .tickFormat(d => format(d as Date, 'MMM d'))
            .tickValues(getTickValues())
      )
      .call(g => g.select('.domain').attr('stroke', '#cbd5e1'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#cbd5e1'))
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#64748b')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)'))

    // Add primary Y-axis (first metric)
    svg.append('g')
      .call(d3.axisLeft(yScales[0])
        .ticks(5)
        .tickFormat(d => formatYAxisTick(d as number, metrics[0].key)))
      .call(g => g.select('.domain').attr('stroke', '#cbd5e1'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#cbd5e1'))
      .call(g => g.selectAll('.tick text').attr('fill', '#64748b'))

    // Add secondary Y-axis if we have more than one metric
    if (metrics.length > 1) {
      svg.append('g')
        .attr('transform', `translate(${width},0)`)
        .call(d3.axisRight(yScales[1])
          .ticks(5)
          .tickFormat(d => formatYAxisTick(d as number, metrics[1].key)))
        .call(g => g.select('.domain').attr('stroke', '#cbd5e1'))
        .call(g => g.selectAll('.tick line').attr('stroke', '#cbd5e1'))
        .call(g => g.selectAll('.tick text').attr('fill', '#64748b'))
    }

    if (currentChartType === 'line') {
      // Add lines for each metric
      metrics.forEach((metric, i) => {
        const line = d3.line<ChartData>()
          .x(d => (xScale as d3.ScaleTime<number, number>)(new Date(d.date)))
          .y(d => yScales[i](d[metric.key] as number))
          .defined(d => d[metric.key] !== null) // Skip null values to create breaks in the line

        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', metric.color)
          .attr('stroke-width', 2)
          .attr('d', line as any) // Type assertion needed due to d3 typing limitations
      })

      // Add invisible circles for tooltip interactions for each metric
      metrics.forEach((metric, metricIndex) => {
        svg.selectAll(`.dot-metric${metricIndex + 1}`)
          .data(data.filter(d => d[metric.key] !== null))
          .join('circle')
          .attr('class', `dot-metric${metricIndex + 1}`)
          .attr('cx', d => (xScale as d3.ScaleTime<number, number>)(new Date(d.date)))
          .attr('cy', d => yScales[metricIndex](d[metric.key] as number))
          .attr('r', 5)
          .attr('fill', 'transparent')
          .attr('stroke', 'transparent')
          .attr('stroke-width', 2)
          .on('mouseover', (event, d) => {
            tooltip.transition()
              .duration(200)
              .style('opacity', 0.9)
            
            // Create tooltip content showing all metrics for this date
            let tooltipContent = `<div style="font-weight: bold">${format(new Date(d.date), 'MMM d, yyyy')}</div>`;
            
            // Add each selected metric to the tooltip
            metrics.forEach(m => {
              tooltipContent += `<div style="color: ${m.color}">${m.label}: ${m.format(d[m.key])}</div>`;
            });
            
            tooltip.html(tooltipContent)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 28) + 'px')
            
            // Highlight the current dot
            d3.select(event.currentTarget)
              .attr('fill', metric.color)
              .attr('stroke', '#fff')
              .attr('r', 6)
          })
          .on('mouseout', (event) => {
            tooltip.transition()
              .duration(500)
              .style('opacity', 0)
            
            // Restore the dot appearance
            d3.select(event.currentTarget)
              .attr('fill', 'transparent')
              .attr('stroke', 'transparent')
              .attr('r', 5)
          })
      })
    } else {
      // Bar chart implementation
      const bars = svg.append('g')
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('transform', d => `translate(${(xScale as d3.ScaleBand<string>)(format(new Date(d.date), 'MMM d'))},0)`)

      // Add bars for each metric
      metrics.forEach((metric, i) => {
        bars.append('rect')
          .attr('x', () => xGroupScale!(`metric${i + 1}`) || 0)
          .attr('y', d => yScales[i](d[metric.key] as number))
          .attr('width', xGroupScale!.bandwidth())
          .attr('height', d => height - yScales[i](d[metric.key] as number))
          .attr('fill', d => barColors?.[metric.key]?.((d as ChartData)[metric.key] as number) || metric.color)
          .attr('opacity', 0.8)
          .on('mouseover', (event, d) => {
            tooltip.transition()
              .duration(200)
              .style('opacity', 0.9)
            
            // Create tooltip content
            let tooltipContent = `<div style="font-weight: bold">${format(new Date(d.date), 'MMM d, yyyy')}</div>`;
            
            // Add each selected metric to the tooltip
            metrics.forEach(m => {
              tooltipContent += `<div style="color: ${m.color}">${m.label}: ${m.format(d[m.key])}</div>`;
            });
            
            tooltip.html(tooltipContent)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 28) + 'px')
          })
          .on('mouseout', () => {
            tooltip.transition()
              .duration(500)
              .style('opacity', 0)
          })
      })
    }

    // Create a legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, -20)`)

    metrics.forEach((metric, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i * 120}, 0)`)
      
      legendItem.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', metric.color)
      
      legendItem.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('fill', '#64748b')
        .text(metric.label)
    })

    // Cleanup on component unmount
    return () => {
      tooltip.remove()
    }
  }, [data, metrics, currentChartType, barColors])

  // Chart type toggle
  const handleToggleChartType = () => {
    setCurrentChartType(currentChartType === 'line' ? 'bar' : 'line')
  }

  return (
    <Card className="p-4">
      {!hideControls && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleChartType}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded"
            >
              {currentChartType === 'line' ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
            </button>
          </div>
        </div>
      )}
      <svg
        ref={svgRef}
        className="w-full"
        height={400}
        style={{ overflow: 'visible' }}
      ></svg>
    </Card>
  )
}