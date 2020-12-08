// DKDK an example of a sidebar component
import React from 'react';
import { Sidebar, Tab } from './SidebarReactCoreArray'
//DKDK modified version of typescript definition for react-leaflettaken
import { SidebarProps } from './type-react-leaflet-sidebarv2'

//DKDK testing to separate a component for tab content
import TabHomeContent from './TabHomeContent'

/**
 * DKDK this is an example of Sidebar component
 */

//DKDK add this for array testing purpose
interface SidebarPropsArray extends SidebarProps {
    tabItems: string[];
    // tabAnchor: string[];
    tabAnchor: ('top' | 'bottom' | undefined)[];
    tabHeader: string[];
    tabIcons: string[];
    tabActive: boolean[];
    //DKDK for now, set tabContentComponent to be any[] for hosting a component
    tabContentComponent: any[];
}

//DKDK
export default function SidebarListArray(props: SidebarPropsArray) {
  /**
   * DKDK think it may be better to separate Tabs as sub-components in the future?
   */
  let testText = 'this is Home'

  /* DKDKDK testing to generate tabs based on array props
   * However, not quite sure if this is desirable
   * Presuming that tab icons and the locations of dividers are more or so static,
   * then perhaps a better way is to list all tab items and only control 'disabled' of tab icon
   */
//
  let renderTab = props.tabItems.map((tab, index) => {

    return (
      <Tab key={'tab' + index} id={props.tabItems[index]} header={props.tabHeader[index]} icon={props.tabIcons[index]} anchor={props.tabAnchor[index] ? props.tabAnchor[index] : undefined } disabled={props.tabActive[index]}  divider={props.tabItems[index].includes('divider') ? true : false}>
        {props.tabContentComponent[index]}
      </Tab>
    )

  }); //DKDK end of renderTab


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
        {/* DKDK call renderTab to generate tabs */}
        {renderTab}

    </Sidebar>
  );
}

