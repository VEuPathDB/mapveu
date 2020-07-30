/**
 * DKDK sample legend to check how to create legend
 * This approach may be better as one can use jsx
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const MapVeuLegend = (props) => {
  const { map } = useLeaflet();
  // console.log(map);

  useEffect(() => {
    // get color depending on population density value
    const getColor = (d) => {
      return d > 1000
        ? "#800026"
        : d > 500
        ? "#BD0026"
        : d > 200
        ? "#E31A1C"
        : d > 100
        ? "#FC4E2A"
        : d > 50
        ? "#FD8D3C"
        : d > 20
        ? "#FEB24C"
        : d > 10
        ? "#FED976"
        : "#FFEDA0";
    };

    const legend = L.control({ position: "bottomright" });

    const jsx = (
      //DKDK put jsx here for the component
      <div {...props}>
        Testing props
        {props.children}
      </div>
    );

    // console.log('props = ', props)

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      //DKDK put jsx into div above: this works like div.innerHTML, though jsx using innerHTML will not be rendered correctly
      ReactDOM.render(jsx, div);
      // div.innerHTML = jsx;
      return div;
    };

    legend.addTo(map);
  }, [map]);   //DKDK I added [map] here not to make multiple times!!!
  return null;
};

export default MapVeuLegend;
