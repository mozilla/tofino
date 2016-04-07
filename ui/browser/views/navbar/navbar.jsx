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
      <Btn title="Menu" image="glyph-menu-16.svg"
        onClick={() => menuBrowser(dispatch)} />

      <a id="pages-button" style={{
        borderWidth: "0px 1px",
        borderColor: "#D6D6D6",
        borderStyle: "solid",
        margin: "8px 8px 0px 8px",
        padding: "0px 10px",
        height: "22px",
      }}>
        <span style={{
          backgroundColor: "#4d4d4d",
          color: "#fff",
          fontSize: "10px",
          width: "16px",
          height: "14px",
          paddingTop: "2px",
          textAlign: "center",
          borderRadius: "3px",
          display: "inline-block",
          margin: "0px 6px 0px 0px"
        }}>{pages.length}</span>
        <span style={{
          fontSize: "12px",
        }}>{"Pages"}</span>
      </a>
      <Btn title="Back" image="glyph-arrow-nav-back-16.svg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goBack()}
        disabled={!page.canGoBack} />
      <Btn title="Forward" image="glyph-arrow-nav-forward-16.svg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goForward()}
        disabled={!page.canGoForward} />
      <Btn title="Refresh" image="glyph-arrow-reload-16.svg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).reload()}
        disabled={!page.canRefresh} />

      <Location {...{ page, ipcRenderer }} />

      <Btn title="Minimize" image="glyph-window-minimize-16.svg"
        onClick={minimize} />
      <Btn title="Maximize" image="glyph-window-maximize-16.svg"
        onClick={maximize} />
      <Btn title="Close" image="glyph-window-close-16.svg"
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
