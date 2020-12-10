// DKDK an example of a sidebar component
import React from 'react';
import { Sidebar, Tab } from './SidebarReactCoreDisabled'
//DKDK modified version of typescript definition for react-leaflettaken
import { SidebarProps } from './type-react-leaflet-sidebarv2'

//DKDK testing to separate a component for tab content
import TabHomeContent from './TabHomeContent'

/**
 * DKDK this is an example of Sidebar component
 */

//DKDK add this for array testing purpose
interface SidebarPropsArray extends SidebarProps {
    tabDisabledList: string[];
}

//DKDK added the check of disabled icon based on tabDisabledList and its id
export default function SidebarListDisabled(props: SidebarPropsArray) {

    let testText = 'this is Home'

  return (
    <Sidebar
        id={props.id}
        collapsed={props.collapsed}
        position={props.position}
        selected={props.selected}
        closeIcon={props.closeIcon}
        onOpen={props.onOpen}
        onClose={props.onClose}
    >
        <Tab id="home" header="Home" icon="fas fa-home" disabled={props.tabDisabledList.includes('home') ? true : false}>
            {/* DKDK a test to separate tab contents into a component, TabHomeContent */}
            <TabHomeContent
                id={'home'}
                header={testText}
            />
        </Tab>
        {/* DKDK testing disabled - greyish icon*/}
        <Tab id="settings" header="Settings" icon="fas fa-cog" disabled={props.tabDisabledList.includes('settings') ? true : false}>
            <p>Change settings</p>
        </Tab>
        {/* DKDK add disabled tap - no header & icon, use both diabled and divider */}
        <Tab id="gap1" header="" icon="" disabled divider>
            <p>gap1</p>
        </Tab>
        <Tab id="marker-table" header="Details for selected samples" icon="fas fa-table" disabled={props.tabDisabledList.includes('marker-table') ? true : false}>
            <p>Detailed table???</p>
        </Tab>
        <Tab id="export" header="Export Data" icon="fas fa-download" disabled={props.tabDisabledList.includes('export') ? true : false}>
            <p>Download data</p>
        </Tab>
        {/* DKDK add disabled tap - no header & icon, use both diabled and divider */}
        <Tab id="gap2" header="" icon="" disabled divider>
            <p>gap2</p>
        </Tab>
        <Tab id="plot" header="Summary" icon="fas fa-chart-pie" disabled={props.tabDisabledList.includes('plot') ? true : false}>
            <p>For plots</p>
        </Tab>
        {/* DKDK no box plot icon exists in fontawesome */}
        <Tab id="boxplot" header="Box Plot" icon="fas fa-percent" disabled={props.tabDisabledList.includes('boxplot') ? true : false}>
            <p>No box plot icon exists in the fontawesome</p>
        </Tab>
        <Tab id="graph" header="Chart" icon="fas fa-chart-bar" disabled={props.tabDisabledList.includes('graph') ? true : false}>
            <p>This is for chart</p>
        </Tab>
        {/* DKDK placing bottom side using  anchor="bottom" attribute */}
        <Tab id="help" header="Tutorial" icon="fas fa-question" anchor="bottom" disabled={props.tabDisabledList.includes('help') ? true : false}>
            <p>Help/Tutorial</p>
        </Tab>
    </Sidebar>
  );
}

