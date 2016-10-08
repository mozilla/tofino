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
import ImmutablePropTypes from 'react-immutable-proptypes';
import omit from 'lodash/omit';
import * as ComponentUtil from '../util/component-util';

import Style from '../style';
import Search from './search';
import SelectionList from './selection-list';

const AUTOCOMPLETED_SEARCH_STYLE = Style.registerStyle({
  position: 'relative',
});

const SELECTION_LIST_STYLE = Style.registerStyle({
  zIndex: 1,
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  boxShadow: 'var(--theme-default-shadow)',
});

class AutocompletedSearch extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = ComponentUtil.shouldMixedPropsComponentUpdate.bind(this, {
      immutables: ['dataSrc'],
    });

    this.state = {
      showSelectionList: false,
      selectedIndex: 0,
    };
  }

  componentWillMount() {
    if (typeof window === 'object') {
      window.addEventListener('click', this.handleWindowClick);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.showSelectionList && !nextState.showSelectionList) {
      nextProps.onAutocompletionListHide();
    } else if (!this.state.showSelectionList && nextState.showSelectionList) {
      nextProps.onAutocompletionListShow();
    }
  }

  componentWillUnmount() {
    if (typeof window === 'object') {
      window.removeEventListener('click', this.handleWindowClick);
    }
  }

  handleWindowClick = () => {
    // We can't call `setState` on components which haven't rendered yet,
    // in which case this component's inputbar element won't be available.
    if (this.state.showSelectionList && this.inputbar) {
      this.setState({ showSelectionList: false });
    }
  }

  handleInputChange = e => {
    this.setState({ showSelectionList: !!e.target.value });
    this.setState({ selectedIndex: 0 });

    this.props.onChange(e);
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
          this.inputbar.value = this.inputbar.defaultValue || '';
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

    this.props.onKeyDown(e);
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
        <SelectionList className={`${SELECTION_LIST_STYLE} ${this.props.autocompletionListClassName || ''}`}
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
  autocompletionListClassName: PropTypes.string,
  dataSrc: ImmutablePropTypes.list,
  childComponent: PropTypes.func.isRequired,
  onAutocompletionPick: PropTypes.func.isRequired,
  onAutocompletionListShow: PropTypes.func,
  onAutocompletionListHide: PropTypes.func,
};

AutocompletedSearch.propTypes = {
  ...SelectionListProps,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
};

AutocompletedSearch.defaultProps = {
  onAutocompletionListShow: () => {},
  onAutocompletionListHide: () => {},
  onChange: () => {},
  onKeyDown: () => {},
};

export default AutocompletedSearch;
