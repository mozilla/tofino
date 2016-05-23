// @TODO If we decide to go with Relay, this would be handled by the bookmark star. Unfortunately,
// to integrate that with Relay we'd have to incorporate the location bar, which has a lot of
// properties coming from Redux, so this is just a temporary hack to demonstrate.

import React, { Component } from 'react';
import Relay from 'react-relay';

import AddBookmarkMutation from '../../mutations/AddBookmarkMutation';

const handleBookmarkAdd = (site, viewer) => {
  Relay.Store.commitUpdate(
    new AddBookmarkMutation({
      uri: site.uri,
      title: site.title,
      viewer: viewer,
    }),
  );
}
const sites = [
  {
    'title': 'Facebook',
    'uri': 'http://facebook.com',
  },
  {
    'title': 'Twitter',
    'uri': 'http://twitter.com',
  }
];

/**
 * Temporary buttons to demonstrate adding bookmarks.
 */
class TempBookmarksButtons extends Component {
  render() {
    return (
      <div>
        {sites.map(site => <button onClick={handleBookmarkAdd.bind(null, site, this.props.viewer)}>{site.title}</button>)}
      </div>
    );
  }
}

TempBookmarksButtons.displayName = 'TempBookmarksButtons';

export default Relay.createContainer(TempBookmarksButtons, {
  fragments: {
    viewer: () => {
      return Relay.QL`
      fragment on ReindexViewer {
        ${AddBookmarkMutation.getFragment('viewer')},
      }
    `},
  },
});

