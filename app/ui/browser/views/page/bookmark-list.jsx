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

import React, {Component} from 'react';
import Relay from 'react-relay';

import Bookmark from './bookmark';

/**
 * A list of bookmarks.
 */
class BookmarkList extends Component {
  render() {
    const bookmarkCount = this.props.bookmarks.count;
    const bookmarks = this.props.bookmarks.edges;
    return (
        <ul>
          {bookmarks.map((edge) => (
            <Bookmark key={edge.node.id}
              bookmark={edge.node}
              viewer={this.props.viewer} />)
          )}
        </ul>
    );
  }
}

export default Relay.createContainer(BookmarkList, {
  fragments: {
    bookmarks: () => Relay.QL`
      fragment on _BookmarkConnection {
        count,
        edges {
          node {
            id,
            ${Bookmark.getFragment('bookmark')}
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on ReindexViewer {
        ${Bookmark.getFragment('viewer')}
      }
    `,
  },
});