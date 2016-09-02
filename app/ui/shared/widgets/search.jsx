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
import isEqual from 'lodash/isEqual';

import Style from '../style';

const SEARCH_STYLE = Style.registerStyle({
  minHeight: '25px',
});

const INPUT_STYLE = Style.registerStyle({
  flex: '1',
  padding: '2px 4px',
  border: '1px solid var(--theme-content-border-color)',
  borderRadius: 'var(--theme-default-roundness)',
});

class Search extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    return (
      <div {...this.props}
        className={`${SEARCH_STYLE} ${this.props.className || ''}`}>
        <input className={INPUT_STYLE}
          type="text"
          placeholder="Search..."
          onKeyUp={this.props.onKeyUp} />
      </div>
    );
  }
}

Search.displayName = 'Search';

Search.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  hidden: PropTypes.bool.isRequired,
  onKeyUp: PropTypes.func.isRequired,
};

export default Search;
