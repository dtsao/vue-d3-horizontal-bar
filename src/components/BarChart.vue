<template>
  <div id="divChart"></div>
</template>

<script>
  const BarChart = require('./BarChart.js');

  export default {
    name: 'bar-chart',
    mounted() {
      BarChart.barChart();
    },
  };
</script>


<style>
  /* Don't use scoped styles since the contents of divChart is controlled by the d3 code, not Vue.js
  /* adapted from http://bl.ocks.org/juan-cb/c2f3329d3fb3b8e4f7ff */

  #divChart {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    width: 960px;
    height: 500px;
    position: relative;
  }

  svg {
    width: 100%;
    height: 100%;
    position: center;
  }

  .toolTip {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    position: absolute;
    display: none;
    width: auto;
    height: auto;
    background: none repeat scroll 0 0 white;
    border: 0 none;
    border-radius: 8px 8px 8px 8px;
    box-shadow: -3px 3px 15px #888888;
    color: black;
    font: 12px sans-serif;
    padding: 5px;
    text-align: center;
  }

  .legend {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 60%;
  }

  text {
    font: 10px sans-serif;
  }

  .axis text {
    font: 10px sans-serif;
  }

  .axis path {
    fill: none;
    stroke: #000;
  }

  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .axis .tick line {
    stroke-width: 1;
    stroke: rgba(0, 0, 0, 0.2);
  }

  .x.axis path {
    display: none;
  }
</style>
