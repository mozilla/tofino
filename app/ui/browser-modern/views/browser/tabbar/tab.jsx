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

import Style from '../../../../shared/style';
import Btn from '../../../../shared/widgets/btn';
import TabVisuals from './tab-visuals';
import TabContents from './tab-contents';

import * as UIConstants from '../../../constants/ui';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as PageActions from '../../../actions/page-actions';
import * as PageEffects from '../../../actions/page-effects';

const TAB_STYLE = Style.registerStyle({
  WebkitUserSelect: 'none',
  WebkitAppRegion: 'no-drag',
  position: 'relative',
  alignItems: 'center',
  overflow: 'hidden',
  boxSizing: 'border-box',
  width: `${UIConstants.TAB_DEFAULT_WIDTH}px`,
  minWidth: `${UIConstants.TAB_MIN_WIDTH}px`,
  margin: `0 -${UIConstants.TAB_OVERLAP}px`,
  padding: '0 24px',
  backgroundImage: 'var(--theme-window-background)',
  backgroundColor: 'var(--theme-tab-inactive-background)',
  color: 'var(--theme-tab-inactive-color)',
  textShadow: '0 1px var(--theme-tab-inactive-text-shadow)',
  opacity: 'var(--theme-tab-inactive-opacity)',
  '&[data-active-tab=true]': {
    backgroundColor: 'var(--theme-tab-active-background)',
    color: 'var(--theme-tab-active-color)',
    textShadow: '0 1px var(--theme-tab-active-text-shadow)',
    opacity: 'var(--theme-tab-active-opacity)',
    zIndex: 1,
  },
});

const TAB_POINTER_AREA_STYLE = Style.registerStyle({
  position: 'absolute',
  left: '15px',
  right: '15px',
  top: 0,
  bottom: 0,
});

const TAB_CLOSE_BUTTON_STYLE = Style.registerStyle({
  zIndex: 1,
});

class Tab extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.scrollIntoViewIfNeeded();
  }

  componentDidUpdate() {
    this.scrollIntoViewIfNeeded();
  }

  scrollIntoViewIfNeeded() {
    if (this.props.isActive) {
      this.root.scrollIntoViewIfNeeded();
    }
  }

  handleTabPick = e => {
    if (e.button === 1) {
      this.handleTabClose(e);
    } else {
      this.props.dispatch(PageActions.setSelectedPage(this.props.pageId));
    }
  }

  handleTabClose = e => {
    this.props.dispatch(PageEffects.destroyPageSession(this.props.pageId));
    e.stopPropagation();
  }

  render() {
    return (
      <div className={`browser-tab ${TAB_STYLE}`}
        ref={e => this.root = e}
        data-active-tab={this.props.isActive && !this.props.isOverviewVisible}
        data-before-active-tab={this.props.isBeforeActive && !this.props.isOverviewVisible}
        data-after-active-tab={this.props.isAfterActive && !this.props.isOverviewVisible}>
        <div className={`tab-pointer-area ${TAB_POINTER_AREA_STYLE}`}
          title={this.props.pageTitle || this.props.pageLocation}
          onMouseDown={this.handleTabPick} />
        <TabVisuals />
        <TabContents pageId={this.props.pageId} />
        <Btn className={`tab-close-button ${TAB_CLOSE_BUTTON_STYLE}`}
          title="Close tab"
          width="14px"
          height="14px"
          image="close.png"
          imgWidth="64px"
          imgHeight="16px"
          imgPosition="-1px -1px"
          imgPositionHover="-17px -1px"
          imgPositionActive="-33px -1px"
          onClick={this.handleTabClose} />
      </div>
    );
  }
}

Tab.displayName = 'Tab';

Tab.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  pageLocation: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isBeforeActive: PropTypes.bool.isRequired,
  isAfterActive: PropTypes.bool.isRequired,
  isOverviewVisible: PropTypes.bool.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  const pageIndex = PagesSelectors.getPageIndexById(state, ownProps.pageId);

  const selectedPageId = PagesSelectors.getSelectedPageId(state);
  const selectedPageIndex = PagesSelectors.getPageIndexById(state, selectedPageId);

  return {
    pageTitle: page ? page.title : '',
    pageLocation: page ? page.location : '',
    isActive: selectedPageId === ownProps.pageId,
    isBeforeActive: selectedPageIndex === pageIndex + 1,
    isAfterActive: selectedPageIndex === pageIndex - 1,
    isOverviewVisible: UISelectors.getOverviewVisible(state),
  };
}

export default connect(mapStateToProps)(Tab);
