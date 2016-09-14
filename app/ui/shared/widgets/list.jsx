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
import shallowEqual from 'fbjs/lib/shallowEqual';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import Style from '../style';

const LIST_STYLE = Style.registerStyle({
  display: 'flex',
  flexDirection: 'column',
  listStyleType: 'none',
  margin: 0,
  padding: 0,
});

class List extends Component {
  shouldComponentUpdate(nextProps) {
    // Since this component uses plain js objects as props, we need to perform
    // deep quality checks on them to make sure we don't unnecessarily rerender.
    // However, there is no need to re-render this parent component when the
    // children change, which would happen when doing naive deep equality.
    // Furthermore, children in this component may contain immutable.js props,
    // which are throwing warnings when accessing some of their properties
    // while doing deep equality checks using lodash's `deepEqual`.
    return !shallowEqual(this.props.children, nextProps.children) ||
      !isEqual(omit(this.props, ['children']), omit(nextProps, ['children']));
  }

  render() {
    return (
      <ul {...this.props}
        className={`widget-list ${LIST_STYLE} ${this.props.className || ''}`}>
        {this.props.children}
      </ul>
    );
  }
}

List.displayName = 'List';

List.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  hidden: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default List;
