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
import Search from './search';
import SelectionList from './selection-list';

const AUTOCOMPLETED_SEARCH_STYLE = Style.registerStyle({
  position: 'relative',
});

const SELECTION_LIST_STYLE = Style.registerStyle({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  boxShadow: 'var(--theme-default-shadow)',
});

class AutocompletedSearch extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.state = {
      showSelectionList: false,
      selectedIndex: 0,
    };
  }

  handleInputChange = e => {
    this.setState({ showSelectionList: !!e.target.value });
    this.setState({ selectedIndex: 0 });

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleInputKeyDown = e => {
    const { showSelectionList, selectedIndex } = this.state;
    const { dataSrc } = this.props;
    const hasListItems = dataSrc && dataSrc.size;

    switch (e.key) {
      case 'Enter': {
        if (showSelectionList && hasListItems) {
          const index = this.state.selectedIndex;
          const data = this.props.dataSrc.get(index);
          this.props.onAutocompletionPick({ index, data });
          this.setState({ showSelectionList: false });
          // Don't call any `onKeyDown` event handler on a parent component.
          // If this were the DOM, act as if a `stopPropagation` was invoked.
          return;
        }
        break;
      }
      case 'Escape':
        if (showSelectionList) {
          this.setState({ showSelectionList: false });
        } else {
          this.inputbar.value = this.props.defaultValue || '';
          this.inputbar.select();
        }
        break;
      case 'ArrowUp':
        if (showSelectionList && hasListItems) {
          if (selectedIndex === 0) {
            this.setState({ selectedIndex: dataSrc.size - 1 });
          } else {
            this.setState({ selectedIndex: selectedIndex - 1 });
          }
          // Don't move cursor inside the input element.
          e.preventDefault();
        }
        break;
      case 'Tab':
      case 'ArrowDown':
        if (showSelectionList && hasListItems) {
          if (selectedIndex === dataSrc.size - 1) {
            this.setState({ selectedIndex: 0 });
          } else {
            this.setState({ selectedIndex: selectedIndex + 1 });
          }
          // Don't move cursor inside the input element.
          e.preventDefault();
        }
        break;
      default:
        break;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleMouseOverChildComponent = component => {
    const index = component.props['data-index'];
    this.setState({ selectedIndex: index });
  }

  handleClickOnChildComponent = component => {
    const index = component.props['data-index'];
    const data = this.props.dataSrc.get(index);
    this.props.onAutocompletionPick({ index, data });
    this.setState({ showSelectionList: false });
  }

  createChild = (data, i) => {
    const Child = this.props.childComponent;
    return (
      <Child key={`autocompleted-search-child-item-${i}`}
        data={data}
        selected={this.state.selectedIndex === i} />
    );
  }

  render() {
    return (
      <Search {...omit(this.props, Object.keys(SelectionListProps))}
        className={`${AUTOCOMPLETED_SEARCH_STYLE} ${this.props.className || ''}`}
        ref={e => this.inputbar = e}
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}>
        <SelectionList className={SELECTION_LIST_STYLE}
          hidden={!this.state.showSelectionList}
          selectedIndex={this.state.selectedIndex}
          onMouseOverChildComponent={this.handleMouseOverChildComponent}
          onClickOnChildComponent={this.handleClickOnChildComponent}>
          {this.props.dataSrc && this.props.dataSrc.map(this.createChild).toArray()}
        </SelectionList>
      </Search>
    );
  }
}

AutocompletedSearch.displayName = 'AutocompletedSearch';

const SelectionListProps = {
  dataSrc: ImmutablePropTypes.list,
  childComponent: PropTypes.func.isRequired,
  onAutocompletionPick: PropTypes.func.isRequired,
};

AutocompletedSearch.propTypes = {
  ...SelectionListProps,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default AutocompletedSearch;
