import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import L from "leaflet";
import { Marker } from "react-leaflet";
import BarChart from './BarChart';
import { MarkerProps } from './Types';
import './BarMarker.css';

export interface BarMarkerProps extends MarkerProps {
  id: string,
  labels: string[],
  values: number[],
}
/**
 * A marker containing a small bar chart
 * 
 * @param props
 */
export default function BarMarker(props: BarMarkerProps) {
  // Create the divIcon to pass to the Leaflet marker
  // Give it an ID so we can know which plot goes in which marker
  const divIcon = L.divIcon({
    html: `<div class="bar-marker-icon"><div id=${props.id} class="bar-marker-chart"></div></div>`,
  });

  // Render the chart after the marker is rendered
  useEffect(() => {
    ReactDOM.render(
      <BarChart labels={props.labels} values={props.values} width={40} height={40}></BarChart>,
      document.getElementById(props.id)
    );

    // Deconstruct the chart on marker derender
    return () => {
      const el = document.getElementById(props.id);
	  if (el) ReactDOM.unmountComponentAtNode(el);
    }
  });

  return (
    <Marker position={props.position} icon={divIcon}></Marker>
  );
}
