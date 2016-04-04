
import React, { PropTypes } from 'react';

/**
 * The old status bar at the bottom of the page
 */
const Status = ({ page }) => (
  <div id="browser-page-status"
    className={page.statusText ? 'visible' : 'hidden'}>
    {(!page.statusText && page.isLoading) ? 'Loading...' : page.statusText}
  </div>
);

Status.propTypes = {
  page: PropTypes.object.isRequired,
};

export default Status;
