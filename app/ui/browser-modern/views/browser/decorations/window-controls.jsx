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
import BUILD_CONFIG from '../../../../../build-config';

import Style from '../../../../shared/style';
import Btn from '../../../../shared/widgets/btn';

import * as ExternalEffects from '../../../actions/external-effects';

const WINDOW_CONTROLS_STYLE = Style.registerStyle({
  order: BUILD_CONFIG.platform === 'darwin' ? 0 : 1,
  alignItems: 'center',
  padding: '0 6px',
  borderBottom: '1px solid var(--theme-tabbar-border-bottom-color)',
});

const WINDOW_CONTROL_BUTTONS_STYLE = Style.registerStyle({
  padding: '2px',
  '&:not(:first-child)': {
    marginLeft: BUILD_CONFIG.platform === 'darwin' ? '4px' : '10px',
  },
});

class WindowControls extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleMinimizeWindow = () => {
    this.props.dispatch(ExternalEffects.minimizeWindow());
  }

  handleMaximizeWindow = () => {
    this.props.dispatch(ExternalEffects.maximizeWindow());
  }

  handleCloseWindow = () => {
    this.props.dispatch(ExternalEffects.closeWindow());
  }

  render() {
    return BUILD_CONFIG.platform === 'darwin'
    ? (
      <div id="browser-window-decorations"
        className={WINDOW_CONTROLS_STYLE}>
        <Btn id="browser-close-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Close"
          width="12px"
          height="12px"
          image="osx-controls.png"
          imgWidth="36px"
          imgHeight="36px"
          imgPosition="0px 0px"
          imgPositionHover="0px -12px"
          imgPositionActive="0px -24px"
          onClick={this.handleCloseWindow} />
        <Btn id="browser-minimize-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Minimize"
          width="12px"
          height="12px"
          image="osx-controls.png"
          imgWidth="36px"
          imgHeight="36px"
          imgPosition="-12px 0px"
          imgPositionHover="-12px -12px"
          imgPositionActive="-12px -24px"
          onClick={this.handleMinimizeWindow} />
        <Btn id="browser-maximize-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Maximize"
          width="12px"
          height="12px"
          image="osx-controls.png"
          imgWidth="36px"
          imgHeight="36px"
          imgPosition="-24px 0px"
          imgPositionHover="-24px -12px"
          imgPositionActive="-24px -24px"
          onClick={this.handleMaximizeWindow} />
      </div>
    ) : (
      <div id="browser-window-decorations"
        className={WINDOW_CONTROLS_STYLE}>
        <Btn id="browser-minimize-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Minimize"
          image="glyph-window-minimize.svg"
          imgWidth="16px"
          imgHeight="16px"
          imgPosition="center calc(50% + 4px)"
          onClick={this.handleMinimizeWindow} />
        <Btn id="browser-maximize-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Maximize"
          image="glyph-window-maximize.svg"
          imgWidth="16px"
          imgHeight="16px"
          onClick={this.handleMaximizeWindow} />
        <Btn id="browser-close-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Close"
          image="glyph-window-close.svg"
          imgWidth="16px"
          imgHeight="16px"
          onClick={this.handleCloseWindow} />
      </div>
    );
  }
}

WindowControls.displayName = 'WindowControls';

WindowControls.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(WindowControls);
