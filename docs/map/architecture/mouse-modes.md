## Mouse modes

Not a component as such, but ...


As per [this google docs slide mock-up (private to VEuPathDB project)](https://docs.google.com/presentation/d/1L0782mpynJ4PiHRQxCVT7dODS8cFnjlYwkT1IdIAujE/edit#slide=id.g92390e28f2_0_511) it has been suggested that there are two main mouse modes (ignoring the polygon selection mode)

1. Normal
   * mouse-over raises marker to front
   * click on marker selects/deselects
2. Magnifying glass
   * mouse-over makes a big version of the marker pop up
   * marker click and map navigation same as normal mode

What we need here is

1. UI elements as per the mock-up, so that user can switch between the two modes by clicking on it.
2. Enlarged marker implementation.  People have talked about the popup plot being more interactive and perhaps use additional back end data requests, but for now I just think the popup should just use the available marker data.  For the donuts - the popup can show labels and percentages (probably using our plot-components components).  Same goes for the chart markers (though the histogram/bar plot-component isn't done yet) - these can show axis tics and labels.

