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

import Style from '../../../shared/style';
import ChromeArea from './chrome-area';
import ContentArea from './content-area';
import Overview from './overview';

const BROWSER_WINDOW_STYLE = Style.registerStyle({
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

class BrowserWindow extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div id="browser-window"
        className={BROWSER_WINDOW_STYLE}>
        <ChromeArea />
        <ContentArea onPageMount={this.props.onPageMount}
          onNavigateBack={this.props.onNavigateBack}
          onNavigateForward={this.props.onNavigateForward}
          onNavigateRefresh={this.props.onNavigateRefresh}
          onNavigateTo={this.props.onNavigateTo}
          onNavigateInHistory={this.props.onNavigateInHistory} />
        <Overview />
      </div>
    );
  }
}

BrowserWindow.displayName = 'BrowserWindow';

BrowserWindow.propTypes = {
  onPageMount: PropTypes.func.isRequired,
  onNavigateBack: PropTypes.func.isRequired,
  onNavigateForward: PropTypes.func.isRequired,
  onNavigateRefresh: PropTypes.func.isRequired,
  onNavigateTo: PropTypes.func.isRequired,
  onNavigateInHistory: PropTypes.func.isRequired,
};

export default BrowserWindow;
