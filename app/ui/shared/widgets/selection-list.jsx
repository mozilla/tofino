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
import omit from 'lodash/omit';
import * as ComponentUtil from '../util/component-util';

import Style from '../style';
import List from './list';
import ListItem from './list-item';

const SELECTION_LIST_STYLE = Style.registerStyle({
  backgroundColor: 'var(--theme-content-background)',
  color: 'var(--theme-content-color)',
});

const SELECTION_LIST_ITEM_STYLE = Style.registerStyle({
  cursor: 'default',
  margin: '4px',
  borderRadius: 'var(--theme-default-roundness)',
  '&[data-selected=true]': {
    backgroundColor: 'var(--theme-content-selection-background)',
  },
  '&[data-selected=true] *': {
    color: 'var(--theme-content-selection-color)',
  },
});

class SelectionList extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = ComponentUtil.shouldPlainJsPropsComponentUpdate.bind(this);
  }

  render() {
    return (
      <List {...omit(this.props, Object.keys(OmittedContainerProps))}
        className={`${SELECTION_LIST_STYLE} ${this.props.className || ''}`}>
        {this.props.children && this.props.children.map((child, i) => (
          <ListItem key={`selection-list-item-wrapper-${i}`}
            className={SELECTION_LIST_ITEM_STYLE}
            data-index={i}
            data-selected={this.props.selectedIndex === i}
            onMouseOverComponent={this.props.onMouseOverChildComponent}
            onMouseDownOnComponent={this.props.onMouseDownOnChildComponent}
            onMouseUpOnComponent={this.props.onMouseUpOnChildComponent}
            onClickOnComponent={this.props.onClickOnChildComponent}>
            {child}
          </ListItem>
        ))}
      </List>
    );
  }
}

SelectionList.displayName = 'SelectionList';

const OmittedContainerProps = {
  selectedIndex: PropTypes.number.isRequired,
  onMouseOverChildComponent: PropTypes.func,
  onMouseDownOnChildComponent: PropTypes.func,
  onMouseUpOnChildComponent: PropTypes.func,
  onClickOnChildComponent: PropTypes.func,
};

SelectionList.propTypes = {
  ...OmittedContainerProps,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default SelectionList;
