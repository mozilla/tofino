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

const LIST_ITEM_STYLE = Style.registerStyle({
  // Nothing here yet.
});

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = ComponentUtil.shouldPlainJsPropsComponentUpdate.bind(this);
  }

  handleMouseDown = e => {
    this.props.onMouseDown(e);
    this.props.onMouseDownOnComponent(this);
  }

  handleMouseUp = e => {
    this.props.onMouseUp(e);
    this.props.onMouseUpOnComponent(this);
  }

  handleMouseClick = e => {
    this.props.onClick(e);
    this.props.onClickOnComponent(this);
  }

  handleMouseOver = e => {
    this.props.onMouseOver(e);
    this.props.onMouseOverComponent(this);
  }

  render() {
    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <li {...omit(this.props, Object.keys(OmittedContainerProps))}
        className={`widget-list-item ${LIST_ITEM_STYLE} ${this.props.className || ''}`}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.handleMouseClick}
        onMouseOver={this.handleMouseOver}>
        {this.props.children}
      </li>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}

ListItem.displayName = 'ListItem';

const OmittedContainerProps = {
  onMouseDown: PropTypes.func,
  onMouseDownOnComponent: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseUpOnComponent: PropTypes.func,
  onClick: PropTypes.func,
  onClickOnComponent: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOverComponent: PropTypes.func,
};

ListItem.propTypes = {
  ...OmittedContainerProps,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ListItem.defaultProps = {
  onMouseDown: () => {},
  onMouseDownOnComponent: () => {},
  onMouseUp: () => {},
  onMouseUpOnComponent: () => {},
  onClick: () => {},
  onClickOnComponent: () => {},
  onMouseOver: () => {},
  onMouseOverComponent: () => {},
};

export default ListItem;
