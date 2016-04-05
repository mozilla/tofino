
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import browserDB from '../../shared/browser-db';
import TabBar from './tabbar/tabbar.jsx';
import NavBar from './navbar/navbar.jsx';
import Page from './page/page.jsx';

import { updateMenu } from '../actions/external';
import { createTab, attachTab, setPageDetails } from '../actions/main-actions';

import { platform } from '../../../build-config';

require('../../shared/web-view');

/**
 *
 */
class BrowserWindow extends Component {
  componentDidMount() {
    attachListeners(this.props);
  }

  render() {
    const { pages, currentPageIndex, pageOrder, ipcRenderer } = this.props;
    const platformClass = `platform-${platform}`;

    return (
      <div id="browser-chrome" className={"platform-" + platform} >
        <NavBar page={pages.get(currentPageIndex)}
                pages={pages}
                ipcRenderer={ipcRenderer} />
        <TabBar {...{ pages, pageOrder, currentPageIndex }} />
        <div id="content-area">
          {pages.map((page, pageIndex) => (
            <Page key={'page-' + pageIndex}
              page={page} pageIndex={pageIndex}
              isActive={pageIndex === currentPageIndex}
              browserDB={browserDB} />
          ))}
        </div>
      </div>
    );
  }
}

BrowserWindow.propTypes = {
  pageOrder: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
};

export default connect()(BrowserWindow);

function attachListeners({ dispatch, currentPageIndex, ipcRenderer }) {
  // attach keyboard shortcuts
  // :TODO: replace this with menu hotkeys
  document.body.addEventListener('keydown', e => {
    if (e.metaKey && e.keyCode === 70) { // cmd+f
      setPageDetails(pageIndex, { isSearching: true });
      e.target.ownerDocument.querySelector('#browser-page-search input').focus();
    } else if (e.keyCode === 27) { // esc
      setPageDetails(pageIndex, { isSearching: false });
      e.target.ownerDocument.querySelector('#browser-page-search input').blur();
    }
  });

  // Setup the app menu
  updateMenu();

  ipcRenderer.on('new-tab', () => dispatch(createTab()));

  // TODO: Avoid this Re-dispatch back to the main process
  ipcRenderer.on('new-window', () => {
    ipcRenderer.send('new-window');
  });

  ipcRenderer.on('show-bookmarks', () => {
    dispatch(createTab('atom://bookmarks'));
  });

  ipcRenderer.on('open-bookmark', (e, bookmark) => {
    dispatch(createTab(bookmark.url));
  });

  ipcRenderer.on('tab-attach', (e, tabInfo) => {
    const page = tabInfo.page;
    page.guestInstanceId = tabInfo.guestInstanceId;
    dispatch(attachTab(page));
  });
}
