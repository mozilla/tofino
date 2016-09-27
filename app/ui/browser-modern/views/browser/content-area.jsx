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
import NavBar from './navbar';
import Page from './page';

import * as SharedPropTypes from '../../model/shared-prop-types';
import * as UIConstants from '../../constants/ui';
import * as PagesSelectors from '../../selectors/pages';

const CONTENT_AREA_STYLE = Style.registerStyle({
  flex: 1,
  position: 'relative',
  zIndex: UIConstants.BROWSER_CONTENT_BASE_ZINDEX,
});

const PAGE_CONTAINER_STYLE = Style.registerStyle({
  flexDirection: 'column',
  // See http://electron.atom.io/docs/api/web-view-tag/#css-styling-notes
  // It would indeed be more elegant to simply use `flex: 1` normally for layout
  // and `display: none` when the page container is hidden, but alas.
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  '&[data-is-active=false]': {
    opacity: 0,
    pointerEvents: 'none',
  },
});

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div id="browser-content"
        className={CONTENT_AREA_STYLE}>
        {this.props.unorderedPageIds.map(pageId => (
          <div key={`browser-page-content-area-${pageId}`}
            className={`browser-page-content-area ${PAGE_CONTAINER_STYLE}`}
            data-is-active={pageId === this.props.selectedPageId}>
            <NavBar pageId={pageId} />
            <Page pageId={pageId} />
          </div>
        ))}
      </div>
    );
  }
}

ContentArea.displayName = 'ContentArea';

ContentArea.propTypes = {
  unorderedPageIds: SharedPropTypes.UnorderedPageIds.isRequired,
  selectedPageId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    unorderedPageIds: PagesSelectors.getUnorderedPageIds(state),
    selectedPageId: PagesSelectors.getSelectedPageId(state),
  };
}

export default connect(mapStateToProps)(ContentArea);
