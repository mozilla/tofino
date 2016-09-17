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

import Style from '../../../../shared/style';

/**
 * This component is simply responsible for rendering the curvy tabs background
 * in a purely presentational fashion.
 */

const TAB_VISUALS_STYLE = Style.registerStyle({
  pointerEvents: 'none',
  zIndex: -1,
});

const TAB_SIDES_BACKGROUND_STYLE = Style.registerStyle({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: '30px 31px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: `
    left 0px bottom -1px,
    right 0px bottom -1px,
    left 0px bottom -1px,
    right 0px bottom -1px`,
  '[data-active-tab=false]:hover &': {
    backgroundImage: `
      url('assets/tab-background-start.png'),
      url('assets/tab-background-end.png')`,
  },
  '[data-active-tab=true] &': {
    backgroundImage: `
      url('assets/tab-stroke-start.png'),
      url('assets/tab-stroke-end.png'),
      url('assets/tab-selected-start.svg'),
      url('assets/tab-selected-end.svg')`,
  },
});

const TAB_CENTER_BACKGROUND_STYLE = Style.registerStyle({
  position: 'absolute',
  left: '30px',
  right: '30px',
  top: 0,
  bottom: 0,
  backgroundSize: '6px 31px',
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'left 0px bottom -1px',
  '[data-active-tab=false]:hover &': {
    backgroundImage: `
      url('assets/tab-background-middle.png')`,
  },
  '[data-active-tab=true] &': {
    backgroundImage: `
      url('assets/tab-selected-middle.png'),
      linear-gradient(transparent 2px, hsl(0,0%,99%) 2px, hsl(0,0%,93%))`,
  },
});

class TabVisuals extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div className={`tab-visuals ${TAB_VISUALS_STYLE}`}>
        <div className={`tab-sides-background ${TAB_SIDES_BACKGROUND_STYLE}`} />
        <div className={`tab-center-background ${TAB_CENTER_BACKGROUND_STYLE}`} />
      </div>
    );
  }
}

TabVisuals.displayName = 'TabVisuals';

export default TabVisuals;
