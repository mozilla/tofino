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

const LIST_STYLE = Style.registerStyle({
  display: 'flex',
  flexDirection: 'column',
  listStyleType: 'none',
  margin: 0,
  padding: 0,
});

class List extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = ComponentUtil.shouldPlainJsPropsComponentUpdate.bind(this);
  }

  render() {
    const childrenArray = React.Children.toArray(this.props.children);
    const childrenView = this.props.reversed ? childrenArray.reverse() : childrenArray;
    return (
      <ul {...omit(this.props, Object.keys(OmittedContainerProps))}
        className={`widget-list ${LIST_STYLE} ${this.props.className || ''}`}>
        {childrenView}
      </ul>
    );
  }
}

List.displayName = 'List';

const OmittedContainerProps = {
  reversed: PropTypes.bool,
};

List.propTypes = {
  ...OmittedContainerProps,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default List;
