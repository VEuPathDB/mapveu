import React from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { MarkerProps } from './Types';

export interface BarMarkerProps extends MarkerProps {
    labels: string[],
    values: number[],
}

export default function BarMarker(props: BarMarkerProps) {
    const divIcon = L.divIcon({
        html: '<div class="bar-marker-highcharts">I\'m a bar chart!</div>',
        className: 'bar-marker-icon',
    });

    return (
        <Marker position={props.position} icon={divIcon}>

        </Marker>
    );
}
