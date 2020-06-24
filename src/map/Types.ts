import { CSSProperties } from "react";
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

export interface MarkerData {
  markers: Array<MarkerDatum>
}


export interface MarkerDatum {
  props: MarkerProps,
  component: React.Component | Function  // because FancyMarker is just a function...
}


export interface MarkerProps {
  position: LatLong,
  key: string
}

export interface FancyMarkerProps extends MarkerProps {
  opacity: number
}


/** React Props that are passed to a Map Component. */
export interface MapVEuMapProps {
  /** Center lat/long and zoom level */
  viewport: Viewport,
  
  /** Height and width of plot element */
  height: CSSProperties['height'],
  width: CSSProperties['width'],

  onViewportChanged: (bvp: BoundsViewport) => void,
  markerData: MarkerData
}

export interface SemanticMarkersProps {
  onViewportChanged: (bvp: BoundsViewport) => void,
  data: MarkerData
}


/*
  This is the geo-related information that any marker data request will need 
*/

export interface BoundsViewport {
  bounds: GeoBBox,
  zoomLevel: number
}