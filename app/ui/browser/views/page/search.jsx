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

import React, { PropTypes } from 'react';

import Style from '../../browser-style';
import { inPageSearch } from '../../actions/external';

const SEARCH_STYLE = Style.registerStyle({
  zIndex: '1',
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '300px',
  height: '25px',
});

const INPUT_STYLE = Style.registerStyle({
  flex: '1',
  padding: '2px 4px',
  border: '1px solid #eee',
  borderRadius: '3px',
});

const Search = ({ hidden }) => (
  <div id="browser-page-search"
    className={SEARCH_STYLE}
    {...{ hidden }}>
    <input className={INPUT_STYLE}
      type="text"
      placeholder="Search..."
      onKeyDown={inPageSearch} />
  </div>
);

Search.displayName = 'Search';

Search.propTypes = {
  hidden: PropTypes.bool.isRequired,
};

export default Search;
