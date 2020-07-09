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
  key: string,
}

export interface FancyMarkerProps extends MarkerProps {
  opacity: number
}

export interface DonutMarkerProps extends MarkerProps {
  //DKDK add below two for donut marker
  icon: any,          // DKDK icon name?
  title: string,
  //DKDK blocked below for a while as they may not be necessary
  // values: Array<number>, // the counts or totals to be shown in the donut
  // labels: Array<string>, // the labels (not likely to be shown at normal marker size)
  // atomic?: boolean,      // add a special thumbtack icon if this is true (it's a marker that won't disaggregate if zoomed in further)
  // text?: string,         // text to render in center, sprintf(numberFormat,sum(values)) if not given
  // numberFormat?: string  // see 'text' above, defaults to %.1f
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
