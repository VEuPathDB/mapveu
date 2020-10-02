import React from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuApp from './MapVEuApp';


export default {
  title: 'Trivial App',
  component: MapVEuApp,
};


export const Basic = () => {

  return (
    <MapVEuApp
      datasetName='my_favourite_dataset'
    />
  );
}

