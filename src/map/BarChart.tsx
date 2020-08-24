import React from 'react';
import Plot from 'react-plotly.js';
import ReactHighcharts from 'react-highcharts';

interface BarChartProps {
  labels: string[],
  values: number[],
  yRange: [number, number],
  width: number,
  height: number,
  type: 'bar' | 'line',
  library: 'highcharts' | 'plotly',
}

/**
 * A simple, unlabeled bar chart
 * 
 * @param props
 */
export default function BarChart(props: BarChartProps) {
  let element: JSX.Element;

  if (props.library === 'plotly') {
    let typeProps;

    if (props.type === 'bar') {
      typeProps = {
        type: 'bar',
      };
    }
    else if (props.type === 'line') {
      typeProps = {
        type: 'scatter',
        mode: 'lines',
      };
    }

    let data = [
      {
        x: props.labels,
        y: props.values,
        marker: {
          color: '#7cb5ec',
        },
        ...typeProps
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
        range: props.yRange,
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
  
    element = <Plot data={data} layout={layout} config={config}></Plot>;
  }

  else if (props.library === 'highcharts') {
    let type;

    if (props.type === 'bar') {
      type = 'column';
    } else {
      type = props.type;
    }

    let config = {
      chart: {
        type: type,
        width: props.width,
        height: props.height,
        margin: 0,
      },
      title: {
        text: undefined,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      xAxis: {
        categories: props.labels,
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      series: [{
        data: props.values,
      }],
      credits: {
        enabled: false,
      },
      plotOptions: {
        column: {
            groupPadding: 0.025,
        },
        series: {
          animation: false,
          marker: {
            enabled: false,
          },
          enableMouseTracking: false,
        }
      },
    }

    element = <ReactHighcharts config={config}></ReactHighcharts>;
  }

  return element;
}
