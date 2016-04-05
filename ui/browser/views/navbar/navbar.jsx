
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Btn from './btn.jsx';
import Location from './location.jsx';
import { menuBrowser, maximize, minimize, close } from '../../actions/external';
import { getCurrentWebView } from '../../browser-util';

/**
 * The section below the tabs containing the location bar and navigation buttons
 */
const NavBar = ({ page, dispatch, ipcRenderer }) => {
  if (page == null) {
    return <div id="browser-navbar"></div>;
  }

  return (
    <div id="browser-navbar">
      <Btn title="Menu" icon="bars fa-lg"
        onClick={() => menuBrowser(dispatch)} />

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
