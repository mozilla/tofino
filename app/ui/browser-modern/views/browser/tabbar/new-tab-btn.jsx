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
import TabVisuals from './tab-visuals';

import * as UIConstants from '../../../constants/ui';
import * as PageEffects from '../../../actions/page-effects';

const NEW_TAB_BUTTON_CONTAINER_STYLE = Style.registerStyle({
  // Due to its visual elements, this component's bounds are much larger than
  // the area we want to be clickable. Since it can overlap other interactive
  // components, restrict the pointer events only to relevant children.
  pointerEvents: 'none',
  position: 'relative',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: `${UIConstants.NEW_TAB_BUTTON_WIDTH}px`,
  height: `${UIConstants.TAB_HEIGHT}px`,
  marginLeft: `-${UIConstants.TAB_OVERLAP * 2}px`,
});

class NewTabBtn extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleNewTabClick = () => {
    this.props.dispatch(PageEffects.createPageSession());
  }

  render() {
    return (
      <div className={NEW_TAB_BUTTON_CONTAINER_STYLE}>
        <Btn className="browser-new-tab-button"
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
        <TabVisuals />
      </div>
    );
  }
}

NewTabBtn.displayName = 'NewTabBtn';

NewTabBtn.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(NewTabBtn);
