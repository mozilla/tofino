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

import * as UIConstants from '../../constants/ui';
import * as actions from '../../actions/main-actions';
import Style from '../../../shared/style';
import Btn from '../../../shared/widgets/btn';

const OVERVIEW_BAR_STYLE = Style.registerStyle({
  flexShrink: 0,
  height: `${UIConstants.NAVBAR_HEIGHT}px`,
  backgroundColor: 'var(--theme-navbar-background)',
  backgroundImage: 'url(assets/chrome-background.png)',
  backgroundSize: 'var(--theme-window-image-tile-size)',
  backgroundAttachment: 'fixed',
  padding: `0 ${UIConstants.OVERVIEWBAR_HORIZONTAL_PADDING}px`,
});

const OVERVIEW_BAR_NAVIGATION_CONTAINER_STYLE = Style.registerStyle({
  alignItems: 'center',
});

const OVERVIEW_BAR_BACK_BUTTON_STYLE = Style.registerStyle({
  borderRadius: '100px',
  border: 'var(--theme-back-button-border-width) solid',
  backgroundColor: 'var(--theme-back-button-background)',
  borderColor: 'var(--theme-back-button-border-color)',
  marginRight: '4px',
  width: `${UIConstants.NAVBAR_HEIGHT - 12}px`,
  height: `${UIConstants.NAVBAR_HEIGHT - 12}px`,
});

const OVERVIEW_BAR_NEW_TAB_BUTTON_STYLE = Style.registerStyle({
  backgroundColor: 'var(--theme-overview-new-tab-button-background)',
  color: 'var(--theme-overview-new-tab-button-color)',
  height: `${UIConstants.NAVBAR_HEIGHT - 15}px`,
  padding: '0 8px',
  marginLeft: '10px',
  fontSize: '110%',
});

const OverviewBar = (props) => {
  return (
    <div id="browser-overviewbar"
      className={OVERVIEW_BAR_STYLE}>
      <div className={OVERVIEW_BAR_NAVIGATION_CONTAINER_STYLE}>
        <Btn id="browser-overviewbar-back"
          className={OVERVIEW_BAR_BACK_BUTTON_STYLE}
          title="Back"
          image="glyph-arrow-nav-back.svg"
          imgWidth="22px"
          imgHeight="22px"
          imgPosition="center"
          onClick={() => props.dispatch(actions.setShowPageSummaries(false))} />
        <Btn id="browser-overviewbar-new-tab"
          className={OVERVIEW_BAR_NEW_TAB_BUTTON_STYLE}
          title="Add new tab"
          image="glyph-addNew-24-blue.svg"
          imgWidth="12px"
          imgHeight="12px"
          onClick={() => props.dispatch(actions.createTab())} >
          New Tab
        </Btn>
      </div>
    </div>
  );
};

OverviewBar.displayName = 'OverviewBar';

OverviewBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(OverviewBar);
