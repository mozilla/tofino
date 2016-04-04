
import React, { PropTypes } from 'react';
import { inPageSearch } from '../../actions/external';

/**
 * In page search
 */
const Search = ({ isActive }) => (
  <div id="browser-page-search" className={isActive ? 'visible' : 'hidden'}>
    <input type="text" placeholder="Search..." onKeyDown={inPageSearch} />
  </div>
);

Search.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default Search;
