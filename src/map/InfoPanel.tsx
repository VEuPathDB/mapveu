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
}

export default function InfoPanel({ datasetName, bounds } : InfoPanelProps) {
  
  return (
    <div>
      Dataset name = {datasetName} <br/>
      Current bounding box = {bounds ? `${bounds.southWest} to ${bounds.northEast}` : 'not known yet'} <br/>
    </div>
  );
}
