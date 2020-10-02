import React, { useState, useCallback, ReactElement } from "react";
import MapVEuMap from './MapVEuMap';
import InfoPanel from './InfoPanel';
import { BoundsViewport, GeoBBox, MarkerProps } from './Types';
import geohashAnimation from "./animation_functions/geohash";
import Geohash from 'latlon-geohash';
import {DriftMarker} from "leaflet-drift-marker";
import { Tooltip } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import './TempIconHack';

/*
   Deterministic random clumpy datapoints, geohashed!
*/

const zoomLevelToGeohashLevel = [
  1, // 0
  1, // 1
  1, // 2
  1, // 3
  2, // 4
  2, // 5
  2, // 6
  3, // 7
  3, // 8
  3, // 9
  4, // 10
  4, // 11
  4, // 12
  5, // 13
  5, // 14
  5, // 15
  6, // 16
  6, // 17
  7  // 18
];

const getMarkerElements = (datasetName : string, { bounds, zoomLevel }: BoundsViewport, numMarkers : number, duration : number, onMarkerClick : (e : LeafletMouseEvent) => void) => {
  console.log(`I'm pretending to get data from ${datasetName}`);

  let aggsByGeohash = new Map();

  // https://gist.github.com/mathiasbynens/5670917
  // Here’s a 100% deterministic alternative to `Math.random`. Google’s V8 and
  // Octane benchmark suites use this to ensure predictable results.

  let myRandom = (function() {
    var seed = 0x2F6E2B1;
    return function() {
      // Robert Jenkins’ 32 bit integer hash function
      seed = ((seed + 0x7ED55D16) + (seed << 12))  & 0xFFFFFFFF;
      seed = ((seed ^ 0xC761C23C) ^ (seed >>> 19)) & 0xFFFFFFFF;
      seed = ((seed + 0x165667B1) + (seed << 5))   & 0xFFFFFFFF;
      seed = ((seed + 0xD3A2646C) ^ (seed << 9))   & 0xFFFFFFFF;
      seed = ((seed + 0xFD7046C5) + (seed << 3))   & 0xFFFFFFFF;
      seed = ((seed ^ 0xB55A4F09) ^ (seed >>> 16)) & 0xFFFFFFFF;
      return (seed & 0xFFFFFFF) / 0x10000000;
    };
  }());

  let lats : number[] = [];
  let longs : number[] = [];

  Array(numMarkers).fill(undefined).map(() => {
    const geohashLevel = zoomLevelToGeohashLevel[zoomLevel];

    // pick a deterministic point anywhere on the globe (hence a large value for numMarkers)
    let lat = -90 + myRandom()*180;
    let long = -180 + myRandom()*360;

    // move some points closer to a randomly picked previous point
    if (lats.length > 0 && myRandom()<0.75) {
      const idx = Math.floor(myRandom()*lats.length);
      lat = lat + (lats[idx]-lat)*0.999;
      long = long + (longs[idx]-long)*0.999;
    }

    // is it within the viewport bounds?
    if (lat > bounds.southWest[0] &&
	lat < bounds.northEast[0] &&
	long > bounds.southWest[1] &&
	long < bounds.northEast[1]) {
      const geohash : string = Geohash.encode(lat, long, geohashLevel);

      let agg = aggsByGeohash.get(geohash);
      if (agg === undefined) {
	agg = { lat: 0, long: 0, count: 0, geohash };
	aggsByGeohash.set(geohash, agg);
      }
      agg.lat = agg.lat + lat;
      agg.long = agg.long + long;
      agg.count++;
    }
    lats.push(lat);
    longs.push(long);
    return undefined
  });

  return Array.from(aggsByGeohash.values()).map((agg) => {
    const meanLat = agg.lat/agg.count;
    const meanLong = agg.long/agg.count;
    const key = agg.geohash; // scrambleKeys ? md5(agg.geohash).substring(0, zoomLevel) : agg.geohash;


    // typescript error for the onClick prop below ... works but needs addressing
    return <DriftMarker
        duration={duration}
        key={key}
        position={[meanLat, meanLong]}
        onClick={onMarkerClick}> 
        <Tooltip>
          <span>{`key: ${key}`}</span><br/>
	      <span>{`#aggregated: ${agg.count}`}</span><br/>
          <span>{`lat: ${meanLat}`}</span><br/>
          <span>{`lon: ${meanLong}`}</span>
        </Tooltip>
      </DriftMarker>

  })
};



/**
 * A simple app component to do some testing with.
 * 
 * 
 */

interface MapVEuAppProps {
  datasetName : string;
}

export default function MapVEuApp({ datasetName } : MapVEuAppProps) {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const [ bounds, setBounds ] = useState<GeoBBox>();
  
  const [ selectedMarkers, setSelectedMarkers ] = useState<string[]>([]);
  const handleMarkerClick = useCallback((e : LeafletMouseEvent) => {
    console.log(e.target);
    setSelectedMarkers([ e.target._leaflet_id ]); // this is very crude - doesn't handle multiple selection or anything
                                                  // also it fails to get the geohash_id from the element
  }, [setSelectedMarkers]);

  const handleViewportChanged = useCallback((bvp: BoundsViewport, duration: number) => {
    setMarkerElements(getMarkerElements(datasetName, bvp, 100000, duration, handleMarkerClick));
    setBounds(bvp.bounds);
  }, [setMarkerElements, setBounds]);


  
  return (
    <div>
      <InfoPanel
        datasetName={datasetName}
        bounds={bounds}
        selectedMarkers={selectedMarkers}
      />
    
      <MapVEuMap
	viewport={{center: [ 53, 9.5 ], zoom: 6}}
	height="400px" width="96vw"
	onViewportChanged={handleViewportChanged}
        markers={markerElements}
        animation={{
	  method: "geohash",
	  duration: 300,
	  animationFunction: geohashAnimation
	}}
      />

    </div>
  );
}
