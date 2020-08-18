import React from 'react';
import Plot from 'react-plotly.js';

interface BarChartProps {
  labels: string[],
  values: number[],
  width: number,
  height: number,
}

/**
 * A simple, unlabeled bar chart
 * 
 * @param props
 */
export default function BarChart(props: BarChartProps) {
  let data = [
    {
      x: props.labels,
      y: props.values,
      type: 'bar',
      marker: {
        color: '#7cb5ec',
      },
    },
  ];

  let layout = {
    // Temporarily setting width/height through props
    width: props.width,
    height: props.height,
    xaxis: {
      visible: false,
    },
    yaxis: {
      visible: false,
    },
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
    },
  };

  let config = {
    staticPlot: true
  };

  return (
    <Plot data={data} layout={layout} config={config}></Plot>
  )
}
