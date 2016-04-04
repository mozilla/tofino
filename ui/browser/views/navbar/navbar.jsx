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
import { connect } from 'react-redux';
import Btn from './btn.jsx';
import Location from './location.jsx';
import { menuBrowser, maximize, minimize, close } from '../../actions/external';
import { getCurrentWebView } from '../../browser-util';

/**
 * The section below the tabs containing the location bar and navigation buttons
 */
const NavBar = ({ page, pages, dispatch, ipcRenderer }) => {
  if (page == null) {
    return <div id="browser-navbar"></div>;
  }

  return (
    <div id="browser-navbar">
      <Btn title="Menu" icon="bars fa-lg"
        onClick={() => menuBrowser(dispatch)} />

      <a id="pages-button">
        <span className="page-count">{pages.length}</span>
        {"Pages"}
      </a>
      <Btn title="Back" icon="arrow-left fa-lg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goBack()}
        disabled={!page.canGoBack} />
      <Btn title="Forward" icon="arrow-right fa-lg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goForward()}
        disabled={!page.canGoForward} />
      <Btn title="Refresh" icon="refresh"
        onClick={e => getCurrentWebView(e.target.ownerDocument).reload()}
        disabled={!page.canRefresh} />

      <Location {...{ page, ipcRenderer }} />

      <Btn title="Home" icon="home fa-lg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goToIndex(0)}
        disabled={!page.canGoBack} />

      <Btn title="Minimize" icon="minus fa-lg"
        onClick={minimize} />
      <Btn title="Maximize" icon="square-o fa-lg"
        onClick={maximize} />
      <Btn title="Close" icon="times fa-lg"
        onClick={close} />
    </div>
  );
};

NavBar.propTypes = {
  page: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
};

export default connect()(NavBar);
