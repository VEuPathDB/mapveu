import React, { useState } from 'react';
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

//DKDK load
import './popbio/Icon.Canvas.popbio.dk1.js'   //DKDK call custom canvas icon
import * as mapveuUtils from './popbio/mapveuUtils.js'  //DKDK call util functions
import useRequest from './hooks/asyncLoadJson'  //DKDK load custom hook for asynchronous request (async/await, axios)


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


//DKDK for donut marker size and color
// iterate over types, filter by that type, and format the layer for that feature type
let projColor = ["#FFB300", "#803E75", "#FF6800", "#A6BDD7", "#C10020", "#CEA262", "#007D34"];
let projCount = 0;
const size = 40;


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


/**
 *  DKDK: This is for Donut marker based on getMarkerData() above
 */

 //DKDK roundDecimals function from vb-popbio-maps.js
Number.prototype.roundDecimals = function (decimals) {
  return Number(Math.round(this.valueOf() + 'e' + decimals) + 'e-' + decimals);
};

const getDonutMarkerData = ({ bounds, zoomLevel }: BoundsViewport, response) => {
// function getDonutMarkerData ({ bounds, zoomLevel }: BoundsViewport) {
    // marker data has to be empty because we don't
    // know the map bounds until the map is rendered
    // (particularly in full screen deployments)
    const markerData : MarkerData = {
      markers : []
    }

    console.log("I've been triggered with bounds=["+bounds.southWest+" TO "+bounds.northEast+"] and zoom="+zoomLevel);


    const responseData = response.data.facets.geo.buckets //DKDK for solr smplGeoclust
    // console.log('responseData = ', responseData)

    for (let i = 0; i < responseData.length; i++) {
      //DKDK for solr smplGeoclust
      const lat = responseData[i].ltAvg;
      const long = responseData[i].lnAvg;

      markerData.markers.push(
      {
        props: { key: 'donutmarker'+i,
              position: [ lat, long ],
         //    icon: circle,
              icon: new L.Icon.Canvas({
                  iconSize: new L.Point(size, size),
                  // markerText: feature.properties.val.replace(',',''),
                  // markerText: 'DK'+i, //DKDK dynamically assign id for solr select
                  // markerText: responseData[i].count, //DKDK dynamically assign id for solr smplGeoClust
                  markerText: mapveuUtils.kFormatter(responseData[i].count), //DKDK dynamically assign id for solr smplGeoClust
                  count: responseData[i].count,
                  trafficlight: -1,   // DKDK set negative value to be default
                  // id: responseData[i][geoLevel], //DKDK dynamically assign id for solr select
                  id: responseData[i].val, //DKDK dynamically assign id for solr smplGeoClust
                  // id: responseData[i].term, //DKDK dynamically assign id for solr smplGeoClust
                  stats: [],  // DKDK array
                  // // avgSampleSize: (viewMode === 'abnd') ? record.avgSampleSize : -1,
                  // // avgDuration: (viewMode === 'abnd') ? record.avgDuration : -1,
                  atomic: '', //DKDK if set (like 1), it shows apostrophe like display
                  projColor: projColor[projCount],
              }),
              title: '[' + lat + ',' + long + ']',  //DKDK mouseover text, i.e., tooltip
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

    //DKDK made/used custom hook, useRequest
    const [response, loading, error] = useRequest(
        'http://localhost:9009/json/sample_uk_facet_geoclust1.json'  //DKDK for solr smplGeoclust
        );

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
        viewport={{center: [ 54.011722, -4.694708 ], zoom: 6}}
        height="98vh" width="98vw"
        onViewportChanged={(bvp : BoundsViewport) => setMarkerData(getDonutMarkerData(bvp, response))}
        markerData={markerData}
      />
    );
  }


//DKDK this also works by setting 'icon: circle' at props above but inline call is better to change values dynamically
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
