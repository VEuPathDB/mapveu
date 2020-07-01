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

![screenshot](images/classic-donut-marker.png)

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



## View select menu

![screenshot](images/view-select.png)

Allows the user to switch between "views".  Each view shows one type
of record (or a back-end hardcoded subset of a type of record) and
there may be different fields available in different views.  The idea
is that some fields are the same between views (e.g. species).

### Props

* availableViews : id[]  (list of view IDs)
* labels : string[]      (labels to show)
* defaultView : id       (default view ID)
* onViewChange: (viewId : id) => void


## Filter field select menu

![screenshot](images/filter-field-select.png)

Allows user to choose a which field to filter on in the legend panel.

Note that when the view changes, the availableFields must change too.
If the currently selected field exists in both fromView and toView on
view change, then it should remain selected, otherwise fall back to
defaultField.

Will this be limited to showing a relatively small number of fields (<15) ?
(as in MapVEu 1.0)

Or will it be scalable to 100s of fields using hierarchical nesting and OWL-file config?



### Props

* availableFields : id[]  (list of field IDs)
* labels : string[]       (labels to show)
* defaultField : id       (default field ID)
* onFieldChange : (fieldId : id) => void


## Filter/legend

![screenshot](images/filter-legend.png)

The legend in MapVEu 1.0 went through several iterations.  It started
being simply a legend panel to show the colour scheme.  Colours are
always going to be tricky because you users can distinguish max 20
(and that's pushing it). Grey shades are used for the remainder.  The
"default colors" in MapVEu 1.0 are not simply assigned to the 20 most
populous categories. There is an algorithm to distribute the colours
across the globe (and there was a separate AJAX request to get the
data for this, e.g. smplPalette, abndPalette etc), which prevented
Africa having all the colours (because most data was there).  Nowadays
the USA would hog all the colours because the largest numbers of
samples are there (e.g. Aedes vexans sensu lato).  Then we added the
"Optimize Colors" functionality and this assigned the 20 colours to
the 20 most populous categories in the markers currently on screen (in
the current viewport and satisfying all active filters).  The numbers
on the right hand side of the legend were a similarly recent addition,
as were the sorting options.

The legend has always been a filter, by which we mean that when you
click on a category name, it adds a filter for that category.
(Ctrl-click adds a NOT filter.)  Adding multiple filters from the
legend wasn't really possible, unless you went to the "Complete list"
which was not 100% intuitive and also a bit buggy.

Therefore in MapVEu 2.0 we can completely revisit the legend/filter panel.
Here are some things we can consider in 2.0:

1. Simplify the colour palette behaviour. Maybe have the map always
   colour the 20 most populous categories in the currently visible data.
   Allow the user to freeze the current colour palette when they need to.

2. TBC


### Props

