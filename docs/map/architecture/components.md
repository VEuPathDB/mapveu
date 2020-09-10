# List of likely MapVEu components

## The map itself

![map component screenshot](images/map-component.png)

The screenshot shows the whole application but what concerns us here is the zoomable/pannable map only.

It is this component that is likely to handle user-drawn polygons for
selection.  Once a polygon is drawn, does it become a child component
(like a Marker)?  Polygon drawing should likely be a configurable feature though.

### Props

* viewport
  * center (lat,long)
  * zoom level (Leaflet zoom, integer)
* height
* width
* markers (array of ReactElement)
* nudge ("geohash" | "none" | null)
* layers? (raster and vector layer data)

* onViewportChanged : `({ bounds, zoomLevel }) => void` 
* onDrawnPolygon : `( { id, geometry }) => void`  (communicate newly drawn polygon to outside world)

### Children

All the components below are likely to be children of the map
component, because things like the zoom controls, legend, search box
and the chart drawer will need to be handled by Leaflet plugins (I think).


## Markers layer

![markers screenshot](images/markers.png)

Displays markers of different component types.

### Props

* markers (see map component above)
* onViewportChanged (see map component above)

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
* selected : Boolean
* values : number[] (these are the amounts represented in the mini-donut chart, e.g. the counts per species)
* labels : string[] (these are the labels, e.g. species names, that won't normally be displayed due to space limits, but might be if you mouse-over a marker to expand it)
* colors : colorSpec[]  (array of colours, or mapping from label to colour?)
* value : string | number (value to be shown in the center of the donut)

* onSelected : `({id, extent}) => void`
* onDeselected : `({id, extent}) => void`


## Mini Histogram Marker

(no screenshot or mock-up yet)

Non-categorical fields (numeric or date) will probably have to have
tiny histogram markers.  That's because it doesn't make much sense to
visualise distributions of numeric or date variables in a circle (why
should 1970 be next to 2020?).

Should be NO MORE THAN ABOUT 5 BINS in my opinion.  For interpretability
the bins should be the same for all markers.

Colours? Not sure individual colours per bin are needed.  Or a gradient?

### Props

* id : string (if aggregating on geohash strings, this should be the geohash string)
* position : LatLong
* extent : Geometry (bbox or other geometry (e.g. convex hull) to show geographic extent of data aggregated "under" the marker)
* selected : Boolean
* values : number[] (these are the amounts represented by bar height, e.g. the counts per year bin)
* labels : string[] (string labels, e.g. 1982-1994, 1995-2003, possibly for click/mouseover enlarged version)

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

For categorical variables (first example with "overflow")

![screenshot](images/filter-legend.png)

For numeric and date variables

![screenshot](images/filter-legend-numeric.png)

### Behaviour

There needs to be a button/link to open up the filter (see the thing
hanging off the bottom).

#### Categorical

It will only display the top 10 (sorting reverse numeric order on
'values') categories. If there are more than 10 it will show the
Others link (and total).  Clicking anywhere on the Others line will
open the "full filter" for this variable.

Clicking on items in the legend will NOT add a filter for that category.
We may decide that **any** click will open up the actual filter (which
can handle multiple selections).

#### Numeric

There will never be more than 5 bins (plus an optional 6th bin for "no data" counts).

The values will be counts or some other aggregate statistic returned from the back end.

### Props

```typescript
  legendType : 'categorical' | 'numeric' | 'date',
  data : {
    label : string,
    value : number,
    color : string
  }[],
  quantityLabel : string, // ** comment below

```


** MapVEu 1.0 Sample View shows counts of records in the
   legend/filter, but Abundance View shows an aggregate statistic
   based on sample_size_i and the unique number of values for another
   field.  So we will want to provide this and display it in the
   legend. In numeric/date legends it is obviously located next to the
   y-axis.  In categorical legends, I'm not sure where it could go.
   

