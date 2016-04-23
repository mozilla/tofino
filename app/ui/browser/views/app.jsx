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
import { ipcRenderer } from '../../../shared/electron';

import Style from '../browser-style';
import BrowserWindow from './browser';

const APP_STYLE = Style.registerStyle({
  width: '100%',
  height: '100%',
});

const App = function({ profile, currentPageIndex, currentPage, pageAreaVisible, dispatch }) {
  return (
    <div className={APP_STYLE}>
      <BrowserWindow ipcRenderer={ipcRenderer}
        dispatch={dispatch}
        profile={profile}
        currentPageIndex={currentPageIndex}
        currentPage={currentPage}
        pageAreaVisible={pageAreaVisible} />
      <Style.Element />
    </div>
  );
};

App.displayName = 'App';

App.propTypes = {
  profile: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  currentPage: PropTypes.object.isRequired,
  pageAreaVisible: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const browserWindow = state.browserWindow;
  return {
    profile: browserWindow.profile,
    currentPageIndex: browserWindow.currentPageIndex,
    currentPage: browserWindow.pages.get(browserWindow.currentPageIndex),
    pageAreaVisible: browserWindow.pageAreaVisible,
  };
}

export default connect(mapStateToProps)(Style.component(App));
