import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuMap from './MapVEuMap';
import { BoundsViewport, MarkerProps } from './Types';
import { Marker, Tooltip } from 'react-leaflet';
import './TempIconHack';
//DKDK load necessary functions/classes
import { latLng } from "leaflet";


export default {
  title: 'Map',
  component: MapVEuMap,
};


/*
   This is a trivial marker data generator.  It returns 10 random points within the given bounds.
   The real thing should something with zoomLevel.
*/
const getMarkerElements = ({ bounds, zoomLevel }: BoundsViewport, numMarkers : number) => {
  //DKDK change bounds as standard leaflet LatLngBounds
  console.log("I've been triggered with bounds=["+bounds.getSouthWest()+" TO "+bounds.getNorthEast()+"] and zoomLevel="+zoomLevel);

  return Array(numMarkers).fill(undefined).map((_, index) => {
  //DKDK change bounds as standard leaflet LatLngBounds
  const lat = bounds.getSouth() + Math.random()*(bounds.getNorth() - bounds.getSouth());
  const long = bounds.getWest() + Math.random()*(bounds.getEast() - bounds.getWest());

  console.log(latLng(lat, long))

  return (
      <Marker
        key={`marker_${index}`}
        position={latLng(lat, long)}
      >
        {/* <Popup>{latLng(lat, long).toString()}</Popup> */}
        <Tooltip>{latLng(lat, long).toString()}</Tooltip>
      </Marker>
      )
  });
}


export const Basic = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 10));
  }, [setMarkerElements])

  return (
    <MapVEuMap
    viewport={{center: [ 54.561781, -3.143297 ], zoom: 12}}
    height="100vh" width="100vw"
    onViewportChanged={handleViewportChanged}
    markers={markerElements}
    />
  );
}

