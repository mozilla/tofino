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

import BookmarkList from './bookmark-list';
import TempBookmarksButtons from './temp-bookmarks-buttons';

import Style from '../../browser-style';

const BOOKMARKS_PANE_STYLE = Style.registerStyle({
  backgroundColor: 'var(--theme-body-color)',
  display: 'block',
  width: '20%',
});

/**
 * A pane containing bookmarks.
 */
class BookmarksPane extends Component {
  render() {
    return (
      <div className={BOOKMARKS_PANE_STYLE}>
        <BookmarkList bookmarks={this.props.viewer.allBookmarks} viewer={this.props.viewer} />
        <TempBookmarksButtons viewer={this.props.viewer}/>
      </div>
    );
  }
}

BookmarksPane.displayName = 'BookmarksPane';

export default Relay.createContainer(BookmarksPane, {
  fragments: {
    viewer: () => {
      return Relay.QL`
      fragment on ReindexViewer {
        allBookmarks(first: 1000) {
          count,
          edges {
            node {
              id,
              uri
            }
          }
          ${BookmarkList.getFragment('bookmarks')}
        }
        ${BookmarkList.getFragment('viewer')},
        ${TempBookmarksButtons.getFragment('viewer')},
      }
    `},
  },
});

