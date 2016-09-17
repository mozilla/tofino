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

const SEARCH_STYLE = Style.registerStyle({
  minHeight: '25px',
});

const INPUT_STYLE = Style.registerStyle({
  flex: 1,
  padding: '2px 4px',
  border: '1px solid var(--theme-content-border-color)',
  borderRadius: 'var(--theme-default-roundness)',
});

class Search extends Component {
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

  set value(textContent) {
    this.input.value = textContent;
  }

  get value() {
    return this.input.value;
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }

  handleClick = () => {
    this.select();
    this.props.onClick();
  }

  render() {
    return (
      <div {...omit(this.props, Object.keys(OmittedContainerProps))}
        className={`widget-search ${SEARCH_STYLE} ${this.props.className || ''}`}>
        <input ref={e => this.input = e}
          className={INPUT_STYLE}
          type="text"
          placeholder={this.props.placeholder}
          defaultValue={this.props.defaultValue}
          onClick={this.handleClick}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onKeyPress={this.props.onKeyPress} />
        {this.props.children}
      </div>
    );
  }
}

Search.displayName = 'Search';

const OmittedContainerProps = {
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyPress: PropTypes.func,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
};

Search.propTypes = {
  ...OmittedContainerProps,
  style: PropTypes.object, // eslint-disable-line
  className: PropTypes.string,
  hidden: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Search.defaultProps = {
  onClick: () => {},
};

export default Search;
