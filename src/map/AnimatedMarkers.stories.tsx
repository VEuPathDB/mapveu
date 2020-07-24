import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuMap from './MapVEuMap';
import { BoundsViewport, MarkerProps } from './Types';
import { Marker } from 'react-leaflet';
import Geohash from 'latlon-geohash';
import './TempIconHack';


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
  console.log("I've been triggered with bounds=["+bounds.southWest+" TO "+bounds.northEast+"] and zoom="+zoomLevel);
  let aggsByGeohash = new Map();
  Array(numMarkers).fill(undefined).map(() => {
    const lat = bounds.southWest[0] + Math.random()*(bounds.northEast[0] - bounds.southWest[0]);
    const long = bounds.southWest[1] + Math.random()*(bounds.northEast[1] - bounds.southWest[1]);
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
      position={[meanLat, meanLong]}
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
    height="600px" width="800px"
    onViewportChanged={handleViewportChanged}
    markers={markerElements}
    />
  );
}

