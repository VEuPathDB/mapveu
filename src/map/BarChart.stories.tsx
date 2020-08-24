import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import BarChart from './BarChart'; // TO BE CREATED

export default {
  title: 'Bar Chart',
  component: BarChart,
};

export const HighchartsBarChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={700} height={500} yRange={[0, 5]} type='bar' library='highcharts' />
  );
}

export const SmallHighchartsBarChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={40} height={40} yRange={[0, 5]} type='bar' library='highcharts' />
  );
}

export const PlotlyBarChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={700} height={500} yRange={[0, 5]} type='bar' library='plotly' />
  );
}

export const SmallPlotlyBarChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={40} height={40} yRange={[0, 5]} type='bar' library='plotly' />
  );
}

export const HighchartsLineChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={700} height={500} yRange={[0, 5]} type='line' library='highcharts' />
  );
}

export const SmallHighchartsLineChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={40} height={40} yRange={[0, 5]} type='line' library='highcharts' />
  );
}

export const PlotlyLineChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={700} height={500} yRange={[0, 5]} type='line' library='plotly' />
  );
}

export const SmallPlotlyLineChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={40} height={40} yRange={[0, 5]} type='line' library='plotly' />
  );
}
