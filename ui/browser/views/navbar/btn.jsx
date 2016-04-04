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
 * A button for the NavBar.
 * `icon` must be a valid font-awesome icon name
 */
const Btn = ({ disabled, title, icon, onClick }) => (
  <a href="#" className={disabled ? 'disabled' : ''} {...{ title, onClick }}>
    <i className={`fa fa-${icon}`} />
  </a>
);

Btn.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Btn;
