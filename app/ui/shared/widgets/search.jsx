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

const INPUT_STYLE = Style.registerStyle({
  flex: 1,
  margin: 0,
  padding: 0,
  border: 'none',
  backgroundColor: 'var(--theme-content-background)',
  color: 'var(--theme-content-color)',
  font: 'inherit',
  textRendering: 'inherit',
  textShadow: 'inherit',
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = ComponentUtil.shouldPlainJsPropsComponentUpdate.bind(this);
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
        className={`widget-search ${this.props.className || ''}`}>
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
