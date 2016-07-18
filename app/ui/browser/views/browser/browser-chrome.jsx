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

import React from 'react';

import Style from '../../../shared/style';
import TabBar from '../tabbar';
import NavBar from '../navbar';
import Overview from '../overview';
import WinDecorations from '../window/decorations';

const CHROME_AREA_STYLE = Style.registerStyle({
  WebkitAppRegion: 'drag',
  flexDirection: 'column',
  backgroundColor: 'var(--theme-window-background)',
  backgroundImage: 'url(assets/chrome-background.png)',
  backgroundSize: 'var(--theme-window-image-tile-size)',
});

const BrowserChrome = function(props) {
  return (
    <div className={CHROME_AREA_STYLE}>
      <WinDecorations {...props} >
        <TabBar {...props} />
      </WinDecorations>
      <NavBar {...props} />
      <Overview {...props} />
    </div>
  );
};

BrowserChrome.displayName = 'BrowserChrome';

export default BrowserChrome;
