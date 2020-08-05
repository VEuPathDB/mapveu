import React from 'react';
import ReactHighcharts from 'react-highcharts';

interface BarChartProps {
    labels: string[],
    values: number[],
}

export default function BarChart(props: BarChartProps) {
    let config = {
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: props.labels,
        },
        series: [{
            data: props.values,
        }]
    }

    return (
        <ReactHighcharts config={config}></ReactHighcharts>
    )
}
