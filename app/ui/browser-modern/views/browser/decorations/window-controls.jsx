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

import * as UIConstants from '../../../constants/ui';
import * as ExternalEffects from '../../../actions/external-effects';

const WINDOW_CONTROLS_STYLE = Style.registerStyle({
  flex: 1,
  height: `${UIConstants.TABBAR_HEIGHT}px`,
});

const WINDOW_CONTROL_BUTTONS_STYLE = Style.registerStyle({
  padding: '0 10px',
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
    return (
      <div id="browser-window-decorations"
        className={WINDOW_CONTROLS_STYLE}>
        {this.props.children}
        <Btn id="browser-minimize-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Minimize"
          image="glyph-window-minimize.svg"
          imgWidth="18px"
          imgHeight="18px"
          imgPosition="center 4px"
          onClick={this.handleMinimizeWindow} />
        <Btn id="browser-maximize-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Maximize"
          image="glyph-window-maximize.svg"
          imgWidth="18px"
          imgHeight="18px"
          imgPosition="center bottom"
          onClick={this.handleMaximizeWindow} />
        <Btn id="browser-close-button"
          className={WINDOW_CONTROL_BUTTONS_STYLE}
          title="Close"
          image="glyph-window-close.svg"
          imgWidth="18px"
          imgHeight="18px"
          imgPosition="center bottom"
          onClick={this.handleCloseWindow} />
      </div>
    );
  }
}

WindowControls.displayName = 'WindowControls';

WindowControls.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default connect()(WindowControls);
