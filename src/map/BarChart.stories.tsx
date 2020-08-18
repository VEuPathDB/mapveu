import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import BarChart from './BarChart'; // TO BE CREATED

export default {
  title: 'Bar Chart',
  component: BarChart,
};

export const BarChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={700} height={500} />
  );
}

export const SmallBarChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={40} height={40} />
  );
}
