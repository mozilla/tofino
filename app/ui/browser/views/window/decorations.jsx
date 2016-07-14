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

import Style from '../../../shared/style';
import Btn from '../../../shared/widgets/btn';
import VerticalSeparator from '../../../shared/widgets/vertical-separator';

const WINDOW_DECORATIONS_STYLE = Style.registerStyle({
  alignItems: 'center',
  margin: '0px 5px',
});

const APP_MENU_BUTTON_STYLE = Style.registerStyle({
  margin: '0 5px',
});

const OVERVIEW_BUTTON_STYLE = Style.registerStyle({
  color: 'var(--theme-content-color)',
  margin: '0 5px',
});

const WINDOW_CONTROL_BUTTONS_STYLE = Style.registerStyle({
  margin: '0 1px',
});

const Decorations = function(props) {
  return (
    <div className={WINDOW_DECORATIONS_STYLE}>
      <Btn id="browser-menu"
        className={APP_MENU_BUTTON_STYLE}
        title="Menu"
        image="glyph-menu-16.svg"
        imgWidth="18px"
        imgHeight="18px"
        onClick={props.handleOpenMenu} />
      <VerticalSeparator />
      <Btn id="pages-overview"
        className={OVERVIEW_BUTTON_STYLE}
        title="Page summaries"
        image="glyph-overview-16.svg"
        imgWidth="14px"
        imgHeight="14px"
        onClick={props.handleOpenOverview}>
        Overview
      </Btn>
      {props.children}
      <Btn id="browser-minimize"
        className={WINDOW_CONTROL_BUTTONS_STYLE}
        title="Minimize"
        image="glyph-window-minimize-16.svg"
        imgWidth="18px"
        imgHeight="18px"
        imgPosition="center 4px"
        onClick={props.handleMinimize} />
      <Btn id="browser-maximize"
        className={WINDOW_CONTROL_BUTTONS_STYLE}
        title="Maximize"
        image="glyph-window-maximize-16.svg"
        imgWidth="18px"
        imgHeight="18px"
        imgPosition="center bottom"
        onClick={props.handleMaximize} />
      <Btn id="browser-close"
        className={WINDOW_CONTROL_BUTTONS_STYLE}
        title="Close"
        image="glyph-window-close-16.svg"
        imgWidth="18px"
        imgHeight="18px"
        imgPosition="center bottom"
        onClick={props.handleClose} />
    </div>
  );
};

Decorations.displayName = 'Decorations';

Decorations.propTypes = {
  handleOpenMenu: PropTypes.func.isRequired,
  handleOpenOverview: PropTypes.func.isRequired,
  handleMinimize: PropTypes.func.isRequired,
  handleMaximize: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Decorations;
