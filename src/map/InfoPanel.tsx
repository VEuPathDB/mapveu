import React, { useState } from "react";
import { GeoBBox } from './Types';

/**
 * Simple info panel for testing
 * 
 * 
 * @param props 
 */

interface InfoPanelProps {
  datasetName : string;
  bounds? : GeoBBox;
  selectedMarkers : string[];
}

export default function InfoPanel({ datasetName, bounds, selectedMarkers } : InfoPanelProps) {
  
  return (
    <div>
      <h2>InfoPanel</h2>
      This component is pretending to be a sidebar chart panel. In order to make the appropriate data requests, the chart panel will need access to the current bounding box, filters, selected markers and the current active variable in the Legend. Here I am testing some of the 'wiring' to make this possible.<br/>
      Dataset name = {datasetName} <br/>
      Current bounding box = {bounds ? `${bounds.southWest} to ${bounds.northEast}` : 'not known yet'} <br/>
      Selected markers = {selectedMarkers.length ? selectedMarkers : 'none'} (that's e.target._leaflet_id, but we want the React element's key (a geohash string))
    </div>
  );
}
