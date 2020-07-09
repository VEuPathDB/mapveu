import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { DonutMarkerProps } from "./Types";

export default function DonutMarker(props: DonutMarkerProps) {
  return (
    <Marker {...props}> 
      <Popup>Donut marker popup.<br />Easily customizable.</Popup>
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* <Tooltip>Donut marker Tooltip</Tooltip> */}
    </Marker>  
  );  
}
