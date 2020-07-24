//DKDK this file is based on Icon.Canvas.popbio.js (customized for ClinEpiDB map demo)
//DKDK use import below for react-leaflet
import L from "leaflet";

// DKDK taken from Icon.Canvas.js
L.Icon.Canvas = L.Icon.extend({
    options: {
        iconSize: new L.Point(20, 20), // Have to be supplied
        className: 'leaflet-canvas-icon',
        // className: 'leaflet-canvas-icon leaflet-marker-icon-anim',   //DKDK do we need to have leaflet-marker-icon-anim here?
        population: 0,
        stats: [],
        // DKDK add below fields for ClinEpiDB only - no longer needed
        // projColor: '',
    },

    createIcon: function () {
        var e = document.createElement('canvas');
        this._setIconStyles(e, 'icon');
        var s = this.options.iconSize;
        var pop = this.options.population;
        e.width = s.x;
        e.height = s.y;
        e.id = this.options.id;
        //DKDK 070720 block this as markers is not assigned to this library yet
        // this.options.selected = markers.isSelected(this.options.id);
        this.draw(e.getContext('2d'), s.x, s.y);
        return e;
    },

    createShadow: function () {
        return null;
    },

    // DKDK taken from mapLegend.js
    markerColor: function (value) {
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

    draw: function (canvas, width, height) {

        var iconSize = this.options.iconSize.x, iconSize2 = iconSize / 2, iconSize3 = iconSize / 2.5, iconSize4 = iconSize / 3;
        var pi2 = Math.PI * 2;

        var start = Math.PI * 1.5;
        //var start = Math.PI * 2;
        var stats = this.options.stats;
        var markerText = this.options.markerText;

        var count = 0; // before VB-8044 was this.options.count;
        stats.forEach( function(el) { count += el.value; })

        var atomic = this.options.atomic;
        var selected = this.options.selected;


        // var cumulativeCount = this.options.cumulativeCount;
        stats.forEach(function (el) {


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

//DKDK this does not work as is
// // DKDK taken from map.multipleMarkers.js
// L.Map.SelectMarkers = L.Class.extend({
//     // markersLayer: L.featureGroup()
//     //     .addTo(map),

//     initialize: function (map) {
//         // this map
//         this._map = map;
//         this._container = map._container;
//         this._pane = map._panes.overlayPane;
//         this.selectedMarkersIDs = {};


//         // store selected markers here
//         this._selectedMarkers = L.featureGroup();
//         // .addTo(map);
//         this.addHooks();
//         map.on('unload', this._destroy, this);
//     },

//     // markersLayer: L.featureGroup()
//     //     .addTo(this._map)
//     // ,
//     addHooks: function () {
//         L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
//         this._selectedMarkers.on('layeradd', this._onLayerAdd);
//     },

//     removeHooks: function () {
//         L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
//     },

//     _onLayerAdd: function (e) {
//         // console.dir(e);
//         // highlightMarker(e.layer)
//     },

//     moved: function () {
//         return this._moved;
//     },


//     _destroy: function () {
//         this.removeHooks();
//         L.DomUtil.remove(this._pane);
//         delete this._pane;
//     },

//     _resetState: function () {
//         this._moved = false;
//     },

//     _onMouseDown: function (e) {
//         if (!e.ctrlKey || ((e.which !== 1) && (e.button !== 1))) {
//             return false;
//         }

//         map.dragging.disable();
//         this._resetState();

//         L.DomUtil.disableTextSelection();
//         L.DomUtil.disableImageDrag();

//         this._startPoint = this._map.mouseEventToContainerPoint(e);

//         L.DomEvent.on(document, {
//             contextmenu: L.DomEvent.stop,
//             mousemove: this._onMouseMove,
//             mouseup: this._onMouseUp,
//             keydown: this._onKeyDown
//         }, this);

//     },

//     _onMouseMove: function (e) {
//         if (!this._moved) {
//             this._moved = true;

//             this._box = L.DomUtil.create('div', 'leaflet-select-box', this._container);
//             L.DomUtil.addClass(this._container, 'leaflet-crosshair');

//             this._map.fire('boxselectstart');
//         }

//         this._point = this._map.mouseEventToContainerPoint(e);

//         var bounds = new L.bounds(this._point, this._startPoint),
//             size = bounds.getSize();

//         L.DomUtil.setPosition(this._box, bounds.min);

//         this._box.style.width = size.x + 'px';
//         this._box.style.height = size.y + 'px';
//     },

//     _finish: function () {
//         if (this._moved) {
//             L.DomUtil.remove(this._box);
//             L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
//         }

//         L.DomUtil.enableTextSelection();
//         L.DomUtil.enableImageDrag();

//         L.DomEvent.off(document, {
//             contextmenu: L.DomEvent.stop,
//             mousemove: this._onMouseMove,
//             mouseup: this._onMouseUp,
//             keydown: this._onKeyDown
//         }, this);
//         map.dragging.enable();

//     },

//     _onMouseUp: function (e) {

//         if ((e.which !== 1) && (e.button !== 1)) {
//             return;
//         }

//         this._finish();

//         if (!this._moved) {
//             return;
//         }
//         // Postpone to next JS tick so internal click event handling
//         // still see it as "moved".
//         setTimeout(L.Util.bind(this._resetState, this), 0);

//         var bounds = new L.LatLngBounds(
//             this._map.containerPointToLatLng(this._startPoint),
//             this._map.containerPointToLatLng(this._point));

//         this._map.fire('boxselectend', {boxSelectBounds: bounds});

//         var selectMarkers = this;
//         // var markersLayer = this._selectedMarkers;

//         console.dir(bounds)
//         geohashesGrid.eachLayer(function (layer) {
//             if (layer.hasOwnProperty('_bounds')) {

//                 // console.dir(layer._bounds);
//                 // console.dir(layer._boundsToLatLngs());
//                 if (bounds.overlaps(layer._bounds)) {
//                     selectMarkers.toggleGeohash(layer, assetLayerGroup);

//                 }
//             }
//         });

//         // assetLayerGroup.eachLayer(function (layer) {
//         //     if (layer instanceof L.Marker) {
//         //
//         //         if (bounds.contains(layer.getLatLng())) {
//         //
//         //             selectMarkers.toggleMarker(layer, assetLayerGroup);
//         //         }
//         //     }
//         //
//         //
//         // });
//         var zoomLevel = this._map.getZoom();
//         var geoLevel = geohashLevel(zoomLevel, "geohash");
//         if (urlParams.grid === "true" || $('#grid-toggle').prop('checked')) addGeohashes(map, geoLevel.slice(-1));


//     },

//     _onKeyDown: function (e) {
//         if (e.keyCode === 27) {
//             this._finish();
//         }
//     },

//     getRandom: function (min, max) {
//         return Math.random() * (max - min + 1) + min;
//     },

//     toggleMarker: function (marker, layer) {

//         var selected = marker.options.icon.options.selected,
//             markerID = marker.options.icon.options.id,
//             thisObj = this;
//         // remove marker from the layer
//         var icon = marker._icon;

//         layer.removeLayer(marker);
//         if (selected) {
//             marker.options.icon.options.selected = false;
//             thisObj._selectedMarkers.removeLayer(marker);
//             thisObj.selectedMarkersIDs[markerID] = false;

//         } else {

//             marker.options.icon.options.selected = true;
//             thisObj._selectedMarkers.addLayer(marker);
//             thisObj.selectedMarkersIDs[markerID] = true;
//         }
//         layer.addLayer(marker);

//         // is marker already selected?

//         // get marker ID
//         // save the marker id
//         // marker.options.icon.options.selected = true;
//         // marker.options.icon.createIcon();
//         // console.log(marker.getLatLng().toString())
//     },

//     toggleGeohash: function (geohashGrid, layer) {

//         var selected = geohashGrid.options.selected,
//             goehashID = geohashGrid.options.title,
//             thisObj = this;
//         // remove marker from the layer
//         // var icon = geohashGrid._icon;

//         // layer.removeLayer(geohashGrid);
//         if (selected) {
//             geohashGrid.options.selected = false;
//             // thisObj._selectedMarkers.removeLayer(geohashGrid);
//             thisObj.selectedMarkersIDs[goehashID] = false;

//         } else {

//             geohashGrid.options.selected = true;
//             thisObj.selectedMarkersIDs[goehashID] = true;
//         }

//         // is marker already selected?

//         // get marker ID
//         // save the marker id
//         // marker.options.icon.options.selected = true;
//         // marker.options.icon.createIcon();
//         // console.log(marker.getLatLng().toString())
//     },

//     isSelected: function (markerId) {
//         if (_.size(this.selectedMarkersIDs) === 0) return false;
//         if (this.selectedMarkersIDs[markerId]) {
//             return "self";
//         } else {
//             for (var i = 0, len = markerId.length; i < len; i++) {
//                 var idCopy = markerId.slice(0, (len - i));
//                 if (this.selectedMarkersIDs[idCopy]) {
//                     return "child"
//                 }
//             }


//             var regexStr = new RegExp("^" + markerId);
//             for (var key in this.selectedMarkersIDs) {
//                 if (this.selectedMarkersIDs.hasOwnProperty(key)) {
//                     var targetId = this.selectedMarkersIDs[key]
//                     if (regexStr.test(key) && targetId) {
//                         return "parent"
//                     }
//                 }
//             }


//             return false;
//         }
//     },

//     clearMarkers: function () {

//     }
// });

// DKDK taken from vb-popbio-maps.js
function getContrastYIQ(hexcolor) {
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
