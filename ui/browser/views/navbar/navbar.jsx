
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Btn from './btn.jsx';
import Location from './location.jsx';
import { menuBrowser, bookmark, unbookmark } from '../../actions/external';
import { getCurrentWebView } from '../../browser-util';

/**
 * The section below the tabs containing the location bar and navigation buttons
 */
const NavBar = ({ page, dispatch }) => {
  if (page == null) {
    return <div id="browser-navbar"></div>;
  }

  const onBookmark = e => {
    const webview = getCurrentWebView(e.target.ownerDocument);
    const title = webview.getTitle();
    const url = webview.getURL();
    if (page.isBookmarked) {
      unbookmark(url, dispatch);
    } else {
      bookmark(title, url, dispatch);
    }
  };

  return (
    <div id="browser-navbar">
      <Btn title="Back" icon="arrow-left fa-lg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goBack()}
        disabled={!page.canGoBack} />
      <Btn title="Forward" icon="arrow-right fa-lg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goForward()}
        disabled={!page.canGoForward} />
      <div className="input-group">
        <Location {...{ page }} />
        <Btn title="Refresh" icon="refresh"
          onClick={e => getCurrentWebView(e.target.ownerDocument).reload()}
          disabled={!page.canRefresh} />
      </div>
      <Btn title="Bookmark"
        icon={page.isBookmarked ? 'star fa-lg' : 'star-o fa-lg'}
        onClick={onBookmark} />
      <Btn title="Home" icon="home fa-lg"
        onClick={e => getCurrentWebView(e.target.ownerDocument).goToIndex(0)}
        disabled={!page.canGoBack} />
      <Btn title="Menu" icon="bars fa-lg"
        onClick={() => menuBrowser(dispatch)} />
    </div>
  );
};

NavBar.propTypes = {
  page: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(NavBar);
