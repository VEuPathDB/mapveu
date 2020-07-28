import React from "react";
import { Marker} from "react-leaflet";
// import { DonutMarkerProps } from "./Types";  //DKDK typescript is not set yet

//DKDK load necessary functions
import L from "leaflet";
import './popbio/Icon.Canvas.popbio.dk1.simple1.js'   //DKDK call custom canvas icon
import * as mapveuUtils from './popbio/mapveuUtils.dk1.simple1.js'  //DKDK call util functions

/**
 * DKDK this is simplified version of donut marker, especially with demo data
 * more realistic/better example can be found at dk-donut1 branch
 */

export default function DonutMarker(props) {
  console.log('at DonutMarker.tsx')
  /**
   * DKDK icon with demo data: mroe realistic example can be found at dk-donut1 branch
   */
  const size = 40  //DKDK donut marker size
  let fullStat = []
  //DKDK need to make a temporary stats array of objects to show marker colors - only works for demo data, not real solr data
  for (let i = 0; i < props.values.length; i++) {
    fullStat.push({
      color: props.colors[i],
      label: props.labels[i],
      value: props.values[i],
    })
  }

  // console.log(fullStat)

  //DKDK temporarily set atomic value: true or false for demo purpose
  var atomicValue = Math.random() < 0.5 ? true : false

  // make donut icon, donut
  const donut = new L.Icon.Canvas({
      iconSize: new L.Point(size, size),
      markerText: props.values[0],
      count: props.values[0],
      trafficlight: -1,   // DKDK set negative value to be default
      id: '',   //DKDK geohash value for mapveu v1
      stats: fullStat,
      atomic: atomicValue,
  })

  /**
   * DKDK initial trial for testing highlight marker but couple of issues to be resolved
   * - remove highlight after click: more detailed event handling will be required - partially resolved (only marker clicks)
   * - highlight seems to have a margin or padding: a gap exists - fixed by implementing marker coloring
   * - click event to show sidebar as well?
   * - may not be a React manner... more like js style by accessing to e.target directly?
   */
  const handleClick = (e) => {
    /**
     * DKDK what about calling removeHighlight() at first? need jquery for convenience
     * this only works when selecting other marker: not working when clicking map
     * it may be achieved by setting all desirable events (e.g., map click, preserving highlight, etc.)
     * just stop here and leave detailed events to be handled later
     */
    mapveuUtils.removeHighlight()
    //DKDK native manner, but not React style? Either way this is arguably the simplest solution
    e.target._icon.classList.add('highlight-marker')
    //DKDK here, perhaps we can add additional click event, like opening sidebar when clicking
  }

  //DKDK top-marker test: mouseOver and mouseOut
  const onMouseOver = (e) => {
    e.target._icon.classList.add('top-marker')
    // console.log('onMouseOver', e)
  }

  const onMouseOut = (e) => {
    e.target._icon.classList.remove('top-marker')
    // console.log('onMouseOut', e)
  }

  return (
    <Marker {...props} icon={donut} title={props.position} onClick={handleClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      {/* <Popup>Donut marker popup.<br />Easily customizable.</Popup> */}
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* <Tooltip>Donut marker Tooltip</Tooltip> */}
    </Marker>
  );
}
