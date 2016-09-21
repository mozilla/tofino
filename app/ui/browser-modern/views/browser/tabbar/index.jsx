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
import TabsList from './tabs-list';
import NewTabBtn from './new-tab-btn';

import * as UIConstants from '../../../constants/ui';
import * as PageEffects from '../../../actions/page-effects';

const TABBAR_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'flex-end',
  overflow: 'hidden',
  boxSizing: 'border-box',
  height: `${UIConstants.TABBAR_HEIGHT}px`,
  paddingRight: '15px',
  boxShadow: 'inset 0 -1px 0px 0px var(--theme-tabbar-border-bottom-color)',
  background: 'var(--theme-tabbar-background)',
});

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleNewTabClick = () => {
    this.props.dispatch(PageEffects.createPageSession());
  }

  render() {
    return (
      <div id="browser-tabbar"
        className={TABBAR_STYLE}>
        <TabsList />
        <NewTabBtn />
      </div>
    );
  }
}

TabBar.displayName = 'TabBar';

TabBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(TabBar);
