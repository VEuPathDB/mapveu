import React, { useState } from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuMap from './MapVEuMap';
import { BoundsViewport, MarkerData, DonutMarkerProps } from './Types';
import DonutMarker from './DonutMarker';  // DonutMarker.tsx needs to be created


export default {
  title: 'Donut Markers',
  component: MapVEuMap,
};


// some colors randomly pasted from the old mapveu code
// these are NOT the final decided colors for MapVEu 2.0
const all_colors_hex = [
  "#FFB300", // Vivid Yellow
  "#803E75", // Strong Purple
  "#FF6800", // Vivid Orange
  "#A6BDD7", // Very Light Blue
  "#C10020", // Vivid Red
  "#CEA262", // Grayish Yellow
  // "#817066", // Medium Gray

  // The following don't work well for people with defective color vision
  "#007D34", // Vivid Green
  "#F6768E", // Strong Purplish Pink
  "#00538A", // Strong Blue
  "#FF7A5C", // Strong Yellowish Pink
  "#53377A", // Strong Violet
  "#FF8E00", // Vivid Orange Yellow
  "#B32851", // Strong Purplish Red
  "#F4C800", // Vivid Greenish Yellow
  "#7F180D", // Strong Reddish Brown
  "#93AA00", // Vivid Yellowish Green
  "#593315", // Deep Yellowish Brown
  "#F13A13", // Vivid Reddish Orange
  "#232C16" // Dark Olive Green
];



/*
   This is a donut marker data generator.  It returns 10 random points within the given bounds.
   It creates random category counts for 'numCategories' categories and passes in the color palette too.
*/
const getMarkerData = ({ bounds, zoomLevel }: BoundsViewport, numCategories: number) => {
  // marker data has to be empty because we don't
  // know the map bounds until the map is rendered
  // (particularly in full screen deployments)
  const markerData : MarkerData = {
    markers : []
  }
  console.log("I've been triggered with bounds=["+bounds.southWest+" TO "+bounds.northEast+"] and zoom="+zoomLevel);
  const numMarkers = 10;
  for (var i=0; i<numMarkers; i++) {
    const lat = bounds.southWest[0] + Math.random()*(bounds.northEast[0] - bounds.southWest[0]);
    const long = bounds.southWest[1] + Math.random()*(bounds.northEast[1] - bounds.southWest[1]);
    markerData.markers.push(
      {
	props: { key: 'marker'+i,
		 position: [ lat, long ],
		 // is there a VEuPathDB-wide approach to making simple integer ranges [0 .. N] ?
		 labels: [...Array(numCategories).keys()].map((ci) => 'category_'+ci),
		 values: [...Array(numCategories).keys()].map(() => Math.floor(Math.random()*100.0)),
		 colors: all_colors_hex.slice(0,numCategories)
        } as DonutMarkerProps,
	component: DonutMarker
    });
  }
  // replace old markers with these new ones
  return markerData;
}


export const SixCategories = () => {
  const [ markerData, setMarkerData ] = useState<MarkerData>({ markers: [] });
  return (
    <MapVEuMap
    viewport={{center: [ 54.561781, -3.143297 ], zoom: 12}}
    height="600px" width="800px"
    onViewportChanged={(bvp : BoundsViewport) => setMarkerData(getMarkerData(bvp, 6))}
    markerData={markerData}
    />
  );
}

