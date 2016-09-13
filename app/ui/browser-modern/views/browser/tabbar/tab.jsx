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
import FittedImage from '../../../../shared/widgets/fitted-image';

import PageState from '../../../model/page-state';
import * as UIConstants from '../../../constants/ui';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as PageActions from '../../../actions/page-actions';
import * as PageEffects from '../../../actions/page-effects';

const TAB_STYLE = Style.registerStyle({
  WebkitUserSelect: 'none',
  WebkitAppRegion: 'no-drag',
  overflow: 'hidden',
});

const TAB_CONTENTS_STYLE = Style.registerStyle({
  overflow: 'hidden',
  width: `${UIConstants.TAB_DEFAULT_WIDTH}vw`,
  padding: '0 10px',
  alignItems: 'center',
  backgroundColor: 'var(--theme-tab-inactive-background)',
  color: 'var(--theme-tab-inactive-color)',
  opacity: 'var(--theme-tab-inactive-opacity)',
  '&[data-active-tab=true]': {
    backgroundColor: 'var(--theme-tab-active-background)',
    color: 'var(--theme-tab-active-color)',
    opacity: 'var(--theme-tab-active-opacity)',
  },
});

const FAVICON_STYLE = Style.registerStyle({
});

const LOADING_INDICATOR_STYLE = Style.registerStyle({
  fontSize: '16px',
});

const TAB_TITLE_STYLE = Style.registerStyle({
  flex: 1,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  margin: '0 5px',
  cursor: 'default',
});

class Tab extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleTabClick = e => {
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
        onClick={this.handleTabClick}>
        <div className={`tab-contents ${TAB_CONTENTS_STYLE}`}
          data-active-tab={this.props.isActive && !this.props.isOverviewVisible}>
          {this.props.pageLoadState === PageState.STATES.PRE_LOADING
          ? (
            <i className={`fa fa-spinner fa-pulse ${LOADING_INDICATOR_STYLE}`} />
          ) : (
            null
          )}
          {this.props.pageLoadState === PageState.STATES.LOADING
          ? (
            <i className={`fa fa-circle-o-notch fa-spin ${LOADING_INDICATOR_STYLE}`} />
          ) : (
            null
          )}
          {this.props.pageLoadState === PageState.STATES.FAILED
          ? (
            <i className={`fa fa-exclamation-triangle ${LOADING_INDICATOR_STYLE}`} />
          ) : (
            null
          )}
          {this.props.pageLoadState === PageState.STATES.LOADED && this.props.pageFavicon
          ? (
            <FittedImage className={`tab-favicon ${FAVICON_STYLE}`}
              src={this.props.pageFavicon}
              width="16px"
              height="16px"
              mode="contain" />
          ) : (
            null
          )}
          <div className={`tab-title ${TAB_TITLE_STYLE}`}
            title={this.props.pageTitle}>
            {this.props.pageTitle || this.props.pageLocation || 'Loading...'}
          </div>
          <Btn className="tab-close-button"
            title="Close tab"
            image="glyph-addnew.svg"
            imgWidth="14px"
            imgHeight="14px"
            imgPosition="center"
            style={{ transform: 'rotate(45deg)' }}
            onClick={this.handleTabClose} />
        </div>
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
  pageFavicon: PropTypes.string,
  pageLoadState: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  isOverviewVisible: PropTypes.bool.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageTitle: page ? page.title : '',
    pageLocation: page ? page.location : '',
    pageFavicon: page ? page.favicon_url : '',
    pageLoadState: page ? page.state.load : '',
    isActive: PagesSelectors.getSelectedPageId(state) === ownProps.pageId,
    isOverviewVisible: UISelectors.getOverviewVisible(state),
  };
}

export default connect(mapStateToProps)(Tab);
