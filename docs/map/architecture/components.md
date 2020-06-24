# List of likely MapVEu components

## The map itself

![map component screenshot](images/map-component.png)

The screenshot shows the whole application but what concerns us here is the zoomable/pannable map only.

It is this component that is likely to handle user-drawn polygons for
selection.  Once a polygon is drawn, does it become a child component
(like a Marker)?  Polygon drawing should likely be a configurable feature though.

### Props

* center (lat,long)
* zoom level (Leaflet zoom, integer)
* data
  * markers
  * layers? (raster and vector layer data)

* onMapUpdate : `({ bounds, zoomLevel }) => void` 
* onDrawnPolygon : `( { id, geometry }) => void`  (communicate newly drawn polygon to outside world)

### Children

All the components below are likely to be children of the map
component, because things like the zoom controls, legend, search box
and the chart drawer will need to be handled by Leaflet plugins (I think).


## Markers layer

![markers screenshot](images/markers.png)

Displays markers of different component types.

### Props

* data (from data.markers, see map component above)

* onMapUpdate (see map component above)

## Classic Donut Marker

![markers screenshot](images/classic-donut-marker.png)

This would be a simple donut/pie marker.  In VB the total count of the
categories would be displayed in the middle.  Though there is an issue
with the pie chart being generated for multi-valued fields (the sum of
the counts is more than the sum of the records, so ideally a separate
value should be provided (see value prop below).

Double clicking a marker should auto-zoom to the `extent` of the marker.
Not sure if that requires a function prop?

### Props

* id : string (if aggregating on geohash strings, this should be the geohash string)
* position : LatLong
* extent : Geometry (bbox or other geometry (e.g. convex hull) to show geographic extent of data aggregated "under" the marker)
* values : number[] (these are the amounts represented in the mini-donut chart, e.g. the counts per species)
* labels : string[] (these are the labels, e.g. species names, that won't normally be displayed due to space limits, but might be if you mouse-over a marker to expand it)
* colours : ?  (array of colours, or mapping from label to colour?)
* value : string | number (value to be shown in the center of the donut)
* selected : Boolean

* onSelected : `({id, extent}) => void`
* onDeselected : `({id, extent}) => void`


