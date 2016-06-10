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

import Style from '../style';

const VERTICAL_SEPARATOR_STYLE = Style.registerStyle({
  alignSelf: 'stretch',
  width: '1px',
  margin: '4px 10px',
  background: 'var(--theme-separator-color)',
});

const VerticalSeparator = props => {
  return (
    <div id={props.id}
      style={props.style}
      className={`${VERTICAL_SEPARATOR_STYLE} ${props.className || ''}`} />
  );
};

VerticalSeparator.displayName = 'VerticalSeparator';

VerticalSeparator.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default VerticalSeparator;
