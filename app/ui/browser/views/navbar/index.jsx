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

import * as UIConstants from '../../constants/ui';
import Style from '../../../shared/style';
import Btn from '../../../shared/widgets/btn';
import Location from './location';

const NAVBAR_STYLE = Style.registerStyle({
  alignItems: 'stretch',
  position: 'relative',
  height: `${UIConstants.NAVBAR_HEIGHT}px`,
  backgroundColor: 'var(--theme-navbar-background)',
  backgroundImage: 'url(assets/chrome-background.png)',
  backgroundSize: 'var(--theme-window-image-tile-size)',
  backgroundAttachment: 'fixed',
  padding: `0 ${UIConstants.NAVBAR_HORIZONTAL_PADDING}px`,
});

const NAVBAR_NAVIGATION_CONTAINER_STYLE = Style.registerStyle({
  '@media (min-width: 1025px)': {
    position: 'absolute', // don't affect layout, so that the navbar gets centered
  },
  alignItems: 'center',
  height: 'inherit',
});

const NAVBAR_NAVIGATION_BUTTONS_STYLE = Style.registerStyle({
  margin: '0 8px',
});

const NAVBAR_NAVIGATION_BACK_BUTTON_STYLE = Style.registerStyle({
  borderRadius: '100px',
  border: 'var(--theme-back-button-border-width) solid',
  backgroundColor: 'var(--theme-back-button-background)',
  borderColor: 'var(--theme-back-button-border-color)',
  marginRight: '4px',
  width: `${UIConstants.NAVBAR_HEIGHT - 12}px`,
  height: `${UIConstants.NAVBAR_HEIGHT - 12}px`,
});

const NavBar = (props) => {
  if (props.page == null) {
    return (
      <div id="browser-navbar"
        className={NAVBAR_STYLE} />
    );
  }

  const {
    navBack,
    navForward,
    navRefresh,
  } = props;

  return (
    <div id="browser-navbar"
      className={`${NAVBAR_STYLE}`}>
      <div className={NAVBAR_NAVIGATION_CONTAINER_STYLE}>
        <Btn id="browser-navbar-back"
          className={`${NAVBAR_NAVIGATION_BACK_BUTTON_STYLE}`}
          title="Back"
          image="glyph-arrow-nav-back-16.svg"
          imgWidth="22px"
          imgHeight="22px"
          imgPosition="center"
          onClick={navBack}
          disabled={!props.page.canGoBack} />
        <Btn id="browser-navbar-forward"
          className={NAVBAR_NAVIGATION_BUTTONS_STYLE}
          title="Forward"
          image="glyph-arrow-nav-forward-16.svg"
          imgWidth="22px"
          imgHeight="22px"
          onClick={navForward}
          disabled={!props.page.canGoForward} />
        <Btn id="browser-navbar-refresh"
          className={NAVBAR_NAVIGATION_BUTTONS_STYLE}
          title="Refresh"
          imgWidth="22px"
          imgHeight="22px"
          image="glyph-arrow-reload-16.svg"
          onClick={navRefresh}
          disabled={!props.page.canRefresh} />
      </div>
      <Location {...props} />
    </div>
  );
};

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
  page: PropTypes.object,
  pages: PropTypes.object.isRequired,
  navBack: PropTypes.func.isRequired,
  navForward: PropTypes.func.isRequired,
  navRefresh: PropTypes.func.isRequired,

  // For <Location>
  isBookmarked: PropTypes.func.isRequired,
  bookmark: PropTypes.func.isRequired,
  unbookmark: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onLocationContextMenu: PropTypes.func.isRequired,
  onLocationReset: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

export default NavBar;
