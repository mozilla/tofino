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
import ImmutablePropTypes from 'react-immutable-proptypes';
import omit from 'lodash/omit';

import Style from '../style';
import Btn from './btn';
import SelectionList from './selection-list';

const BUTTON_PRESS_DURATION = 500; // ms

const DROPDOWN_MENU_BUTTON_STYLE = Style.registerStyle({
  position: 'relative',
  overflow: 'visible',
});

const SELECTION_LIST_STYLE = Style.registerStyle({
  position: 'absolute',
  top: '100%',
  left: 0,
  maxWidth: '50vw',
  boxShadow: 'var(--theme-default-shadow)',
});

class DropdownMenuBtn extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.state = {
      showSelectionList: false,
      selectedIndex: -1,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick);
    window.addEventListener('keyup', this.handleWindowKeyUp);
  }

  handleWindowClick = e => {
    // This component's button won't be available if hasn't rendered yet.
    // We also can't call `setState` on components which haven't rendered yet.
    if (this.state.showSelectionList && this.button && this.button.node !== e.target) {
      this.setState({ showSelectionList: false });
    }
  }

  handleWindowKeyUp = e => {
    // We can't call `setState` on components which haven't rendered yet.
    if (this.state.showSelectionList && e.code === 'Escape') {
      this.setState({ showSelectionList: false });
    }
  }

  handeButtonMouseDown = e => {
    this.timeoutId = setTimeout(this.handleButtonLongPress, BUTTON_PRESS_DURATION);

    if (this.props.onMouseDown) {
      this.props.onMouseDown(e);
    }
  }

  handeButtonMouseUp = e => {
    clearTimeout(this.timeoutId);

    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }
  }

  handleButtonClick = e => {
    if (!this.state.showSelectionList) {
      this.props.onClick(e);
    }
  }

  handleButtonLongPress = () => {
    this.setState({ showSelectionList: true });
  }

  handleMouseOverChildComponent = component => {
    const index = component.props['data-index'];
    this.setState({ selectedIndex: index });
  }

  handleMouseUpOnChildComponent = component => {
    const index = component.props['data-index'];
    const data = this.props.dataSrc.get(index);
    this.props.onMenuItemPick({ index, data });
    this.setState({ showSelectionList: false });
  }

  createChild = (data, i) => {
    const Child = this.props.childComponent;
    return (
      <Child key={`dropdown-menu-btn-child-item-${i}`}
        data={data}
        selected={this.state.selectedIndex === i} />
    );
  }

  render() {
    return (
      <Btn {...omit(this.props, Object.keys(SelectionListProps))}
        className={`${DROPDOWN_MENU_BUTTON_STYLE} ${this.props.className || ''}`}
        ref={e => this.button = e}
        onMouseDown={this.handeButtonMouseDown}
        onMouseUp={this.handeButtonMouseUp}
        onClick={this.handleButtonClick}>
        <SelectionList className={SELECTION_LIST_STYLE}
          hidden={!this.state.showSelectionList}
          selectedIndex={this.state.selectedIndex}
          reversed={this.props.reverseDropdownMenu}
          onMouseOverChildComponent={this.handleMouseOverChildComponent}
          onMouseUpOnChildComponent={this.handleMouseUpOnChildComponent}>
          {this.props.dataSrc && this.props.dataSrc.map(this.createChild).toArray()}
        </SelectionList>
      </Btn>
    );
  }
}

DropdownMenuBtn.displayName = 'DropdownMenuBtn';

const SelectionListProps = {
  reverseDropdownMenu: PropTypes.bool,
  dataSrc: ImmutablePropTypes.list,
  childComponent: PropTypes.func.isRequired,
  onMenuItemPick: PropTypes.func.isRequired,
};

DropdownMenuBtn.propTypes = {
  ...SelectionListProps,
  className: PropTypes.string,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onClick: PropTypes.func,
};

export default DropdownMenuBtn;
