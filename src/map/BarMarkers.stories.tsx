import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuMap from './MapVEuMap';
import { BoundsViewport, MarkerProps } from './Types';
import BarMarker from './BarMarker'; // TO BE CREATED

export default {
  title: 'Bar Markers',
  component: MapVEuMap,
};

/*
   This is a trivial marker data generator.  It returns 10 random points within the given bounds.
   The real thing should something with zoomLevel.
*/
const getMarkerElements = ({ bounds, zoomLevel }: BoundsViewport, numMarkers : number, numCategories : number) => {
  console.log("I've been triggered with bounds=["+bounds.southWest+" TO "+bounds.northEast+"] and zoom="+zoomLevel);
  return Array(numMarkers).fill(undefined).map((_, index) => {
    const lat = bounds.southWest[0] + Math.random()*(bounds.northEast[0] - bounds.southWest[0]);
    const long = bounds.southWest[1] + Math.random()*(bounds.northEast[1] - bounds.southWest[1]);

    const labels = Array(numCategories).fill(0).map((_, index) => 'category_'+index);
    const values = Array(numCategories).fill(0).map(() => Math.floor(Math.random()*100.0));

    return <BarMarker
      key={`marker_${index}`}
      id={`marker_${index}`}
      position={[lat, long]}
      labels={labels}
      values={values}
    />
  });
}


export const ThreeCategories = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 10, 3));
  }, [setMarkerElements])

  return (
    <MapVEuMap
        viewport={{center: [ 54.561781, -3.143297 ], zoom: 12}}
        height="600px" width="800px"
        onViewportChanged={handleViewportChanged}
        markers={markerElements}
    />
  );
}
