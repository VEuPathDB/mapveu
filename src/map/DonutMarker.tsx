import React, { useState, useRef, useEffect } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { DonutMarkerProps } from "./Types";
import * as mapveuUtils from './popbio/mapveuUtils.js'  //DKDK call util functions

export default function DonutMarker(props: DonutMarkerProps) {
  /**
   * DKDK initial trial for testing highlight marker but couple of issues to be resolved
   * - remove highlight after click: more detailed event handling will be required
   * - highlight seems to have a margin or padding: a gap exists
   * - click event to show sidebar v2 as well?
   * - not React manner... more like js style by accessing to e.target directly
   */
  function handleClick (e) {
    //DKDK native manner, but not React style!
    e.target._icon.classList.add('highlight-marker')
  }
  return (
    <Marker {...props} onClick={handleClick} >
      <Popup>Donut marker popup.<br />Easily customizable.</Popup>
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* <Tooltip>Donut marker Tooltip</Tooltip> */}
    </Marker>
  );
}
