/* global d3 */

// adapted from http://bl.ocks.org/juan-cb/c2f3329d3fb3b8e4f7ff

exports.barChart = function barChart() {
  const dataset = [
    {
      label: 'Men',
      'Not Satisfied': 20,
      'Not Much Satisfied': 10,
      Satisfied: 50,
      'Very Satisfied': 20,
    },
    {
      label: 'Women',
      'Not Satisfied': 15,
      'Not Much Satisfied': 30,
      Satisfied: 40,
      'Very Satisfied': 15,
    },
  ];

  const parentDiv = 'divChart';
  const parentDivSelector = `#${parentDiv}`;

  function verticalWrap(textParm, width) {
    textParm.each(function eachCb() {
      const text = d3.select(this);
      const words = text
        .text()
        .split(/\s+/)
        .reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const y = text.attr('y');
      const x = text.attr('x');
      const dy = parseFloat(text.attr('dy'));
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', `${dy}em`);
      // eslint-disable-next-line no-cond-assign
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          lineNumber += 1;
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', `${(lineNumber * lineHeight) + dy}em`)
            .text(word);
        }
      }
    });
  }

  const margin = {
    top: parseInt(d3.select(parentDivSelector).style('height'), 10) / 20,
    right: parseInt(d3.select(parentDivSelector).style('width'), 10) / 20,
    bottom: parseInt(d3.select(parentDivSelector).style('height'), 10) / 20,
    left: parseInt(d3.select(parentDivSelector).style('width'), 10) / 10,
  };
  const width =
    parseInt(d3.select(parentDivSelector).style('width'), 10) -
    margin.left -
    margin.right;
  const height =
    parseInt(d3.select(parentDivSelector).style('height'), 10) -
    margin.top -
    margin.bottom;

  const y0 = d3.scale.ordinal().rangeRoundBands([height, 0], 0.2, 0.5);

  const y1 = d3.scale.ordinal();

  const x = d3.scale.linear().range([0, width]);

  const colorRange = d3.scale.category20();
  const color = d3.scale.ordinal().range(colorRange.range());

  const xAxis = d3.svg
    .axis()
    .scale(x)
    .tickSize(-height)
    .orient('bottom');

  const yAxis = d3.svg
    .axis()
    .scale(y0)
    .orient('left');
  // .tickFormat(d3.format(".2s"));

  const divTooltip = d3
    .select(parentDivSelector)
    .append('div')
    .attr('class', 'toolTip');

  const svg = d3
    .select(parentDivSelector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const options = d3.keys(dataset[0]).filter(key => key !== 'label');

  dataset.forEach((d) => {
    // eslint-disable-next-line no-param-reassign
    d.valores = options.map(name => ({ name, value: +d[name] }));
  });

  y0.domain(dataset.map(d => d.label));
  y1.domain(options).rangeRoundBands([0, y0.rangeBand()]);
  x.domain([0, d3.max(dataset, d => d3.max(d.valores, d1 => d1.value))]);

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis);
  /*
  .append("text")
  .attr("transform", "rotate(0)")
  .attr("x", 60)
  .attr("dx", ".71em")
  .style("text-anchor", "end")
  .text("Satisfaction %");
  */

  svg.selectAll('.y.axis .tick text').call(verticalWrap, y0.rangeBand());

  const bar = svg
    .selectAll('.bar')
    .data(dataset)
    .enter()
    .append('g')
    .attr('class', 'rect')
    .attr('transform', d => `translate( 0,${y0(d.label)})`);

  const barEnter = bar
    .selectAll('rect')
    .data(d => d.valores)
    .enter();

  barEnter
    .append('rect')
    .attr('height', y1.rangeBand())
    .attr('y', d => y1(d.name))
    .attr('x', () => 0)
    .attr('value', d => d.name)
    .attr('width', d => x(d.value))
    .style('fill', d => color(d.name));

  barEnter
    .append('text')
    .attr('x', d => x(d.value) + 5)
    .attr('y', d => y1(d.name) + (y1.rangeBand() / 2))
    .attr('dy', '.35em')
    .text(d => d.value);

  bar.on('mousemove', (d) => {
    const parentDivEl = document.getElementById(parentDiv);
    divTooltip.style(
      'left',
      `${(d3.event.pageX - parentDivEl.offsetLeft) + 10}px`,
    );
    divTooltip.style('top', `${d3.event.pageY - parentDivEl.offsetTop - 25}px`);
    divTooltip.style('display', 'inline-block');
    // // eslint-disable-next-line no-unused-vars
    // const x2 = d3.event.pageX;
    // // eslint-disable-next-line no-unused-vars
    // const y2 = d3.event.pageY;
    const elements = document.querySelectorAll(':hover');
    let l = elements.length;
    l -= 1;
    // eslint-disable-next-line no-underscore-dangle
    const elementData = elements[l].__data__;
    divTooltip.html(
      `${d.label}<br>${elementData.name}<br>${elementData.value}%`,
    );
  });
  bar.on('mouseout', () => {
    divTooltip.style('display', 'none');
  });

  const legend = svg
    .selectAll('.legend')
    .data(options.slice())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => `translate(0,${i * 20})`);

  legend
    .append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', color);

  legend
    .append('text')
    .attr('x', width - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(d => d);
};
