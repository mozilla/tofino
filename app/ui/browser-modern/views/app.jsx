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

import Style from '../../shared/style';
import BrowserWindow from './browser/window';

const APP_STYLE = Style.registerStyle({
  width: '100%',
  height: '100%',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const Element = Style.Element;
    return (
      <div className={APP_STYLE}>
        <BrowserWindow />
        {/* Set a random prop on the Style.Element component, since we do
            want this to rerender when styles change even though there aren't
            any props passed in, to silence why-did-you-update warnings. */}
        <Element rand={Math.random()} />
      </div>
    );
  }
}

App.displayName = 'App';

export default Style.component(App);
