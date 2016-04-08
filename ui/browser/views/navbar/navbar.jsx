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

import React, { PropTypes, Component } from 'react';
import Btn from './btn.jsx';
import Location from './location.jsx';

/**
 * The section below the tabs containing the location bar and navigation buttons
 */
class NavBar extends Component {
  render() {

    const {
      navBack, navForward, navRefresh, page, pages, openMenu, ipcRenderer, minimize, maximize, close,
      setLocation, bookmark, unbookmark, onLocationChange, onLocationContextMenu, onLocationReset
    } = this.props;

    if (page == null) {
      return <div id="browser-navbar"></div>;
    }

    return (
      <div id="browser-navbar">
        <Btn title="Menu" icon="bars fa-lg"
          onClick={openMenu} />

        <a id="pages-button">
          <span className="page-count">{pages.size}</span>
          {"Pages"}
        </a>
        <Btn title="Back" icon="arrow-left fa-lg"
          onClick={navBack}
          disabled={!page.canGoBack} />
        <Btn title="Forward" icon="arrow-right fa-lg"
          onClick={navForward}
          disabled={!page.canGoForward} />
        <Btn title="Refresh" icon="refresh"
          onClick={navRefresh}
          disabled={!page.canRefresh} />

        <Location {
          ...{page, ipcRenderer, bookmark, unbookmark, onLocationChange, onLocationContextMenu, onLocationReset}
        } />

        <Btn title="Minimize" icon="minus fa-lg"
          onClick={minimize} />
        <Btn title="Maximize" icon="square-o fa-lg"
          onClick={maximize} />
        <Btn title="Close" icon="times fa-lg"
          onClick={close} />
      </div>
    );
  }
};

NavBar.propTypes = {
  page: PropTypes.object,
  ipcRenderer: PropTypes.object.isRequired,
  navBack: PropTypes.func.isRequired,
  navForward: PropTypes.func.isRequired,
  navRefresh: PropTypes.func.isRequired,
  minimize: PropTypes.func.isRequired,
  maximize: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired,

  // For <Location>
  bookmark: PropTypes.func.isRequired,
  unbookmark: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onLocationContextMenu: PropTypes.func.isRequired,
  onLocationReset: PropTypes.func.isRequired,
};

export default NavBar;
