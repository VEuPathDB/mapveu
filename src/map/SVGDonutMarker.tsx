import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { MarkerProps } from './Types';

//DKDK leaflet
import L, { LatLngExpression } from "leaflet";

//DKDK anim
import {DriftMarker} from "leaflet-drift-marker";

//DKDK ts definition for HistogramMarkerSVGProps: need some adjustment but for now, just use Donut marker one
interface SVGDonutMarkerProps extends MarkerProps {
  labels: Array<string>, // the labels (not likely to be shown at normal marker size)
  values: Array<number>, // the counts or totals to be shown in the donut
  colors?: Array<string> | null, // bar colors: set to be optional with array or null type
  isAtomic?: boolean,      // add a special thumbtack icon if this is true
  onClick?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOver?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOut?: (event: L.LeafletMouseEvent) => void | undefined,
  //DKDK anim
  duration?: number,
}

// DKDK convert to Cartesian coord. toCartesian(centerX, centerY, Radius for arc to draw, arc (radian))
function toCartesian(centerX: number, centerY: number, radius: number, angleInRadianInput: number) {
  // console.log("angleInRadianInput = ", angleInRadianInput)
  let angleInRadians = (angleInRadianInput-Math.PI/2);

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// DKDK input radian: makeArc(centerX, centerY, Radius for arc to draw, start point of arc (radian), end point of arc (radian))
function makeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {

   // console.log("startAngle = ", startAngle)
   // console.log("endAngle = ", endAngle)
    let dValue
    let endAngleOriginal = endAngle;
    if(endAngleOriginal - startAngle === 2 * Math.PI) {
        endAngle = 359 * Math.PI/180;
    }

    let start = toCartesian(x, y, radius, endAngle);
    let end = toCartesian(x, y, radius, startAngle);

    let arcSweep = endAngle - startAngle <= Math.PI ? "0" : "1";

    if(endAngleOriginal - startAngle === 2 * Math.PI) {
      dValue = [
              "M", start.x, start.y,
              "A", radius, radius, 0, arcSweep, 0, end.x, end.y, "z"
        ].join(" ");
    }
    else {
      dValue = [
          "M", start.x, start.y,
          "A", radius, radius, 0, arcSweep, 0, end.x, end.y
      ].join(" ");
    }

    return dValue
}

// making k over 9999, e.g., 223832 -> 234k
function kFormatter(num: number) {
  return Math.abs(num) > 9999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(0)) + 'k' : Math.sign(num)*Math.abs(num)
}

/**
 * DKDK this is a SVG donut marker icon
 */
export default function SVGDonutMarkerAnim(props: SVGDonutMarkerProps) {
  let fullStat = []
  //DKDK set defaultColor to be skyblue (#7cb5ec) if props.colors does not exist
  let defaultColor: string = ''
  // let defaultLineColor: string = ''
  //DKDK need to make a temporary stats array of objects to show marker colors - only works for demo data, not real solr data
  for (let i = 0; i < props.values.length; i++) {
    if (props.colors) {
      defaultColor = props.colors[i]
      // // defaultLineColor = 'grey'       //DKDK this is outline of histogram
      // defaultLineColor = 'black'       //DKDK this is outline of histogram
    } else {
      defaultColor = '#7cb5ec'
      // defaultLineColor = '#7cb5ec'
    }
    fullStat.push({
      // color: props.colors[i],
      color: defaultColor,
      label: props.labels[i],
      value: props.values[i],
    })
  }

  //DKDK construct histogram marker icon
  const size = 40   //DKDK SVG donut marker icon size: note that popbio/mapveu donut marker icons = 40
  let svgHTML: string = ''  //DKDK divIcon HTML contents

  //DKDK set drawing area
  svgHTML += '<svg width="' + size + '" height="' + size + '">'   //DKDK initiate svg marker icon

  //DKDK counting number of kinds at each marker data
  let count = fullStat.length
  //DKDK summation of fullStat.value per marker icon
  let sumValues: number = fullStat.map(o => o.value).reduce((a, c) => { return a + c })
  //DKDK convert large value with k (e.g., 12345 -> 12k): return original value if less than a criterion
  let sumLabel: number | string = kFormatter(sumValues)

  //DKDK draw white circle
  svgHTML += '<circle cx="' + size/2 + '" cy="' + size/2 + '" r="' + size/2 + '" stroke="green" stroke-width="0" fill="white" />'

  //DKDK set start point of arc = 0
  let startValue: number = 0
  //DKDK create arcs for data
  fullStat.forEach(function (el: {color: string, label: string, value: number}, index) {
    //DKDK if sumValues = 0, do not draw arc
    if (sumValues > 0) {
      //DKDK compute the ratio of each data to the total number
      let arcValue: number = el.value/sumValues
      //DKDK draw arc: makeArc(centerX, centerY, Radius for arc, start point of arc (radian), end point of arc (radian))
      svgHTML += '<path fill="none" stroke="' + el.color + '" stroke-width="4" d="' + makeArc(size/2, size/2, size/2-2, startValue, startValue+arcValue*2*Math.PI) + '" />'
      //DKDK set next startValue to be previous arcValue
      startValue = startValue+arcValue*2*Math.PI
    }
  })

  //DKDK adding total number text/label and centering it
  svgHTML += '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" opacity="1" fill="#505050" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="1em">' + sumLabel + '</text>'

  //DKDK check isAtomic: draw pushpin if true
  if (props.isAtomic) {
    let pushPinCode = '&#128204;'
    svgHTML += '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" opacity="1" fill="#505050" font-weight="bold" font-size="0.9em" transform="translate(5,-5) rotate(-20)">' + pushPinCode + '</text>'
  }

  // DKDK closing svg tag
  svgHTML += '</svg>'

  //DKDK set icon
  let SVGDonutIcon: any = L.divIcon({
    className: 'leaflet-canvas-icon',        //DKDK need to change this className but just leave it as it for now
    iconSize: new L.Point(size, size),       //DKDK this will make icon to cover up SVG area!
    iconAnchor: new L.Point(size/2,size/2),  //DKDK location of topleft corner: this is used for centering of the icon like transform/translate in CSS
    html: svgHTML                            //DKDK divIcon HTML svg code generated above
  });

  //DKDK anim check duration exists or not
  let duration: number = (props.duration) ? props.duration : 300
  // let duration: number = (props.duration) ? 300 : 300

  return (
    //DKDK The Marker currently shows type error. I think that I resolved this in my own branch but such a change will break others' works.
    //Thus, I will leave this for the time being
    //DKDK anim
    // <Marker {...props} icon={SVGDonutIcon}>
    <DriftMarker
      // {...props}
      // key={props.key}
      //DKDK to avoid type diff - LatLong vs LatLngExpression
      //As I tried before, we have to consistently use leaflet LatLngExpression type instead of custom LatLong to avoid type error
      position={[props.position[0], props.position[1]]}
      icon={SVGDonutIcon}
      duration={duration}
    >
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* However, Connor found coordinates issue and I realized that somehow "title" did not update coordinates correctly */}
      {/* But both Popup and Tooltip do not have such an issue */}
      {/* <Popup>{props.position.toString()}</Popup> */}
      {/* <Tooltip>{props.position.toString()}</Tooltip> */}
      <Tooltip>
        labels: {props.labels.join(" ")} <br/>
	      values: {props.values.join(" ")} <br />
        latlong: {props.position.toString()}
      </Tooltip>
    </DriftMarker>
  );
}
