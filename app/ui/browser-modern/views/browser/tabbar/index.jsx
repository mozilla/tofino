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
import Btn from '../../../../shared/widgets/btn';

import * as UIConstants from '../../../constants/ui';
import * as PageEffects from '../../../actions/page-effects';

const TABBAR_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'center',
  overflow: 'hidden',
  boxSizing: 'border-box',
  height: `${UIConstants.TABBAR_HEIGHT}px`,
  paddingTop: '10px',
  paddingRight: '38px',
  boxShadow: 'inset 0 -1px 0px 0px var(--theme-tabbar-border-bottom-color)',
  background: 'var(--theme-tabbar-background)',
});

const NEW_TAB_BUTTON_STYLE = Style.registerStyle({
  marginLeft: '-6px',
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
        <Btn id="new-tab-button"
          className={NEW_TAB_BUTTON_STYLE}
          title="New tab"
          width="18px"
          height="20px"
          image="newtab.png"
          imgWidth="54px"
          imgHeight="20px"
          imgPosition="0px 0px"
          imgPositionHover="-18px 0px"
          imgPositionActive="-36px 0px"
          onClick={this.handleNewTabClick} />
      </div>
    );
  }
}

TabBar.displayName = 'TabBar';

TabBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(TabBar);
