import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import BarChart from './BarChart'; // TO BE CREATED

export default {
  title: 'Bar Chart',
  component: BarChart,
};

export const BarChartStory = () => {
  return (
    <BarChart labels={['America', 'Europe', 'Africa']} values={[3, 1, 4]} width={100} height={100} />
  );
}
