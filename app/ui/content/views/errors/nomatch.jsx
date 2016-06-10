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

import React from 'react';

import Style from '../../../shared/style';

const NO_MATCH_STYLE = Style.registerStyle({
  flex: 1,
  paddingTop: '20vh',
  justifyContent: 'center',
  color: 'var(--theme-content-color)',
  fontSize: '500%',
});

const NoMatch = () => {
  return (
    <div className={NO_MATCH_STYLE}>
      404
    </div>
  );
};

NoMatch.displayName = 'NoMatch';

export default NoMatch;
