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

import * as UIConstants from '../../../constants/ui';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as PageActions from '../../../actions/page';

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

  handleTabClick = () => {
    this.props.dispatch(PageActions.setSelectedPage(this.props.pageId));
  }

  handleTabClose = e => {
    this.props.dispatch(PageActions.removePage(this.props.pageId));
    e.stopPropagation();
  }

  render() {
    return (
      <div className={`browser-tab ${TAB_STYLE}`}
        onClick={this.handleTabClick}>
        <div className={TAB_CONTENTS_STYLE}
          data-active-tab={this.props.isActive && !this.props.isOverviewVisible}>
          { this.props.pageFavicon
            ? (
            <FittedImage className={`tab-favicon ${FAVICON_STYLE}`}
              src={this.props.pageFavicon}
              width="16px"
              height="16px"
              mode="contain" />
            ) : (
            null
          )}
          <div className={`tab-title ${TAB_TITLE_STYLE}`}>
            {this.props.pageTitle || this.props.pageLocation}
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
  isActive: PropTypes.bool.isRequired,
  isOverviewVisible: PropTypes.bool.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    isActive: PagesSelectors.getSelectedPageId(state) === ownProps.pageId,
    isOverviewVisible: UISelectors.getOverviewVisible(state),
  };
}

export default connect(mapStateToProps)(Tab);
