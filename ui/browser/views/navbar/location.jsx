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

import React, { PropTypes, Component } from 'react';
import Btn from './btn.jsx';
import { fixURL, getCurrentWebView } from '../../browser-util';

/**
 * The URL / location bar.
 * This needs to be a heavyweight component because we need to add listeners
 * to ipcRenderer on mount, and because the key-down event handler is non
 * trivial.
 */
class Location extends Component {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.props.ipcRenderer.on('focus-urlbar', () => this.refs.input.select());
  }

  handleKeyDown(ev) {
    if (ev.keyCode === 13) { // enter
      const location = fixURL(ev.target.value);
      const webview = getCurrentWebView(ev.target.ownerDocument);
      webview.setAttribute('src', location);
    } else if (ev.keyCode === 27) { // esc
      // Restore back to page location and reset userTyped
      this.props.onLocationReset();
      ev.target.select();
    }
  }

  render() {
    const { page, onLocationChange, onLocationContextMenu, bookmark, unbookmark } = this.props;
    const value = page.userTyped !== null ? page.userTyped : page.location;

    const onBookmark = e => {
      const webview = getCurrentWebView(e.target.ownerDocument);
      const title = webview.getTitle();
      const url = webview.getURL();
      if (page.isBookmarked) {
        unbookmark(url);
      } else {
        bookmark(title, url);
      }
    };

    return (
      <div id="browser-location-bar">
        <input id="urlbar-input" type="text" ref="input"
          value={value}
          onChange={onLocationChange}
          onClick={ev => ev.target.select()}
          onContextMenu={onLocationContextMenu}
          onKeyDown={this.handleKeyDown} />

        <Btn title="Bookmark"
          icon={page.isBookmarked ? 'star fa-lg' : 'star-o fa-lg'}
          onClick={onBookmark} />
      </div>
    );
  }
}

Location.propTypes = {
  page: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onLocationContextMenu: PropTypes.func.isRequired,
  onLocationReset: PropTypes.func.isRequired,
  bookmark: PropTypes.func.isRequired,
  unbookmark: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
};

export default Location;
