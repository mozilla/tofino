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

import Style from '../../../../shared/style';
import Location from '../location';
import NavigationButtons from './navigation-buttons';
import ToolbarButtons from './toolbar-buttons';

import * as UIConstants from '../../../constants/ui';

const NAVBAR_STYLE = Style.registerStyle({
  alignItems: 'center',
  boxSizing: 'border-box',
  height: `${UIConstants.NAVBAR_HEIGHT}px`,
  boxShadow: 'inset 0 -1px 0px 0px var(--theme-navbar-border-bottom-color)',
  background: 'var(--theme-navbar-background)',
});

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div id={`browser-navbar-${this.props.pageId}`}
        className={`browser-navbar ${NAVBAR_STYLE}`}>
        <NavigationButtons pageId={this.props.pageId} />
        <Location pageId={this.props.pageId} />
        <ToolbarButtons pageId={this.props.pageId} />
      </div>
    );
  }
}

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
  pageId: PropTypes.string.isRequired,
};

export default NavBar;
