import Relay from 'react-relay';

export default class DeleteBookmarkMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on ReindexViewer {
      id
      allBookmarks(first: 1000000) {
        count,
      }
    }`
  };

  getMutation() {
    return Relay.QL`mutation{ deleteBookmark }`;
  }

  getVariables() {
    return {
      id: this.props.id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on _BookmarkPayload {
        id,
        viewer {
          id,
          allBookmarks {
            count,
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'allBookmarks',
      deletedIDFieldName: 'id',
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }

  getOptimisticResponse() {
    return {
      id: this.props.id,
      viewer: {
        id: this.props.viewer.id,
        allBookmarks: {
          count: this.props.viewer.allBookmarks.count - 1,
        },
      },
    };
  }
}