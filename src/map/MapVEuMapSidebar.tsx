//DKDK this file is only used for sidebar demo
import React, { useState } from "react";
import { MapVEuMapProps } from "./TypesSidebar";
import { Viewport, Map, TileLayer, ZoomControl } from "react-leaflet";
import SemanticMarkers from "./SemanticMarkers";
import 'leaflet/dist/leaflet.css';
import MapVeuLegendSample from './MapVeuLegendSample'
//DKDK import a sidebar component
import SidebarExample from './SidebarExample'
// import { Sidebar, Tab } from './popbio/SidebarDK'
/**
 * Renders a Leaflet map with semantic zooming markers
 *
 *
 * @param props
 */
export default function MapVEuMapSidebar({ viewport, height, width, onViewportChanged, markers }: MapVEuMapProps) {

  // this is the React Map component's onViewPortChanged handler
  // we may not need to use it.
  // onViewportchanged in SemanticMarkers is more relevant
  // because it can access the map's bounding box (aka bounds)
  // which is useful for fetching data to show on the map.
  // The Viewport info (center and zoom) handled here would be useful for saving a
  // 'bookmarkable' state of the map.
  const [ state, setState ] = useState<Viewport>(viewport as Viewport);
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState(true);
  const [ tabSelected, setTabSelected ] = useState('home');

  const sidebarOnClose = () => {
    setSidebarCollapsed(true)
  }
  const sidebarOnOpen = (id: string) => {
    setSidebarCollapsed(false)
    setTabSelected(id)
  }
  const handleViewportChanged = (viewport : Viewport) => {
    setState(viewport);
  };

  return (
    <div>
      <SidebarExample
        id="leaflet-sidebar"
        collapsed={sidebarCollapsed}
        position='left'
        selected={tabSelected}
        closeIcon='fas fa-times'
        onOpen={sidebarOnOpen}
        onClose={sidebarOnClose}
      />
      <Map
        // className="sidebar-map"
        viewport={state}
        style={{ height, width }}
        onViewportChanged={handleViewportChanged}
        zoomControl={false} //DKDK this is for disabling default zoomControl at top left
      >
        <ZoomControl position="topright" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <SemanticMarkers
          onViewportChanged={onViewportChanged}
          markers={markers}
        />

        <MapVeuLegendSample className="supportLegend">
            <ul className="legendList">
              <li className="legendItem1">Strong Support</li>
              <li className="legendItem2">Weak Support</li>
              <li className="legendItem3">Weak Oppose</li>
              <li className="legendItem4">Strong Oppose</li>
            </ul>
        </MapVeuLegendSample>

      </Map>
    </div>
  );
}
