import React from 'react';
import ReactHighcharts from 'react-highcharts';

interface BarChartProps {
    labels: string[],
    values: number[],
    width: number,
    height: number,
}

export default function BarChart(props: BarChartProps) {
    let config = {
        chart: {
            type: 'column',
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
	    }
        }
    }

    return (
        <ReactHighcharts config={config}></ReactHighcharts>
    )
}
