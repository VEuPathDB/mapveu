/**
 * DKDK gathering functions temporarily
 * Need to add export to be used in the other component
 */

//DKDK import jquery here for typescript - both worked
// import * as $ from 'jquery';
import $ from 'jquery';

//DKDK remove highlighted marker - need jquery
export function removeHighlight(marker) {
    //DKDK much convenient to use jquery here
    $(".highlight-marker").removeClass("highlight-marker")
}

