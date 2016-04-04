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
