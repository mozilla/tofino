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

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import Style from '../../../shared/style';
import WindowControls from './decorations/window-controls';
import StatusBar from './decorations/statusbar';
import DeveloperBar from './decorations/developerbar';
import TabBar from './tabbar';
import SearchBar from './decorations/searchbar';

import * as SharedPropTypes from '../../model/shared-prop-types';
import * as UIConstants from '../../constants/ui';
import * as PagesSelectors from '../../selectors/pages';

const CHROME_AREA_STYLE = Style.registerStyle({
  WebkitAppRegion: 'drag',
  position: 'relative',
  zIndex: UIConstants.BROWSER_CHROME_BASE_ZINDEX,
});

class ChromeArea extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div id="browser-chrome"
        className={CHROME_AREA_STYLE}>
        <WindowControls />
        <TabBar />
        <DeveloperBar />
        {this.props.pageIds.map(pageId => (
          <div key={`browser-page-chrome-area-${pageId}`}
            className="browser-page-chrome-area"
            hidden={pageId !== this.props.selectedPageId}>
            <StatusBar />
            <SearchBar pageId={pageId} />
          </div>
        ))}
      </div>
    );
  }
}

ChromeArea.displayName = 'ChromeArea';

ChromeArea.propTypes = {
  pageIds: SharedPropTypes.PageIds.isRequired,
  selectedPageId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    pageIds: PagesSelectors.getOrderedPageIds(state),
    selectedPageId: PagesSelectors.getSelectedPageId(state),
  };
}

export default connect(mapStateToProps)(ChromeArea);
