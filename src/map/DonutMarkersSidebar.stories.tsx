//DKDK this file is only used for sidebar demo
import React, { ReactElement, useState, useCallback } from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuMapSidebar from './MapVEuMapSidebar';
import { BoundsViewport, MarkerProps } from './Types';
import DonutMarker from './DonutMarker'; // TO BE CREATED

//DKDK load necessary functions/classes
import { latLng, LeafletMouseEvent } from "leaflet";
// import './popbio/Icon.Canvas.popbio.dk1.simple1.js'   //DKDK call custom canvas icon - may not be used anymore
import * as mapveuUtils from './popbio/mapveuUtils.dk1.simple1.js'  //DKDK call util functions

export default {
  title: 'Donut Markers Sidebar',
  component: MapVEuMapSidebar,
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

  /**
   * DKDK moved below mount events from DonutMarker.tsx to this place for avoiding typescript errors
   * - initial trial for testing highlight marker but couple of issues to be resolved
   * - remove highlight after click: more detailed event handling will be required - partially resolved (only marker clicks)
   * - highlight seems to have a margin or padding: a gap exists - fixed by implementing marker coloring
   * - click event to show sidebar as well?
   * - may not be a React manner... more like js style by accessing to e.target directly?
   */
  const handleClick = (e: LeafletMouseEvent) => {
    /**
     * DKDK this only works when selecting other marker: not working when clicking map
     * it may be achieved by setting all desirable events (e.g., map click, preserving highlight, etc.)
     * just stop here and leave detailed events to be handled later
     */
    // DKDK use a resuable function to remove a class
    mapveuUtils.removeClassName('highlight-marker')
    //DKDK native manner, but not React style? Either way this is arguably the simplest solution
    e.target._icon.classList.add('highlight-marker')
    //DKDK here, perhaps we can add additional click event, like opening sidebar when clicking
    // console.log(e)
  }

  //DKDK top-marker test: mouseOver and mouseOut
  const handleMouseOver = (e: LeafletMouseEvent) => {
    e.target._icon.classList.add('top-marker')
    // console.log('onMouseOver', e)
  }

  const handleMouseOut = (e: LeafletMouseEvent) => {
    e.target._icon.classList.remove('top-marker')
    // console.log('onMouseOut', e)
  }

/*
   This is a trivial marker data generator.  It returns 10 random points within the given bounds.
   The real thing should something with zoomLevel.
*/
const getMarkerElements = ({ bounds, zoomLevel }: BoundsViewport, numMarkers : number, numCategories : number) => {
  //DKDK change bounds as standard leaflet LatLngBounds
  console.log("I've been triggered with bounds=["+bounds.getSouthWest()+" TO "+bounds.getNorthEast()+"] and zoomLevel="+zoomLevel);
  return Array(numMarkers).fill(undefined).map((_, index) => {
    // console.log('getMarkerElements',bounds)
    //DKDK change bounds as standard leaflet LatLngBounds
    const lat = bounds.getSouth() + Math.random()*(bounds.getNorth() - bounds.getSouth());
    const long = bounds.getWest() + Math.random()*(bounds.getEast() - bounds.getWest());

    const labels = Array(numCategories).fill(0).map((_, index) => 'category_'+index);
    const values = Array(numCategories).fill(0).map(() => Math.floor(Math.random()*100.0));
    const colors = all_colors_hex.slice(0,numCategories);
    //DKDK passing temporarily set atomic value: true or false for demo purpose
    let atomicValue = Math.random() < 0.5 ? true : false

    return (
    <DonutMarker
      key={`marker_${index}`}
      //DKDK change position format
      position={latLng(lat, long)}
      labels={labels}
      values={values}
      colors={colors}
      isAtomic={atomicValue}
      onClick={handleClick}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
    />
    )
  });
}


export const SixCategoriesSidebar = () => {
  const [ markerElements, setMarkerElements ] = useState<ReactElement<MarkerProps>[]>([]);
  const handleViewportChanged = useCallback((bvp: BoundsViewport) => {
    setMarkerElements(getMarkerElements(bvp, 10, 6));
  }, [setMarkerElements])

  return (
    <MapVEuMapSidebar
    viewport={{center: [ 54.561781, -3.143297 ], zoom: 12}}
    height="100vh" width="100vw"
    onViewportChanged={handleViewportChanged}
    markers={markerElements}
    />
  );
}

