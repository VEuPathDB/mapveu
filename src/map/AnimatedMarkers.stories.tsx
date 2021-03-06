import React, { ReactElement, useState, useCallback } from 'react';
import MapVEuMap from './MapVEuMap';
import { BoundsViewport, MarkerProps } from './Types';
import { Tooltip } from 'react-leaflet';
import Geohash from 'latlon-geohash';
import './TempIconHack';
import {DriftMarker} from "leaflet-drift-marker";
import geohashAnimation from "./animation_functions/geohash";
import md5 from 'md5';
import { zoomLevelToGeohashLevel, defaultAnimationDuration } from './config/map.json';

export default {
  title: 'Animated Markers',
//  component: MapVEuMap,
};


//
// when we implement the donut and histogram markers as DriftMarkers
// maybe we can access the duration from context inside those components
// in the meantime we will have to pass the duration into the getMarkerElements function
//
const getMarkerElements = ({ bounds, zoomLevel }: BoundsViewport, numMarkers : number, duration : number, scrambleKeys: boolean = false) => {
  console.log("I've been triggered with bounds=["+bounds.southWest+" TO "+bounds.northEast+"] and zoom="+zoomLevel);

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
    if (lat > bounds.southWest.lat &&
	lat < bounds.northEast.lat &&
	long > bounds.southWest.lng &&
	long < bounds.northEast.lng) {
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
    const key = scrambleKeys ? md5(agg.geohash).substring(0, zoomLevel) : agg.geohash;
    return <DriftMarker
        duration={duration}
        key={key}
        position={[meanLat, meanLong]}>
        <Tooltip>
          <span>{`key: ${key}`}</span><br/>
	      <span>{`#aggregated: ${agg.count}`}</span><br/>
          <span>{`lat: ${meanLat}`}</span><br/>
          <span>{`lon: ${meanLong}`}</span>
        </Tooltip>
      </DriftMarker>

  })

};

export const GeohashIds = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const duration = defaultAnimationDuration;
  
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 100000, duration));
  }, [setMarkerElements]);

  return (
    <MapVEuMap
    viewport={{center: [ 20, -3 ], zoom: 6}}
    height="96vh" width="98vw"
    onViewportChanged={handleViewportChanged}
    markers={markerElements}
    animation={{
      method: "geohash",
      animationFunction: geohashAnimation,
      duration
    }}
    showGrid={true}
    />
  );
};

export const SlowAnimation = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const duration = 2000;
  
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 100000, duration));
  }, [setMarkerElements]);

  return (
    <MapVEuMap
      viewport={{center: [ 20, -3 ], zoom: 6}}
      height="96vh" width="98vw"
      onViewportChanged={handleViewportChanged}
      markers={markerElements}
      animation={{
	      method: "geohash",
	      animationFunction: geohashAnimation,
	      duration
      }}
      showGrid={true}
    />
  );
};

export const NoGrid = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const duration = defaultAnimationDuration;
  
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 100000, duration));
  }, [setMarkerElements]);

  return (
      <MapVEuMap
          viewport={{center: [ 20, -3 ], zoom: 6}}
          height="96vh" width="98vw"
          onViewportChanged={handleViewportChanged}
          markers={markerElements}
          animation={{
            method: "geohash",
            animationFunction: geohashAnimation,
            duration,
          }}
          showGrid={false}
      />
  );
};



export const NoAnimation = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const duration = defaultAnimationDuration;
  
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 100000, duration));
  }, [setMarkerElements]);

  return (
    <MapVEuMap
      viewport={{center: [ 20, -3 ], zoom: 6}}
      height="96vh" width="98vw"
      onViewportChanged={handleViewportChanged}
      markers={markerElements}
      animation={null}
      showGrid={true}
    />
  );
};

//
// keys are junk and should not break the animation code
// they should not animate either - just appear/disappear as if animation was off
//
export const ScrambledGeohashIds = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const duration = defaultAnimationDuration;

  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 100000, duration, true));
  }, [setMarkerElements]);

  return (
    <MapVEuMap
    viewport={{center: [ 20, -3 ], zoom: 6}}
    height="96vh" width="98vw"
    onViewportChanged={handleViewportChanged}
    markers={markerElements}
    animation={{
      method: "geohash",
      animationFunction: geohashAnimation,
      duration
    }}
    showGrid={true}
    />
  );
};

