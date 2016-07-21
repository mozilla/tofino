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

import * as SharedPropTypes from '../../../shared/model/shared-prop-types';
import * as UIConstants from '../../constants/ui';
import Style from '../../../shared/style';
import OverviewBar from './overview-bar';
import OverviewCards from './overview-cards';

import * as selectors from '../../selectors';

const OVERVIEW_STYLE = Style.registerStyle({
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'absolute',
  top: UIConstants.TABBAR_HEIGHT,
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: UIConstants.OVERVIEW_ZINDEX,
  backgroundColor: 'var(--theme-window-background)',
  backgroundImage: 'url(assets/chrome-background.png)',
  backgroundSize: 'var(--theme-window-image-tile-size)',
  backgroundAttachment: 'fixed',
  backgroundBlendMode: 'soft-light',
});

const Overview = function(props) {
  return (
    <div className={OVERVIEW_STYLE}
      hidden={!props.show}>
      <OverviewBar />
      <OverviewCards {...props} />
    </div>
  );
};

Overview.displayName = 'Overview';

Overview.propTypes = {
  show: PropTypes.bool.isRequired,
  pages: SharedPropTypes.Pages.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    show: selectors.getShowPageSummaries(state),
  };
}

export default connect(mapStateToProps)(Overview);
