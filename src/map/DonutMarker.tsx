import React, { useState, useRef, useEffect } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { DonutMarkerProps } from "./Types";
import * as mapveuUtils from './popbio/mapveuUtils.js'  //DKDK call util functions

export default function DonutMarker(props: DonutMarkerProps) {
  /**
   * DKDK initial trial for testing highlight marker but couple of issues to be resolved
   * - remove highlight after click: more detailed event handling will be required - partially resolved (only marker clicks)
   * - highlight seems to have a margin or padding: a gap exists - fixed by implementing marker coloring
   * - click event to show sidebar v2 as well?
   * - may not be a React manner... more like js style by accessing to e.target directly?
   */
  function handleClick (e) {
    /**
     * DKDK what about calling removeHighlight() at first? need jquery for convenience
     * this only works when selecting other marker: not working when clicking map
     * it may be achieved by setting all desirable events (e.g., map click, preserving highlight, etc.)
     * just stop here and leave detailed events to be handled later
     */
    mapveuUtils.removeHighlight();
    //DKDK native manner, but not React style? Either way this is arguably the simplest solution
    e.target._icon.classList.add('highlight-marker')
    //DKDK here, perhaps we can add additional click event, like opening sidebar v2 when clicking
  }
  return (
    <Marker {...props} onClick={handleClick} >
      {/* <Popup>Donut marker popup.<br />Easily customizable.</Popup> */}
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* <Tooltip>Donut marker Tooltip</Tooltip> */}
    </Marker>
  );
}
