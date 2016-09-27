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
import FittedImage from '../../../../shared/widgets/fitted-image';
import SpinnerGray from '../../../../shared/widgets/spinner-gray';
import SpinnerBlue from '../../../../shared/widgets/spinner-blue';
import WarningIcon from '../../../../shared/widgets/icon-warning';
import GlobeIcon from '../../../../shared/widgets/icon-globe';
import Btn from '../../../../shared/widgets/btn';

import PageState from '../../../model/page-state';
import * as PagesSelectors from '../../../selectors/pages';
import * as PageEffects from '../../../actions/page-effects';

const TAB_CONTENTS_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'center',
  overflow: 'hidden',
});

const TAB_TITLE_STYLE = Style.registerStyle({
  flex: 1,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  padding: '0 6px',
  cursor: 'default',
});

const TAB_CLOSE_BUTTON_STYLE = Style.registerStyle({
  pointerEvents: 'all',
});

class TabContents extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleTabClose = e => {
    this.props.dispatch(PageEffects.destroyPageSession(this.props.pageId));
    e.stopPropagation();
  }

  render() {
    return (
      <div className={`tab-contents ${TAB_CONTENTS_STYLE}`}>
        {/* eslint-disable no-nested-ternary */}
        {this.props.pageLoadState === PageState.STATES.CONNECTING
        ? (
          <SpinnerGray />
        ) : this.props.pageLoadState === PageState.STATES.LOADING ? (
          <SpinnerBlue />
        ) : this.props.pageLoadState === PageState.STATES.FAILED ? (
          <WarningIcon />
        ) : this.props.pageLoadState === PageState.STATES.LOADED && this.props.pageFavicon ? (
          <FittedImage className="tab-favicon"
            src={this.props.pageFavicon}
            width="16px"
            height="16px"
            mode="contain" />
        ) : (
          <GlobeIcon />
        )}
        {/* eslint-enable no-nested-ternary */}
        <div className={`tab-title ${TAB_TITLE_STYLE}`}>
          {this.props.tabTitle}
        </div>
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

TabContents.displayName = 'TabContents';

TabContents.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  tabTitle: PropTypes.string.isRequired,
  pageFavicon: PropTypes.string,
  pageLoadState: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);

  return {
    tabTitle: page ? page.title || page.meta.title || page.location || 'Loading...' : '',
    pageLocation: page ? page.location : '',
    pageFavicon: page ? page.favicon_url : '',
    pageLoadState: page ? page.state.load : '',
  };
}

export default connect(mapStateToProps)(TabContents);
