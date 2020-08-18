import React from "react";
import { Marker } from "react-leaflet";
import { MarkerProps } from './Types';

//DKDK leaflet
import L from "leaflet";

//DKDK ts definition for HistogramMarkerSVGProps: need some adjustment but for now, just use Donut marker one
interface HistogramMarkerSVGProps extends MarkerProps {
  labels: Array<string>, // the labels (not likely to be shown at normal marker size)
  values: Array<number>, // the counts or totals to be shown in the donut
  colors: Array<string>, // the labels (not likely to be shown at normal marker size)
  isAtomic?: boolean,      // add a special thumbtack icon if this is true (it's a marker that won't disaggregate if zoomed in further)
  onClick?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOver?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOut?: (event: L.LeafletMouseEvent) => void | undefined,
}

/**
 * DKDK this is a SVG histogram marker icon
 */
export default function HistogramMarkerSVG(props: HistogramMarkerSVGProps) {
//   console.log('at DonutMarkerSVG.tsx')
  /**
   * DKDK icon with demo data: mroe realistic example can be found at dk-donut1 branch
   */
  let fullStat = []
  //DKDK need to make a temporary stats array of objects to show marker colors - only works for demo data, not real solr data
  for (let i = 0; i < props.values.length; i++) {
    fullStat.push({
      color: props.colors[i],
      label: props.labels[i],
      value: props.values[i],
    })
  }

  //DKDK construct histogram marker icon
  const size = 40  //DKDK histogram marker icon size: the same size with popbio/mapveu donut marker icons
  let svgHTML: string = ''  //DKDK divIcon HTML contents
  svgHTML += '<svg width="' + size + '" height="' + size + '">'   //DKDK initiate svg marker icon
  let count = fullStat.length
  let sumValues = fullStat.map(o => o.value).reduce((a, c) => { return a + c })     //DKDK summation of all fullStat.value
  const roundX = 10     //DKDK round corner in pixel
  const roundY = 10     //DKDK round corner in pixel
  const marginX = 5     //DKDK margin to start drawing bars in left and right ends of svg marker: plot area = (size - 2*marginX)
  const marginY = 5     //DKDK margin to start drawing bars in Y
  //DKDK draw outer box with round corners
  svgHTML += '<rect x="0" y="0" rx=' + roundX + ' ry=' + roundY + ' width=' + size + ' height=' + size + ' fill="white" stroke="grey" stroke-width="1" opacity="1.0" />'
  let iter = 0    //DKDK number of iteration to set up X position that varies
  fullStat.forEach(function (el: {color: string, label: string, value: number}) {
    let barWidth = (size-2*marginX)/count               //DKDK bar width
    let startingX = marginX + barWidth*iter             //DKDK x in <react> tag: note that (0,0) is top left of the marker icon
    let barHeight = el.value/sumValues*(size-marginY)   //DKDK bar height
    let startingY = (size-marginY)-barHeight            //DKDK y in <react> tag: note that (0,0) is top left of the marker icon
    svgHTML += '<rect x=' + startingX + ' y=' + startingY + ' width=' + barWidth + ' height=' + barHeight + ' fill=' + el.color + ' />'
    iter += 1
  })
  svgHTML += '</svg>'   //DKDK closing svg tag

  //DKDK set icon
  let HistogramIcon: any = L.divIcon({
    className: 'leaflet-canvas-icon',   //DKDK need to change the className but just leave it as it for now
    iconSize: new L.Point(0, 0),        //DKDKset iconSize = 0
    bgPos: new L.Point(0, 0),           //DKDK relative position of the background in pixel
    html: svgHTML                       //DKDK divIcon HTML svg code generated above
  });

  return (
    <Marker {...props} icon={HistogramIcon} title={props.position.toString()}>
      {/* <Popup>Donut marker popup.<br />Easily customizable.</Popup> */}
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* <Tooltip>Donut marker Tooltip</Tooltip> */}
    </Marker>
  );
}
