import {LatLngBounds, Rectangle, Tooltip, useLeaflet} from "react-leaflet";
import React, {Dispatch, SetStateAction, useState} from "react";
import {DriftMarker} from "leaflet-drift-marker";
import Geohash from "latlon-geohash";
import {ViewportObject} from "./Types";

interface CustomDriftMarkerProps {
  bounds: LatLngBounds,
  ltAvg: number,
  lnAvg: number,
  val: string,
  count: number
  duration: number,
  setDblClickBounds: Dispatch<SetStateAction<ViewportObject | null>>
}


export default function CustomDriftMarker({bounds, ltAvg, lnAvg, val, count, duration, setDblClickBounds}: CustomDriftMarkerProps) {
  const [displayBounds, setDisplayBounds] = useState<boolean>(false)
  const { map } = useLeaflet();

  const setNewView = (ltAvg: number, lnAvg:number) => {
    setDblClickBounds({center: [ltAvg, lnAvg], zoom: map.getZoom()+1})
  }

  return (<DriftMarker
    duration={duration}
    position={[ltAvg, lnAvg]}
    onMouseOver={() => setDisplayBounds(true)} // Display bounds rectangle
    onMouseOut={() => setDisplayBounds(false)} // Remove bounds rectangle
    onDblClick={() => setNewView(ltAvg, lnAvg)}
  >
    <Tooltip>
      <span>{`key: ${val}`}</span><br/>
      <span>{`#aggregated: ${count}`}</span><br/>
      <span>{`lat: ${ltAvg}`}</span><br/>
      <span>{`lon: ${lnAvg}`}</span>
    </Tooltip>
    {
      displayBounds
        ? <Rectangle
            bounds={bounds}
            color={"gray"}
            weight={1}
          >

          </Rectangle>
        : null
    }
  </DriftMarker>)
}