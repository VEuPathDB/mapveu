import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuMap from './MapVEuMap';
import { BoundsViewport, MarkerProps } from './Types';
import { Marker } from 'react-leaflet';
import Geohash from 'latlon-geohash';
import './TempIconHack';
//DKDK load necessary functions/classes
import { latLng } from "leaflet";

export default {
  title: 'Animated Markers',
//  component: MapVEuMap,
};

const zoomLevelToGeohashLevel = [
  1, // 0
  1, // 1
  1, // 2
  2, // 3
  2, // 4
  2, // 5
  3, // 6
  3, // 7
  3, // 8
  4, // 9
  4, // 10
  4, // 11
  5, // 12
  5, // 13
  5, // 14
  6, // 15
  6, // 16
  6, // 17
  7  // 18
];

const getMarkerElements = ({ bounds, zoomLevel }: BoundsViewport, numMarkers : number) => {
  //DKDK change bounds as standard leaflet LatLngBounds
  console.log("I've been triggered with bounds=["+bounds.getSouthWest()+" TO "+bounds.getNorthEast()+"] and zoomLevel="+zoomLevel);

  let aggsByGeohash = new Map();
  Array(numMarkers).fill(undefined).map(() => {
    //DKDK change bounds as standard leaflet LatLngBounds
    const lat = bounds.getSouth() + Math.random()*(bounds.getNorth() - bounds.getSouth());
    const long = bounds.getWest() + Math.random()*(bounds.getEast() - bounds.getWest());
    const geohash : string = Geohash.encode(lat, long, zoomLevelToGeohashLevel[zoomLevel]);

    let agg = aggsByGeohash.get(geohash);
    if (agg === undefined) {
      agg = { lat: 0, long: 0, count: 0, geohash };
      aggsByGeohash.set(geohash, agg);
    }
    agg.lat = agg.lat + lat;
    agg.long = agg.long + long;
    agg.count++;
    return undefined
  });
  return Array.from(aggsByGeohash.values()).map((agg) => {
    const meanLat = agg.lat/agg.count;
    const meanLong = agg.long/agg.count;
    return <Marker
      key={agg.geohash}
      position={latLng(meanLat, meanLong)}
      title={agg.geohash}
      />
  })

}



export const GeohashIds = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 500));
  }, [setMarkerElements])
  return (
    <MapVEuMap
    viewport={{center: [ 54.561781, -3.013297 ], zoom: 11}}
    height="100vh" width="100vw"
    onViewportChanged={handleViewportChanged}
    markers={markerElements}
    />
  );
}

