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

const STATUS_STYLE = Style.registerStyle({
  position: 'fixed',
  bottom: 0,
  left: 0,
  zIndex: 1,
  padding: '2px 10px',
  borderTopRightRadius: '3px',
  border: '1px solid #eee',
  backgroundColor: '#fff',
  color: '#555',
  fontSize: '75%',
});

/**
 * The old status bar at the bottom of the page
 */
const Status = ({ page }) => {
  let contents;

  if (page.statusText) {
    contents = page.statusText;
  } else if (page.isLoading) {
    contents = 'Loading...';
  }

  return (
    <div className={STATUS_STYLE}
      hidden={!contents}>
      {contents}
    </div>
  );
};

Status.displayName = 'Status';

Status.propTypes = {
  page: PropTypes.object.isRequired,
};

export default Status;
