//DKDK sample legend
import React from 'react';
//DKDK import LegendList
import LegendList from './LegendList';
//DKDK import BarChart
import BarChartLegend from './BarChartLegend';

//DKDK legend tutorial info
import LegendListInfo from "./LegendListInfo"

//DKDk import react-boostrap
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
//DKDK import legend css for positioning and custom dropdown CSS
import './legend-style.css'

//DKDK type def for legend: some are set to optional for now
export interface LegendProps {
  // className: string
  legendType : string,    //'categorical' | 'numeric' | 'date',
  data : {
    label : string, // categorical e.g. "Anopheles gambiae"
                    // numeric e.g. "10-20"
    value : number,
    color : string,
  }[],
  variableLabel? : string, // e.g. Species or Age
  quantityLabel? : string, // ** comment below

  onShowFilter? : () => {},  // callback to open up filter panel
  onShowVariableChooser? : () => {}, // callback to open up variable selector

  //DKDK add dropdown props for dynamic change
  dropdownTitle: string,
  dropdownHref: string[],
  dropdownItemText: string[],
}

//DKDK make legend at the map without using L.Control
const MapVeuLegendSampleDropdown = (props: LegendProps) => {
  //DKDK simplifying
  if (props.legendType === 'categorical') {
    return (
      //DKDK add below divs for benefeting from pre-existing CSS (vb-popbio-maps.css)
      <div className="info legend">
        <div className="legend-contents">
          {/* DKDK add react-bootstrap dropdown and dynamically generate menu items */}
          <Dropdown>
            <Dropdown.Toggle variant="success" id="legend-dropdown-category">
              {props.dropdownTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu className="legend-dropdown-menu">
              {props.dropdownItemText.map((item: string, index: number) => (
                <Dropdown.Item  key={props.dropdownItemText[index]} href={props.dropdownHref[index]} className="legend-dropdown-item">{item}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <br />
          <LegendList
            // legendType={legendTypeValue}
            data={props.data}
            // divElement={div}
          />
          <br />
          {/* DKDK add tutorial info component here */}
          <LegendListInfo
            //DKDK for now no need to have props
            legendType={props.legendType}
          />
        </div>
      </div>
    )
  } else {
    //DKDK for bar chart
    const plotType = 'bar'
    const plotLibrary = 'plotly'
    const colorMethod = 'discrete'
    //DKDK perhaps we should send x-/y-axes labels too
    const xAxisLabel = props.variableLabel
    const yAxisLabel = props.quantityLabel
    //DKDK width and height are set to 250 for now
    const plotSize = 250
    //DKDK we may also need to consider other props such as font sizes for x-/y-axes labels, tick labels, etc.
    const axisLabelSize = 12
    const tickLabelSize = 10

    //DKDK currently BarChart requires array data, e.g., labels: string[], etc., so need to make arrays
    let labels: string[] = [];
    let values: number[] = [];
    let colors: string[] = [];
    props.data.forEach((data) => {
      labels.push(data.label)
      values.push(data.value)
      colors.push(data.color)
    })

    return (
      //DKDK add below div for benefeting from pre-existing CSS (vb-popbio-maps.css)
      <div className="info legend">
        {/* DKDK add react-bootstrap dropdown and dynamically generate menu items */}
        <Dropdown key={props.dropdownTitle}>
          <Dropdown.Toggle variant="success" id="legend-dropdown-chart">
            {props.dropdownTitle}
          </Dropdown.Toggle>
          <Dropdown.Menu className="legend-dropdown-menu">
            {props.dropdownItemText.map((item: string, index: number) => (
                <Dropdown.Item key={props.dropdownItemText[index]} href={props.dropdownHref[index]} className="legend-dropdown-item">{item}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <br />
        <BarChartLegend
          labels={labels}
          values={values}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          axisLabelSize={axisLabelSize}
          tickLabelSize={tickLabelSize}
          yAxisRange={null}
          width={plotSize}
          height={plotSize}
          type={plotType}
          library={plotLibrary}
          colors={colors}
          colorMethod={colorMethod}
        />
        <br />
        <LegendListInfo
          //DKDK for now no need to have props
          legendType={props.legendType}
        />
      </div>
    )
  }
};

export default MapVeuLegendSampleDropdown;