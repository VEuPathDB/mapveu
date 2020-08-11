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

export default function BarMarker(props: BarMarkerProps) {
    const divIcon = L.divIcon({
        html: `<div class="bar-marker-icon"><div id=${props.id} class="bar-marker-highcharts"></div></div>`,
    });

    useEffect(() => {
        ReactDOM.render(
            <BarChart labels={props.labels} values={props.values} width={40} height={40}></BarChart>,
            document.getElementById(props.id)
        );
      return () => {
	const el = document.getElementById(props.id);
	if (el) ReactDOM.unmountComponentAtNode(el);
      }
    });

    return (
        <Marker position={props.position} icon={divIcon}></Marker>
    );
}
