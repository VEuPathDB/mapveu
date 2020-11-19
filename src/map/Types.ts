import { ReactElement } from "react";
import {number} from "@storybook/addon-knobs";
// import type { Viewport } from "react-leaflet";  // react-leaflet is flow not TS. Not sure how to do thus

export type LatLong = number[];  // TO DO: bounds checking? and enforce exactly two numbers

// does this need to be imported from react-leaflet properly? (see above)
export interface Viewport {
  center: LatLong,
  zoom: number
}

export interface GeoBBox {
  southWest: LatLong,
  northEast: LatLong
}

export interface MarkerProps {
  position: LatLong,
  key: string
}

export type AnimationFunction = (
    {
      prevMarkers,
      markers
    }: {
      prevMarkers: ReactElement<MarkerProps>[];
      markers: ReactElement<MarkerProps>[];
    }) => {
        zoomType: string | null;
        markers: ReactElement<MarkerProps>[];
    };


/*
  This is the geo-related information that any marker data request will need
*/

export interface BoundsViewport {
  bounds: GeoBBox,
  zoomLevel: number
}

export interface ViewportObject {
  zoom: number,
  center: number[]
}