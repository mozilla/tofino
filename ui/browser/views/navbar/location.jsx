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
import { connect } from 'react-redux';
import Btn from './btn.jsx';
import { menuLocationContext, bookmark, unbookmark } from '../../actions/external';
import { setLocation } from '../../actions/main-actions';
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
      this.props.dispatch(setLocation());
      ev.target.select();
    }
  }

  render() {
    const { page, dispatch } = this.props;
    const value = page.userTyped !== null ? page.userTyped : page.location;

    const onBookmark = e => {
      const webview = getCurrentWebView(e.target.ownerDocument);
      const title = webview.getTitle();
      const url = webview.getURL();
      if (page.isBookmarked) {
        unbookmark(url, dispatch);
      } else {
        bookmark(title, url, dispatch);
      }
    };

    return (
      <div id="browser-location-bar">
        <input id="urlbar-input" type="text" ref="input"
          value={value}
          onChange={ev => dispatch(setLocation(ev.target.value))}
          onClick={ev => ev.target.select()}
          onContextMenu={ev => menuLocationContext(ev.target, dispatch)}
          onKeyDown={this.handleKeyDown} />

        <Btn title="Bookmark"
          // TODO Need an asset for this
          image={page.isBookmarked ? '' : ''}
          onClick={onBookmark} />
      </div>
    );
  }
}

Location.propTypes = {
  page: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
};

export default connect()(Location);
