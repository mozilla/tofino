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

import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Style from '../../../shared/style';
import WindowControls from './decorations/window-controls';
import StatusBar from './decorations/statusbar';
import DeveloperBar from './decorations/developerbar';
import TabBar from './tabbar';

const CHROME_AREA_STYLE = Style.registerStyle({
  WebkitAppRegion: 'drag',
  flexDirection: 'column',
  backgroundColor: 'var(--theme-window-background)',
});

class ChromeArea extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div id="browser-chrome"
        className={CHROME_AREA_STYLE}>
        <WindowControls>
          <TabBar />
        </WindowControls>
        <StatusBar />
        <DeveloperBar />
      </div>
    );
  }
}

ChromeArea.displayName = 'ChromeArea';

export default ChromeArea;
