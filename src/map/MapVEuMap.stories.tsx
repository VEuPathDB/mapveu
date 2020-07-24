import React, { useState, useRef, useEffect } from 'react';
// import { action } from '@storybook/addon-actions';
import MapVEuMap from './MapVEuMap';
import { BoundsViewport, MarkerData, MarkerProps, FancyMarkerProps, DonutMarkerProps, Viewport } from './Types';
import { Marker, useLeaflet } from 'react-leaflet';
import FancyMarker from './FancyMarker';
import DonutMarker from './DonutMarker';    //DKDK donut marker component made based on FancyMarker

// temporary hack to work-around webpack/leaflet incompatibility
// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-483402699
// we will have custom markers soon so no need to worry
import L from "leaflet";
import { setUncaughtExceptionCaptureCallback } from 'process';

//DKDK load necessary functions and data
import './popbio/Icon.Canvas.popbio.dk1.js'   //DKDK call custom canvas icon
import * as mapveuUtils from './popbio/mapveuUtils.js'  //DKDK call util functions
import useRequest from './hooks/asyncLoadJson'  //DKDK load custom hook for asynchronous request (async/await, axios)
import smplPalette from './json/sample_uk_facet_palette1.json'  //DKDK load smplPalette query's response (json file)

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


export default {
  title: 'Map',
  component: MapVEuMap,
};

const size = 40;  //DKDK donut marker size

/*
   This is a trivial marker data generator.  It returns 10 random points within the given bounds.
   The real thing should something with zoomLevel.
*/
const getMarkerData = ({ bounds, zoomLevel }: BoundsViewport) => {
    // marker data has to be empty because we don't
    // know the map bounds until the map is rendered
    // (particularly in full screen deployments)
    const markerData : MarkerData = {
      markers : []
    }
    console.log("I've been triggered with bounds=["+bounds.southWest+" TO "+bounds.northEast+"] and zoom="+zoomLevel);
    const numMarkers = 10;
    for (let i=0; i<numMarkers; i++) {
      const lat = bounds.southWest[0] + Math.random()*(bounds.northEast[0] - bounds.southWest[0]);
      const long = bounds.southWest[1] + Math.random()*(bounds.northEast[1] - bounds.southWest[1]);
      if (Math.random() < 0.5) { // basic Marker
        markerData.markers.push(
      {
        props: { key: 'marker'+i,
             position: [ lat, long ]
            } as MarkerProps,
        component: Marker
        });
      } else {  // make a FancyMarker
        markerData.markers.push(
      {
        props: { key: 'fancymarker'+i,
             position: [ lat, long ],
             opacity: 0.25
            } as FancyMarkerProps,
        component: FancyMarker
        });
      }
    }
    // replace old markers with these new ones
    return markerData;
  }


//DKDK roundDecimals function from vb-popbio-maps.js
Number.prototype.roundDecimals = function (decimals) {
  return Number(Math.round(this.valueOf() + 'e' + decimals) + 'e-' + decimals);
};

/**
 * DKDK: This is for Donut marker based on getMarkerData() above
 */
const getDonutMarkerData = ({ bounds, zoomLevel }: BoundsViewport, response: any) => {
    // marker data has to be empty because we don't
    // know the map bounds until the map is rendered
    // (particularly in full screen deployments)
    const markerData : MarkerData = {
      markers : []
    }

    console.log("I've been triggered with bounds=["+bounds.southWest+" TO "+bounds.northEast+"] and zoom="+zoomLevel);


    /**
     * DKDK need to set color palette (made at legend using, e.g.,  smplPalette query response, in popbio map)
     * using customized functions for generating color palette (referencing map.Legend.js)
     * Note that the palette is only made once per each legend category (e.g., Species, Collections, etc.)
     * That is, as an example of Species, all species will have their own colors at once
     * Then, marker coloring at each maker is a kind of a color table lookup where the table is colorPalette here
     */
    const colorPalette = mapveuUtils._populateLegend(smplPalette)
    // console.log('colorPalette = ', colorPalette)

    //DKDK handling solr smplGeoclust query response (species-based)
    const facetResults = response.data.facets.geo.buckets
    // console.log('facetResults = ', facetResults)

    //DKDK looping facetResults for each data
    for (let i = 0; i < facetResults.length; i++) {
      //DKDK for solr smplGeoclust: using average value of lt and ln
      const lat = facetResults[i].ltAvg;
      const long = facetResults[i].lnAvg;

      //DKDK here, fullStats array need to be made for marker coloring (referencing loadSolr() at vb-popbio-map.js)
      let geoCount = facetResults[i].count
      let key = facetResults[i].val,
          elStats = [],
          fullElStats = [],
          tagsTotalCount = 0;
      let geoTerms = facetResults[i].term.buckets;

      //DKDK in this example (Species category), geoTerms contains species data/array per each geo location (marker)
      geoTerms.forEach(function (inEl) {
          let inKey = inEl.val;       //DKDK for this example data, inKey is indeed a species name
          let inCount = inEl.count;

          if (inCount > 0) {
              fullElStats.push({
                  "label": inKey,
                  "value": inCount.roundDecimals(0),
                  //DKDK taking color info per each species based on colorPalette above
                  "color": (colorPalette[inKey] ? colorPalette[inKey] : "#000000")
              });
          }

          // store the total counts
          tagsTotalCount += inCount;
      });

      //DKDK handling unknown color
      if (geoCount - tagsTotalCount > 0) {
        fullElStats.push({
            "label": 'Unknown',
            "value": geoCount - tagsTotalCount,
            "color": (colorPalette['Unknown'])
        });
      }

      //DKDK set atomicValue here based on solr query response: displayed as thumbtack
      let atomicValue = facetResults[i].atomicCount === 1;

      markerData.markers.push(
      {
        props: { key: 'donutmarker'+i,
              position: [ lat, long ],
              //DKDK icon property is used for custom marker
              //DKDK below method also works but the circle function needs changes based on new property values in the following
              //    icon: circle,
              icon: new L.Icon.Canvas({
                  iconSize: new L.Point(size, size),
                  markerText: mapveuUtils.kFormatter(facetResults[i].count), //DKDK dynamically assign id for solr smplGeoClust
                  count: facetResults[i].count,
                  trafficlight: -1,   // DKDK set negative value to be default
                  id: facetResults[i].val, //DKDK dynamically assign id for solr smplGeoClust
                  stats: fullElStats,  // DKDK array - this will be used for marker coloring
                  atomic: atomicValue, //DKDK idk what this actually means but...
              }),
              title: '[' + lat + ',' + long + ']',  //DKDK mouseover text, i.e., a sort of tooltip
            } as DonutMarkerProps,
        component: DonutMarker,
        });
      }

    // console.log(markerData);
    return markerData;

  }

export const Basic = () => {
  const [ markerData, setMarkerData ] = useState<MarkerData>({ markers: [] });
  return (
    <MapVEuMap
    viewport={{center: [ 54.561781, -3.143297 ], zoom: 13}}
    height="98vh" width="98vw"
    onViewportChanged={(bvp : BoundsViewport) => setMarkerData(getMarkerData(bvp))}
    markerData={markerData}
    />
  );
}

export const Donut = () => {
    const [ markerData, setMarkerData ] = useState<MarkerData>({ markers: [] });

    /**
     * DKDK testing async Promise-based query using axios
     * In reality, markerData cannot be obtained here but just used for test purpose
     * this json data is a Solr facet query response (smplGeoclust handler) for UK
     */
    let dataUrl = 'http://localhost:9009/json/sample_uk_facet_geoclust1.json'

    //DKDK axios call via custom hook
    const [response, loading, error] = useRequest(
      dataUrl
    );

    //DKDK handling loading/error in a quick way
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      console.log('error =', error)
      return <div>Error!</div>
    }

    if (!response) return null;

    // console.log('Donut function is called = ', response)

    return (
      <MapVEuMap
        //   viewport={{center: [ 54.561781, -3.143297 ], zoom: 13}}
        viewport={{center: [ 54.011722, -4.694708 ], zoom: 6}}  //DKDk centering to UK area
        height="98vh" width="98vw"
        //DKDK send response: doesn't make sense in real situation but just for test purpose
        onViewportChanged={(bvp : BoundsViewport) => setMarkerData(getDonutMarkerData(bvp, response))}
        // onViewportChanged={(bvp : BoundsViewport) => setMarkerData(getDonutMarkerData(bvp))}
        markerData={markerData}
      />
    );
  }


/**
 * DKDK this also works by setting 'icon: circle' at props above but inline call is better to change values dynamically
 * however, key values need to be changed following above L.Icon.Canvas's new options - didn't change them yet
 */
// const circle = new L.Icon.Canvas({
//     iconSize: new L.Point(size, size),
//     // markerText: feature.properties.val.replace(',',''),
//     markerText: 'DK',
//     count: '123',
//     trafficlight: -1,   // DKDK set negative value to be default
//     id: '',
//     stats: [],  // DKDK array
//     // // avgSampleSize: (viewMode === 'abnd') ? record.avgSampleSize : -1,
//     // // avgDuration: (viewMode === 'abnd') ? record.avgDuration : -1,
//     atomic: '',
//     projColor: projColor[projCount],
//     });
