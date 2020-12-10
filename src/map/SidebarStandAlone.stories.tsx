/* DKDK stand alone sidebar */

import React, { useState } from 'react';

//DKDK for SidebarBasic()
import SidebarList from './SidebarList'

//DKDK for SidebarArrayProps()
import SidebarListArray from './SidebarListArray'
//DKDK testing to import component and send it to array
import TabHomeContent from './TabHomeContent'

//DKDK for SidebarDisabled()
import SidebarListDisabled from './SidebarListDisabled'


export default {
  title: 'DK Sidebar Tests/Sidebar stand-alone',
  component: SidebarList,
};

/* DKDK SidebarOnly() simply implemented a stand-alone sidebar: manually assigned tabs
 * each tab hosts a sub-component for contents
 */
export const SidebarBasic = () => {
  //DKDK Sidebar state managements
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState(true);
  const [ tabSelected, setTabSelected ] = useState('');   //DKDK could be used to set default active tab, e.g., 'Home', but leave blank

  //DKDK this is X button/icon behavior
  const sidebarOnClose = () => {
    setSidebarCollapsed(true)
  }

  const sidebarOnOpen = (id: string) => {
    //DKDK add a function to close drawer by clicking the same icon
    if (tabSelected != id) {
      setSidebarCollapsed(false)
      setTabSelected(id)
    } else {
      setSidebarCollapsed(true)
      //DKDK clear tabSelected so that the tab can be reopen
      setTabSelected('')
    }
  }

  return (
    //DKDK add fragment
    <>
      <SidebarList
        id="leaflet-sidebar"
        collapsed={sidebarCollapsed}
        position='left'
        selected={tabSelected}
        closeIcon='fas fa-times'
        onOpen={sidebarOnOpen}
        onClose={sidebarOnClose}
      />
    </>
  );
}

/* DKDK SidebarArrayProps() tried to dynamically generate tabs based on array props (e.g., tabItems, etc.)
 * Each tab hosts a sub-component for contents but dynamically generated based on tabContentComponent props
 * Although this approach seems to work fine, IMO, this is overkill and unnecessarily verbose
 */
export const SidebarArrayProps = () => {
  //DKDK Sidebar state managements
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState(true);
  const [ tabSelected, setTabSelected ] = useState('');   //DKDK could be used to set default active tab, e.g., 'Home', but leave blank

  //DKDK this is X button/icon behavior
  const sidebarOnClose = () => {
    setSidebarCollapsed(true)
  }

  const sidebarOnOpen = (id: string) => {
    //DKDK add a function to close drawer by clicking the same icon
    if (tabSelected != id) {
      setSidebarCollapsed(false)
      setTabSelected(id)
    } else {
      setSidebarCollapsed(true)
      //DKDK clear tabSelected so that the tab can be reopen
      setTabSelected('')
    }
  }

  //DKDK make array props for generating tabs
  let tabItems = ['home','settings','divider1','marker-table','export','divider2','plot','box-plot','gragh','help']
  let tabAnchor: ('top' | 'bottom' | undefined)[] = ['top','top','top','top','top','top','top','top','top','bottom']
  let tabHeader = ['home header','settings header','gap header','marker-table  header','export  header','gap  header','plot  header','box-plot header','gragh header','help header']
  let tabIcons = ['fas fa-home','fas fa-cog','','fas fa-table','fas fa-download','','fas fa-chart-pie','fas fa-percent','fas fa-chart-bar','fas fa-question']
  let tabActive = [false,true,true,false,false,true,false,false,false,false]
  //DKDK testing to send component with props
  let tabContentComponent = [<TabHomeContent id={tabItems[0]} header={tabItems}/>,'settings header','gap header','marker-table  header','export  header','gap  header','plot  header','box-plot header','gragh header','help header']

  return (
    //DKDK add fragment
    <>
      <SidebarListArray
        id="leaflet-sidebar"
        collapsed={sidebarCollapsed}
        position='left'
        selected={tabSelected}
        closeIcon='fas fa-times'
        onOpen={sidebarOnOpen}
        onClose={sidebarOnClose}
        tabItems={tabItems}
        tabAnchor={tabAnchor}
        tabHeader={tabHeader}
        tabIcons={tabIcons}
        tabActive={tabActive}
        tabContentComponent={tabContentComponent}
      />
    </>
  );
}

/* DKDK SidebarDisabled() tried to used a concept of a template
 * In a realistic situation, all tabs are pre-fixed and only enabled/disabled per data type or view (like Sample, Genotype, etc.)
 * This is similar to current mapveu v1
 * Accordingly, only single array props is utilized to list disabled tabs (for a data/view), tabDisabledList, and control it
 * SidebarListDisabled component has all tabs listed, but dynamically controlled for enabling/disabling tab via tabDisabledList props
 * IMO, this is arguably the most reasonable approach for our purpose
 */
export const SidebarDisabled = () => {
  //DKDK Sidebar state managements (for categorical)
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState(true);
  const [ tabSelected, setTabSelected ] = useState('');   //DKDK could be used to set default active tab, e.g., 'Home', but leave blank

  //DKDK this is X button/icon behavior
  const sidebarOnClose = () => {
    setSidebarCollapsed(true)
  }

  const sidebarOnOpen = (id: string) => {
    //DKDK add a function to close drawer by clicking the same icon
    if (tabSelected != id) {
      setSidebarCollapsed(false)
      setTabSelected(id)
    } else {
      setSidebarCollapsed(true)
      //DKDK clear tabSelected so that the tab can be reopen
      setTabSelected('')
    }
  }

  //DKDK make array props for making disabled icon(s)
  let tabDisabledList = ['settings','export','boxplot']

  return (
    //DKDK add fragment
    <>
      <SidebarListDisabled
        id="leaflet-sidebar"
        collapsed={sidebarCollapsed}
        position='left'
        selected={tabSelected}
        closeIcon='fas fa-times'
        onOpen={sidebarOnOpen}
        onClose={sidebarOnClose}
        tabDisabledList={tabDisabledList}
      />
    </>
  );
}