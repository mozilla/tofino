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

import Style from '../browser-style';
import TabBar from './tabbar/tabbar';
import NavBar from './navbar/navbar';

const CHROME_AREA_STYLE = Style.registerStyle({
  flexDirection: 'column',
  backgroundColor: 'var(--theme-body-color)',
  backgroundImage: 'url(assets/chrome-background.png)',
  backgroundSize: '28px',
});

const BrowserChrome = function(props) {
  return (
    <div className={CHROME_AREA_STYLE}>
      <NavBar {...props} />
      <TabBar {...props} />
    </div>
  );
};

BrowserChrome.displayName = 'BrowserChrome';

export default BrowserChrome;
