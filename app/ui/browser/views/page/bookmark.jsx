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

import React, { Component } from 'react';
import Relay from 'react-relay';

/**
 * A bookmark.
 */
class Bookmark extends Component {
  render() {
    debugger
    const bookmark = this.props.bookmark;
    return (
      <li>{bookmark.uri} <button>Delete</button></li>
    );
  }
}

Bookmark.displayName = 'Bookmark';

export default Relay.createContainer(Bookmark, {
  fragments: {
    bookmark: () => Relay.QL`
      fragment on Bookmark {
        id,
        uri
      }
    `
  }
});

