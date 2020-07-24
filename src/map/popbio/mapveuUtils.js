/**
 * DKDK gathering functions temporarily
 * Need to add export to be used in the other component
 */

//DKDK import jquery here for typescript - both worked
// import * as $ from 'jquery';
import $ from 'jquery';

//from vb-popbio-maps.js
export function geohashLevel(zoomLevel, type) {
    /*
     function geohashLevel
     date: 11/03/2015
     purpose: return the proper geohash lever to use
     inputs: zoomLevel (integer), type (string)
     outputs:
     */
    var geoLevel;

    if (type === "geohash") {
        switch (zoomLevel) {
            case 1:
            case 2:
                geoLevel = "geohash_1";
                break;
            case 3:
            case 4:
            case 5:
                geoLevel = "geohash_2";
                break;
            case 6:
            case 7:
                geoLevel = "geohash_3";
                break;
            case 8:
            case 9:
                geoLevel = "geohash_4";
                break;
            case 10:
            case 11:
                geoLevel = "geohash_5";
                break;
            case 12:
            case 13:
            case 14:
                geoLevel = "geohash_6";
                break;
            default:
                geoLevel = "geohash_7";
                break;

        }
    } else {
        // does nothing for now
        //TODO: Automatically construct the proper facet statistics object based on zoomLevel
    }
    return (geoLevel);
}

// making k over 9999, e.g., 223832 -> 234k: temporarily set over 999 for displaying purpose
export function kFormatter(num) {
    return Math.abs(num) > 9999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(0)) + 'k' : Math.sign(num)*Math.abs(num)
}

// for generating legend list: from vb-popbio-maps.js
export function mapSummarizeByToField(type) {
    var fields = {};
    switch (type) {
        case "Species":
            fields.summarize = "species_category";
            fields.type = "Taxonomy";
            fields.field = "species_category";
            break;
        case "Sample type":
            fields.summarize = "sample_type";
            fields.type = "Sample type";
            fields.field = "sample_type";
            break;
        case "Collection protocol":
            fields.summarize = "collection_protocols_category";
            fields.type = "Collection protocol";
            fields.field = "collection_protocols";
            break;
        case "Attractant":
            fields.summarize = "attractants_ss"; // may have to copyField to attractants_category
            fields.type = "Attractant";
            fields.field = "attractants_ss";
            break;
        case "Protocol":
            fields.summarize = "protocols_category";
            fields.type = "Protocol";
            fields.field = "protocols";
            break;
        case "Insecticide":
            fields.summarize = "insecticide_s";
            fields.type = "Insecticide";
            fields.field = "insecticide_s";
            break;
        case "Allele":
            fields.summarize = "genotype_name_s";
            fields.type = "Allele";
            fields.field = "genotype_name_s";
            break;
        case "Locus":
            fields.summarize = "locus_name_s";
            fields.type = "Locus";
            fields.field = "locus_name_s";
            break;
        case "Project":
            fields.summarize = "projects_category";
            // VB-7318 fields.type = Project -> Projects to fix avtive-legend
            fields.type = "Project";
            fields.field = "projects";
            break;
        case "Pathogen":
            fields.summarize = "infection_source_s";
            fields.type = "Pathogen";
            fields.field = "infection_source_s";
            break;
        case "Infection status":
            fields.summarize = "infection_status_s";
            fields.type = "Infection status";
            fields.field = "infection_status_s";
            break;
        case "Blood meal host":
            fields.summarize = "blood_meal_source_s";
            fields.type = "Blood meal host";
            fields.field = "blood_meal_source_s";
            break;
        //DKDK VB-8459
        case "Available data types":
            fields.summarize = "signposts_ss";
            fields.type = "Available data types";
            fields.field = "signposts_ss";
            break;
        //DKDK VB-8663 GPS qualifier provenance precision legend item!
        case "Location provenance":
            fields.summarize = "geolocation_provenance_s";
            // fields.summarize = "geolocation_provenance_cvterms";
            fields.type = "Location provenance";
            fields.field = "geolocation_provenance_s";
            break;
        case "Location precision":
            fields.summarize = "geolocation_precision_s";
            // fields.summarize = "geolocation_precision_cvterms";
            fields.type = "Location precision";
            fields.field = "geolocation_precision_s";
            break;
        default :
            fields.summarize = "species_category";
            fields.type = "Taxonomy";
            fields.field = "species_category";
            break;
    }
    return fields;

}

/**
 * DKDK customizing _populateLegend function from map.Legend.js for data handling (smplPalette query response)
 * leave original codes by simply blocking them
 */



    // _populateLegend: function (result, fieldName, flyTo, selectViewValue) {
export function _populateLegend(result) {
// //DKDK block
//         var options = this.options;
//         //var geohashLevel = "geohash_2";
//         if (typeof (flyTo) === 'undefined') flyTo = options.flyTo;

//         //DKDK VB-8707 add selectViewValue in the end
//         if (typeof (selectViewValue) === 'undefined' || selectViewValue === null) selectViewValue = false;

//         if (!fieldName) {
//             fieldName = options.summarizeBy;
//         } else {
//             // update map options
//             options.summarizeBy = fieldName;
//         }

        var facets = result.facets;
        var facetResults = facets.geo.buckets;

        // console.log('facets = ', facets)

// //DKDK block
//         // save max and min abundance
//         if (viewMode === 'abnd') {
//             var minAbnd = 0;
//             var maxAbnd = 0;
//         }

        var items = [];

        // parse results
        facetResults.forEach(function (el) {
            var geoTerms = el.terms.buckets;
            var i = 1;
            var count = el.count;
// //DKDK block
//             if (viewMode === 'abnd') {
//                 if (maxAbnd < el.maxAbnd) {
//                     maxAbnd = el.maxAbnd
//                 }
            // }

            geoTerms.forEach(function (inEl) {
                var ratio = inEl.count / count;
                var sumField = inEl.val;
                // var index = parseInt(i);

                var points;
                // Use a scoring scheme to make sure species with a good presence per region get a proper color (we
                // only have 20 good colours)
                switch (i) {
                    case 1:
                        points = 7 * ratio;
                        break;
                    case 2:
                        points = 3 * ratio;
                        break;
                    case 3:
                        points = 1 * ratio;
                        break;
                    default:
                        points = 0;
                        break
                }

                if (items.hasOwnProperty(sumField)) {
                    items[sumField] += points;
                } else {
                    items[sumField] = points;
                }
                i++;
            });
        });

        // console.log('items = ', items)

// //DKDK block
//         // set trafficlight options
//         var trafficlight = options.trafficlight;

//         trafficlight.colorBrewer = viewMode === 'ir' ?
//             L.ColorBrewer.Diverging.RdYlBu[10].slice() :
//             L.ColorBrewer.Sequential.BuPu[9].slice()

//         if (viewMode === 'ir') {
//             trafficlight.scale = new L.CustomColorFunction(0, 1, options.trafficlight.colorBrewer, {interpolate: true});
//         }

//DKDK this is replaced with generatePalette call
        // var sortedItems = this._sortHashByValue(items);
        // this.items = items;
        // this.sortedItems = sortedItems;
        // this._setPalette();
        var sortedItems = _sortHashByValue(items);
        // console.log('sortedItems = ', sortedItems)
        var colorPalette = generatePalette(sortedItems);
        //DKDK React add return here
        return colorPalette;

// //DKDK block
        // //Initialize tooltip only if it has not been initialized already
        // if ($(".legend").attr("data-original-title") === undefined) {
        //     $(".legend").tooltip({
        //         title: "Click to add search terms",
        //         delay: { "show": 1000, "hide": 0 }
        //     });
        // }

        // // moved this here to avoid querying SOLR before the palette is done building
        // //DKDK VB-8707 add selectViewValue in the end
        // // filterMarkers($("#search_ac").tagsinput('items'), flyTo)
        // filterMarkers($("#search_ac").tagsinput('items'), flyTo, selectViewValue)
}


    //DKDK add generatePalette from map.Legend.js and add more functions inside for customizing
    /*
     function generatePalette
     date: 17/03/2015
     purpose:
     inputs: {items} a list of items to be associated with colors,
     {mColors} the number of maximum colors in the palette
     {paletteType} 1 for Kelly's 2 for Boytons'
     outputs: an associative array with items names as the keys and color as the values
     */
function generatePalette(items) {
    // var options = this.options;
    var numberOfColors = 20  // still not using this :(
    var newPalette = {};
    var limitedPalette = {};

    // from http://stackoverflow.com/questions/470690/how-to-automatically-generate-n-distinct-colors
    var kelly_colors_hex = [
        "#FFB300", // Vivid Yellow
        "#803E75", // Strong Purple
        "#FF6800", // Vivid Orange
        "#A6BDD7", // Very Light Blue
        "#C10020", // Vivid Red
        "#CEA262", // Grayish Yellow
        // "#817066", // Medium Gray

        // The following don't work well for people with defective color vision
        "#007D34", // Vivid Green
        "#F6768E", // Strong Purplish Pink
        "#00538A", // Strong Blue
        "#FF7A5C", // Strong Yellowish Pink
        "#53377A", // Strong Violet
        "#FF8E00", // Vivid Orange Yellow
        "#B32851", // Strong Purplish Red
        "#F4C800", // Vivid Greenish Yellow
        "#7F180D", // Strong Reddish Brown
        "#93AA00", // Vivid Yellowish Green
        "#593315", // Deep Yellowish Brown
        "#F13A13", // Vivid Reddish Orange
        "#232C16" // Dark Olive Green
    ];

    // from http://alumni.media.mit.edu/~wad/color/palette.html
    var boytons_colors_hex = [
        "#000000", // Black
        "#575757", // Dark Gray
        "#A0A0A0", // Light Gray
        "#FFFFFF", // White
        "#2A4BD7", // Blue
        "#1D6914", // Green
        "#814A19", // Brown
        "#8126C0", // Purple
        "#9DAFFF", // Light Purple
        "#81C57A", // Light Green
        "#E9DEBB", // Cream
        "#AD2323", // Red
        "#29D0D0", // Teal
        "#FFEE33", // Yellow
        "#FF9233", // Orange
        "#FFCDF3"  // Pink
    ];

    var numItems = items.length,
        stNumItems = numItems, // store the number of items
        hasNoData = false;

    for (var i = 0; i < stNumItems; i++) {
        // if (typeof items[i] === 'object') {
        if (i === numberOfColors) break;
        var item = items[i][0];

        // is this 'no data'? Make sure is black. Also temporarily remove from the array and add it last after
        // grayscale colours have been assigned
        if (item === 'no data') {
            hasNoData = true;
            continue;
        }

        newPalette[item] = kelly_colors_hex[i];
        numItems--; // track how many items need a grayscale color
    }

    if (hasNoData) {
        newPalette['no data'] = "#000000";
        numItems--;
    }

    var lumInterval = 0.5 / numItems;
    var lum = 0.7;

    for (var c = 0; c < numItems; c++) {
        var element = stNumItems - numItems + c;
        var item = items[element][0];
        //DKDK React
        // newPalette[item] = _colorLuminance("#FFFFFF", -this.lum);
        newPalette[item] = _colorLuminance("#FFFFFF", -lum);
        lum -= lumInterval;
    }

    // console.log('newPalette = ', newPalette)

    return newPalette;
}

//DKDK taken from map.Legend.js
    /*
     function _colorLuminance
     date: 20/03/2015
     purpose: extracts the red, green and blue values in turn, converts them to decimal, applies the luminosity factor,
     and converts them back to hexadecimal.
     inputs: <hex> original hex color value <lum> level of luminosity from 0 (lightest) to 1 (darkest)
     outputs: a hex represantation of the color
     source: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
     */

function _colorLuminance(hex, lum) {
    // validate hex string
    "use strict";

    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

//DKDK taken from mal.Legend.js
// Get a simple associative array (key-value) and sort it by value
function _sortHashByValue(hash) {
    var tupleArray = [];
    for (var key in hash) if (hash.hasOwnProperty(key)) tupleArray.push([key, hash[key]]);
    tupleArray.sort(function (a, b) {
        return b[1] - a[1]
    });
    return tupleArray;
}

// function highlightMarker(marker) {
//     // $(marker).addClass("highlight-marker");
//     $(marker._icon).addClass("highlight-marker");

//     //Update the highlightedID variable
//     PopulationBiologyMap.data.highlightedId = marker._icon.id;

//     // highlight = marker;
//     if (firstClick) firstClick = false;
// }

// function moveTopMarker(marker) {
//     $(marker._icon).addClass("top-marker");
// }

// function removeTopMarker(marker) {
//     // check for highlight
//     $(marker._icon).removeClass("top-marker");
// }

//DKDK remove highlighted marker - need jquery
export function removeHighlight(marker) {
    //DKDK much convenient to use jquery here
    $(".highlight-marker").removeClass("highlight-marker")
}