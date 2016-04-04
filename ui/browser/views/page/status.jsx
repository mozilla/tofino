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
