/* global d3 data */
var margin = {top: 100,
  right: 20,
  bottom: 30,
  left: 350}

var width = 1000 - margin.left - margin.right
var height = 500 - margin.top - margin.bottom

var x = d3.scaleLinear()
  .range([0, width])

var y = d3.scaleLinear()
  .range([height, 0])

var r = d3.scaleSqrt()
  .range([2, 10])

var xAxis = d3.axisBottom()
  .scale(x)

var yAxis = d3.axisLeft()
  .scale(y)

var color = d3.scaleOrdinal(d3.schemeCategory20)

var svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

x.domain(d3.extent(data, function (d) {
  console.log(d + 'x domain')
  return d.sepal_length
})).nice()

y.domain(d3.extent(data, function (d) {
  return d.sepal_width
})).nice()

r.domain(d3.extent(data, function (d) {
  return d.petal_length
})).nice()

svg.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .attr('class', 'x axis')
  .call(xAxis)

svg.append('g')
  .attr('transform', 'translate(0,0)')
  .attr('class', 'y axis')
  .call(yAxis)

svg.append('text')
  .attr('x', 10)
  .attr('y', 10)
  .attr('class', 'label')
  .text('Sepal Width')

svg.append('text')
  .attr('x', width)
  .attr('y', height - 10)
  .attr('text-anchor', 'end')
  .attr('class', 'label')
  .text('Sepal Length')

function log (sel, msg) {
  console.log(msg, sel)
}

svg.selectAll('.dot')
  .data(data)
  .call(log, 'data')
  .enter().append('circle')
  .attr('class', 'dot')
  .attr('r', function (d) { return r(d.petal_length) })
  .attr('cx', function (d) { return x(d.sepal_length) })
  .attr('cy', function (d) { return y(d.sepal_width) })
  .style('fill', function (d) { return color(d.species) })
  .on('mouseover', function (d) {
    tooltip.transition()
      .duration(0)
      .style('opacity', 0.9)
    tooltip.html('Species:' + d.species)
      .style('left', (d3.event.pageX + 5) + 'px')
      .style('top', (d3.event.pageY - 28) + 'px')
  })
  .on('mouseout', function (d) {
    tooltip.transition()
      .duration(500)
      .style('opacity', 0)
  })

var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter().append('g')
  .attr('class', 'legend')
  .attr('transform', function (d, i) { return 'translate(0,' + i * 20 + ')' })

legend.append('rect')
  .attr('x', width - 18)
  .attr('width', 18)
  .attr('height', 18)
  .style('fill', color)

legend.append('text')
  .attr('x', width - 24)
  .attr('y', 9)
  .attr('dy', '.35em')
  .style('text-anchor', 'end')
  .text(function (d) { return d })
