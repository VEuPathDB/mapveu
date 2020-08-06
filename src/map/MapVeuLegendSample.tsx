//DKDK sample legend
import React from 'react';
import ReactDOM from 'react-dom';
import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const MapVeuLegendSample = (props: any) => {
  const { map } = useLeaflet();
  // console.log(map);

  useEffect(() => {
    // get color depending on population density value
    const getColor = (d: number) => {
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

    const legend = new L.Control({ position: "bottomright" });

    const jsx = (
      //DKDK put jsx here for the component:
      <div {...props}>
        Testing react-fontawesome
        {props.children}
      </div>
    );

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(from + 1) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }

      //DKDK put jsx into div above using ReactDOM.render(): this works like div.innerHTML, though jsx using innerHTML will not be rendered correctly
      //Note that ReactDom.render() may be used at first then use div.innerHTML for static(?) contents - but it may be complicated when ordering contents
      //thus below is just for a demo purpose
      ReactDOM.render(jsx, div);
      div.innerHTML = labels.join("<br>");
      return div;
    };

    //DKDK below if-condition is required to avoid typescript error regarding undefiled 'map'
    if (!map) return;

    legend.addTo(map);

  }, [map]);   //DKDK I added [map] here not to make multiple times!!!
  return null;
};

export default MapVeuLegendSample;
