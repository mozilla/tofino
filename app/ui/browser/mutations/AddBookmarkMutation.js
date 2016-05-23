import Relay from 'react-relay';

export default class AddPageMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on ReindexViewer {
      id
      allBookmarks {
        count,
      }
    }`
  };

  getMutation() {
    return Relay.QL`mutation{ createBookmark }`;
  }

  getVariables() {
    return {
      uri: this.props.uri
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on _BookmarkPayload {
        changedBookmarkEdge,
        viewer {
          id,
          allBookmarks {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentID: this.props.viewer.id,
      connectionName: 'allBookmarks',
      edgeName: 'changedBookmarkEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }

  getOptimisticResponse() {
    return {
      changedBookmarkEdge: {
        node: {
          uri: this.props.uri,
        },
      },
      viewer: {
        id: this.props.viewer.id,
        allBookmarks: {
          count: this.props.viewer.allBookmarks.count + 1,
        },
      },
    };
  }
}
