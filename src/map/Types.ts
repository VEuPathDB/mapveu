import { CSSProperties, ReactElement } from "react";
import { LatLngExpression, LatLngBounds } from "leaflet";
// import type { Viewport } from "react-leaflet";  // react-leaflet is flow not TS. Not sure how to do thus

//DKDK change to standard leaflet typescript definition, LatLngExpression
export type LatLong = LatLngExpression;  // TO DO: bounds checking? and enforce exactly two numbers

// does this need to be imported from react-leaflet properly? (see above)
export interface Viewport {
  center: LatLong,
  zoom: number
}

export interface MarkerProps {
  position: LatLong,
  key: string
}

/** React Props that are passed to a Map Component. */
export interface MapVEuMapProps {
  /** Center lat/long and zoom level */
  viewport: Viewport,

  /** Height and width of plot element */
  height: CSSProperties['height'],
  width: CSSProperties['width'],

  onViewportChanged: (bvp: BoundsViewport) => void,
  markers: ReactElement<MarkerProps>[]
}


/*
  This is the geo-related information that any marker data request will need
*/

export interface BoundsViewport {
//DKDK change to standard leaflet typescript definition, LatLngBounds
  bounds: LatLngBounds,
  zoomLevel: number
}
