import React from "react";
import { Marker, Tooltip } from "react-leaflet";
// import { DonutMarkerProps } from "./Types";  //DKDK typescript is not set yet
import { MarkerProps } from './Types';
// import { Point, PointExpression, IconOptions } from 'leaflet';

//DKDK leaflet
import L from "leaflet";


// //DKDK declaring - does not work
// declare module 'leaflet' {
// 	namespace Icon {
// 		export interface DonutIcon extends L.Icon {
//       iconSize: L.PointExpression, // the labels (not likely to be shown at normal marker size)
//       markerText: string,
//       count: number | string,
//       trafficlight: number | string,   // DKDK set negative value to be default
//       id: string,   //DKDK geohash value for mapveu v1
//       stats: Array<string>,
//       atomic: boolean,
//       createIcon(): any,
//       createShadow(): any,
//       markerColor(): any,
//       draw(): any,
// 		}
// 	}

// 	namespace icon {
// 		function donutIcon(options?: any): L.Icon.DonutIcon;
// 	}
// }


//DKDK ts definition for DonutMarker
export interface DonutMarkerProps extends MarkerProps {
  labels: Array<string>, // the labels (not likely to be shown at normal marker size)
  values: Array<number>, // the counts or totals to be shown in the donut
  colors: Array<string>, // the labels (not likely to be shown at normal marker size)
  isAtomic?: boolean,      // add a special thumbtack icon if this is true (it's a marker that won't disaggregate if zoomed in further)
  onClick?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOver?: (event: L.LeafletMouseEvent) => void | undefined,
  onMouseOut?: (event: L.LeafletMouseEvent) => void | undefined,
}

// //DKDK ts definition for donut marker icon... is this useful?
// export interface DonutMarkerIcon {
//   iconSize: L.PointExpression, // the labels (not likely to be shown at normal marker size)
//   markerText: string,
//   count: number | string;
//   trafficlight: number | string,   // DKDK set negative value to be default
//   id: string,   //DKDK geohash value for mapveu v1
//   stats: Array<string>,
//   atomic: boolean,
// }

/**
 * DKDK this is customized and simplified version of donut marker, especially with demo data
 * more realistic/better example can be found at dk-donut1 branch
 */
export default function DonutMarker(props: DonutMarkerProps) {
  // console.log('at DonutMarker.tsx')
  /**
   * DKDK icon with demo data: mroe realistic example can be found at dk-donut1 branch
   */
  const size = 40  //DKDK donut marker size
  let fullStat = []
  //DKDK need to make a temporary stats array of objects to show marker colors - only works for demo data, not real solr data
  for (let i = 0; i < props.values.length; i++) {
    fullStat.push({
      color: props.colors[i],
      label: props.labels[i],
      value: props.values[i],
    })
  }

  let donut = new DonutIcon({
  // let donut: any = new L.Icon.DonutIcon({
    iconSize: new L.Point(size, size),
    markerText: props.values[0],
    count: props.values[0],
    trafficlight: -1,   // DKDK set negative value to be default
    id: '',   //DKDK geohash value for mapveu v1
    stats: fullStat,
    atomic: props.isAtomic,
  })

  return (
    <Marker {...props} icon={donut}>
      {/* <Popup>{props.position.toString()}</Popup> */}
      {/* DKDK Below Tooltip also works but we may simply use title attribute as well */}
      {/* Connor found an issue of wrong coordinates and I realized that somehow "title" didnot update correctly */}
      {/* But both Popup and Tooltip do not have such an issue */}
      <Tooltip>{props.position.toString()}</Tooltip>
    </Marker>
  );
}


//DKDK this is based on Icon.Canvas.js (customized)
// Currently, DonutIcon type is set to 'any' which clears typescript errors regarding DonutIcon but there may be a better way
let DonutIcon: any = L.Icon.extend({
// L.Icon.DonutIcon = L.Icon.extend({
  options: {
        iconSize: new L.Point(20, 20), // Have to be supplied
        className: 'leaflet-canvas-icon',
        // className: 'leaflet-canvas-icon leaflet-marker-icon-anim',   //DKDK do we need to have leaflet-marker-icon-anim here?
        population: 0,
        stats: [],
    },

    createIcon: function () {
        var e = document.createElement('canvas');
        this._setIconStyles(e, 'icon');
        var s = this.options.iconSize;
        var pop = this.options.population;
        e.width = s.x;
        e.height = s.y;
        e.id = this.options.id;
        //DKDK block this as markers is not assigned to this library
        // this.options.selected = markers.isSelected(this.options.id);
        this.draw(e.getContext('2d'), s.x, s.y);
        return e;
    },

    createShadow: function () {
        return null;
    },

    // DKDK taken from mapLegend.js
    markerColor: function (value: number) {
        var options = this.options;
        var fillColor, textColor;

        if (value < 0) {
            return ["white", '#555'];
            // DKDK fillColor = inner circle color = white
            // return ["blue", '#0000FF'];
        }

        fillColor = options.trafficlight.scale.evaluate(value);
        textColor = getContrastYIQ(fillColor);

        return [fillColor, textColor];
    },

    draw: function (canvas: CanvasRenderingContext2D, width: number, height: number) {

        var iconSize = this.options.iconSize.x, iconSize2 = iconSize / 2, iconSize3 = iconSize / 2.5, iconSize4 = iconSize / 3;
        var pi2 = Math.PI * 2;

        var start = Math.PI * 1.5;
        //var start = Math.PI * 2;
        var stats = this.options.stats;
        var markerText = this.options.markerText;

        var count = 0; // before VB-8044 was this.options.count;
        stats.forEach(function(el: {color: string, label: string, value: number}) { count += el.value; })

        var atomic = this.options.atomic;
        var selected = this.options.selected;


        // var cumulativeCount = this.options.cumulativeCount;
        stats.forEach(function (el: {color: string, label: string, value: number}) {

            // console.log(el)
            var size = el.value / count;
            var label = el.label;

            if (size > 0) {
                canvas.beginPath();
                canvas.moveTo(iconSize2, iconSize2);
                canvas.fillStyle = el.color;

                var from = start,
                    to = start + size * pi2;

                if (to < from) {
                    from = start;
                }
                canvas.arc(iconSize2, iconSize2, iconSize2, from, to);

                start = start + size * pi2;
                canvas.lineTo(iconSize2, iconSize2);
                canvas.fill();
                canvas.closePath();
            }

        });


        // Draw the marker background
        // DKDK this is related to perimeter color as well...

        canvas.beginPath();
        // DKDK add colors...
        canvas.fillStyle = 'white';
        // canvas.fillStyle = '#0f5970';
        // canvas.fillStyle = this.options.projColor;   //DKDK this was only for ClinEpiDB
        // DKDK arc(arc(x,y,r,sAngle,eAngle,counterclockwise) - Angle is 0-2pi and clockwise, iconSize3 determins radius
        canvas.arc(iconSize2, iconSize2, iconSize3, 0, Math.PI * 2);
        canvas.fill();
        canvas.closePath();

        // DKDK
        // var colors = legend.markerColor(this.options.trafficlight);
        var colors = this.markerColor(this.options.trafficlight);

        // Draw the marker fill color (white if now value)

        canvas.beginPath();
        canvas.fillStyle = colors[0];
        canvas.arc(iconSize2, iconSize2, iconSize4, 0, Math.PI * 2);
        canvas.fill();
        canvas.closePath();
        canvas.fillStyle = colors[1];

        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';
        canvas.font = 'bold 12px sans-serif';
        // DKDK fillText(text,x,y,maxWidth)
        canvas.fillText(markerText, iconSize2, iconSize2, iconSize);



        if (selected) {

            canvas.beginPath();
            canvas.fillStyle = 'rgba(255, 255, 255, 0.5)';
            canvas.arc(iconSize2, iconSize2, iconSize3, 0, Math.PI * 2);
            canvas.fill();
            canvas.closePath();
            canvas.textAlign = "center";
            // canvas.font = '24px FontAwesome';
            // canvas.fillStyle = 'white';
            switch (selected) {
                case 'parent':
                    canvas.fillStyle = 'grey';
                    break;

                case 'child':
                    canvas.fillStyle = 'grey';
                    break;

                default:
                    canvas.fillStyle = 'rgb(0, 120, 215)';



            }

            // canvas.fillText('\uf111', iconSize2, iconSize2);
            canvas.font = '900 18px "Font Awesome 5 Free"';
            // canvas.fillStyle = 'rgb(0, 120, 215)';
            canvas.fillText('\uf00c', iconSize2, iconSize2);

        }

        if (atomic) {

            canvas.save();
            canvas.translate(iconSize - 10, 6);
            canvas.rotate(Math.PI / 8);
            canvas.textAlign = "center";
            canvas.font = '900 12px "Font Awesome 5 Free"';
            canvas.fillStyle = '#595959';
            //DKDK
            canvas.fillText('\uf08d', 2, 0);
            canvas.restore();
        }

    },  //DKDK don't forget comman here

});

// DKDK taken from vb-popbio-maps.js
function getContrastYIQ(hexcolor: string) {
    // strip # from the hexcolor
    hexcolor = hexcolor.replace(/#/, '');
    // parse RGB values
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);

    // build a yiq represantation that takes into account the sensitivity of our eyes to R, G and B
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    // calculate the contrast
    // the original had a value of 128 for the comparison but I get better results with 200 (more white text)
    return (yiq >= 200) ? '#000000' : '#ffffff';
}
