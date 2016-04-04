/* eslint react/prefer-es6-class: 0 */

const React = require('react');
const ReactDOM = require('react-dom');

const Host = require('../shared/channel');

const BookmarksTable = React.createClass({
  getInitialState() {
    return {
      bookmarks: [],
    };
  },

  componentDidMount() {
    Host.on('bookmarks-data', this.onBookmarkData);
    Host.send('bookmarks-update');
  },

  componentWillUnmount() {
    Host.off('bookmarks-data', this.onBookmarkData);
  },

  onBookmarkData(channel, type, data) {
    this.setState({ bookmarks: data });
  },

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {this.state.bookmarks.map((bookmark) => (
            <tr key={bookmark.id}>
              <td>{bookmark.title}</td>
              <td>{bookmark.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
});

ReactDOM.render(
  <BookmarksTable />,
  document.getElementById('bookmarks')
);
