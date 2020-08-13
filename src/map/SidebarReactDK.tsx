/**
   DKDK converting prop-types to typescript and some additional changes
        cleanning typescript errors
   Todo?: a) it may be better to separate Tabs into sub-components?
            (i.e., a compoenent for each Tab)
          b) converting to function component?
 */
import React from 'react'
import { MapComponent } from 'react-leaflet'
//DKDK customized typescript by DK for react-leaflet-sidebarv2
import { SidebarProps, TabProps } from './react-leaflet-sidebarv2-DK'
// import PropTypes from 'prop-types'
// import { LeafletMouseEvent } from 'leaflet'
// import L from 'leaflet'

class Tab extends React.Component<TabProps, any> {
  render() {
    const active = this.props.active ? ' active' : '';
    var closeIcon;
    if (typeof(this.props.closeIcon) === 'string')
      closeIcon = <i className={this.props.closeIcon} />;
    else if (typeof(this.props.closeIcon) === 'object')
      closeIcon = this.props.closeIcon;
    else {
      //DKDK change fontawesome fa to fas
      const closecls = this.props.position === 'right' ? "fas fa-caret-right" : "fas fa-caret-left";
      closeIcon = <i className={closecls} />
    }
    return (
      // DKDK change className
      <div id={this.props.id} className={"leaflet-sidebar-pane" + active}>
        <h1 className="leaflet-sidebar-header">
          {this.props.header}
          <div className="leaflet-sidebar-close" onClick={this.props.onClose}>
            {closeIcon}
          </div>
        </h1>
        {this.props.children}
      </div>
    );
  }
}

//DKDK using type definition from react-leaflet-sidebarv2.ts
// // https://github.com/facebook/react/issues/2979#issuecomment-222379916
// const TabType = PropTypes.shape({
//   type: PropTypes.oneOf([Tab])
// });
type TabType = React.ReactElement<Tab> | Array<React.ReactElement<Tab>>;

//DKDK changed MapComponent to React.Component
// class Sidebar extends MapComponent<LeafletElement, Props> {
class Sidebar extends React.Component<SidebarProps, any> {

  onClose(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClose && this.props.onClose();
  }

  onOpen(e: React.MouseEvent, tabid: string) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onOpen && this.props.onOpen(tabid);
  }

  //DKDK temporarily set tab as any or Tab type?
  renderTab(tab: any) {
    var icon;
    if (typeof(tab.props.icon) === 'string')
      icon = <i className={tab.props.icon} />;
    else if (typeof(tab.props.icon) === 'object')
      icon = tab.props.icon;
    const active = tab.props.id === this.props.selected ? ' active' : '';
    const disabled = tab.props.disabled ? ' disabled' : '';
    return (
      //DKDK add title attribute here for tooltip effect
      <li className={active + disabled} key={tab.props.id} title={tab.props.header}>
        <a href={'#' + tab.props.id} role="tab" onClick={e => tab.props.disabled || this.onOpen(e, tab.props.id)}>
          {icon}
        </a>
      </li>
    );
  }

  //DKDK children here is a content inside <Tab> so set it as any for now
  renderPanes(children: any) {
    return React.Children.map(children,
        p => React.cloneElement(p, {onClose: this.onClose.bind(this),
                                    closeIcon: this.props.closeIcon,
                                    active: p.props.id === this.props.selected,
                                    position: this.props.position || 'left'}));
  }

  // Override render() so the <Map> element contains a div we can render to
  render() {
    //DKDK change sidebar -> leaflet-sidebar
    const position = ' leaflet-sidebar-' + (this.props.position || 'left');
    const collapsed = this.props.collapsed ? ' collapsed' : '';

    const allTabs = React.Children.toArray(this.props.children).filter(c => !!c);
    // console.log('tabs = ', allTabs)
    //DKDK for now tab type at filter() is set to any for avoiding the type error on tab.props
    const bottomtabs = allTabs.filter((tab: any) => tab.props.anchor === 'bottom');
    const toptabs = allTabs.filter((tab: any) => tab.props.anchor !== 'bottom');
    // console.log('toptabs', toptabs)
    // console.log('this.rootElement = ', this.rootElement)
    // console.log('this.assignRootElementRef = ', this.assignRootElementRef)
    // const divRootElement = createRef()
    return (
      // DKDK change className; not clear why ref is used here so it is removed for now
      // <div id={this.props.id} className={"leaflet-sidebar leaflet-touch" + position + collapsed}
      //   ref={el => this.rootElement = el}>
      <div id={this.props.id} className={"leaflet-sidebar leaflet-touch" + position + collapsed}>
        <div className="leaflet-sidebar-tabs">
          <ul role="tablist">   {/* Top-aligned */}
            {toptabs.map(toptab => this.renderTab(toptab))}
          </ul>
          <ul role="tablist">   {/* Bottom-aligned */}
            {bottomtabs.map(bottomtab => this.renderTab(bottomtab))}
          </ul>
        </div>
        <div className="leaflet-sidebar-content">
          {this.renderPanes(allTabs)}
        </div>
      </div>
    );
  }
}

export { Sidebar, Tab }
