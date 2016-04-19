/*
Copyright 2016 Mozilla

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

import React, { PropTypes } from 'react';

import Style from '../../browser-style';
import Btn from './btn.jsx';
import Location from './location.jsx';

const NAVBAR_STYLE = Style.registerStyle({
  alignItems: 'center',
  minHeight: '35px',
  background: '#fcfcfc',
  padding: '0 5px',
  fontSize: '80%',

  // Makes electron app draggable.
  WebkitAppRegion: 'drag',

  // Prevent dragging when clicking on children.
  '*': {
    WebkitAppRegion: 'no-drag',
  },
});

const NAVBAR_BUTTON_STYLE = Style.registerStyle({
  margin: '0 6px',
});

const NAVBAR_PAGES_COUNT_STYLE = Style.registerStyle({
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '14px',
  backgroundColor: '#555',
  color: '#fff',
  fontSize: '80%',
  borderRadius: '3px',
  marginRight: '6px',
});

function NavBar(props) {
  if (props.page == null) {
    return (
      <div id="browser-navbar"
        className={NAVBAR_STYLE} />
    );
  }

  const pagesButtonClickHandler = () => props.setPageAreaVisibility(!props.pageAreaVisible);
  return (
    <div id="browser-navbar"
      className={NAVBAR_STYLE}>
      <Btn id="browser-navbar-menu"
        className={NAVBAR_BUTTON_STYLE}
        title="Menu"
        image="glyph-menu-16.svg"
        clickHandler={props.openMenu} />
      <Btn id="pages-button"
        className={NAVBAR_BUTTON_STYLE}
        title="Pages"
        clickHandler={pagesButtonClickHandler}>
        <div id="browser-navbar-pages-count"
          className={NAVBAR_PAGES_COUNT_STYLE}>
          {props.pages.size}
        </div>
        <span>
          {"Pages"}
        </span>
      </Btn>
      <Btn id="browser-navbar-back"
        className={NAVBAR_BUTTON_STYLE}
        title="Back"
        image="glyph-arrow-nav-back-16.svg"
        clickHandler={props.navBack}
        disabled={!props.page.canGoBack} />
      <Btn id="browser-navbar-forward"
        className={NAVBAR_BUTTON_STYLE}
        title="Forward"
        image="glyph-arrow-nav-forward-16.svg"
        clickHandler={props.navForward}
        disabled={!props.page.canGoForward} />
      <Btn id="browser-navbar-refresh"
        className={NAVBAR_BUTTON_STYLE}
        title="Refresh"
        image="glyph-arrow-reload-16.svg"
        clickHandler={props.navRefresh}
        disabled={!props.page.canRefresh} />
      <Location { ...props } />
      <Btn id="browser-navbar-minimize"
        className={NAVBAR_BUTTON_STYLE}
        title="Minimize"
        image="glyph-window-minimize-16.svg"
        clickHandler={props.minimize} />
      <Btn id="browser-navbar-maximize"
        className={NAVBAR_BUTTON_STYLE}
        title="Maximize"
        image="glyph-window-maximize-16.svg"
        clickHandler={props.maximize} />
      <Btn id="browser-navbar-close"
        className={NAVBAR_BUTTON_STYLE}
        title="Close"
        image="glyph-window-close-16.svg"
        clickHandler={props.close} />
    </div>
  );
}

NavBar.propTypes = {
  page: PropTypes.object,
  pages: PropTypes.object.isRequired,
  pageAreaVisible: PropTypes.bool.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
  navBack: PropTypes.func.isRequired,
  navForward: PropTypes.func.isRequired,
  navRefresh: PropTypes.func.isRequired,
  minimize: PropTypes.func.isRequired,
  maximize: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired,

  // For <Location>
  isBookmarked: PropTypes.func.isRequired,
  bookmark: PropTypes.func.isRequired,
  unbookmark: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onLocationContextMenu: PropTypes.func.isRequired,
  onLocationReset: PropTypes.func.isRequired,
  setPageAreaVisibility: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

export default NavBar;
