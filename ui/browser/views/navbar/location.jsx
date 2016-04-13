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

import React, { PropTypes, createClass } from 'react';
import Btn from './btn.jsx';
import { fixURL, getCurrentWebView } from '../../browser-util';

/**
 * The URL / location bar.
 * This needs to be a heavyweight component because we need to add listeners
 * to ipcRenderer on mount, and because the key-down event handler is non
 * trivial.
 */
const Location = createClass({

  propTypes: {
    page: PropTypes.object.isRequired,
    onLocationChange: PropTypes.func.isRequired,
    onLocationContextMenu: PropTypes.func.isRequired,
    onLocationReset: PropTypes.func.isRequired,
    bookmark: PropTypes.func.isRequired,
    unbookmark: PropTypes.func.isRequired,
    ipcRenderer: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      showURLBar: false,
    };
  },

  componentDidMount() {
    this.props.ipcRenderer.on('focus-urlbar', () => this.refs.input.select());
  },

  componentDidUpdate() {
    // If we're showing the URL bar, it should be focused. The scenario
    // where this isn't true is immediately after displaying the URL bar,
    // so give it focus
    if (this.state.showURLBar && document.activeElement !== this.refs.input) {
      this.refs.input.focus();
    }
  },

  /*
  shouldComponentUpdate(nextProps) {
    // Currently only update if more changed other than what
    // the user typed into the URL bar
    return nextProps.page.userTyped === this.props.page.userTyped;
  },
  */

  onTitleClick() {
    this.setState({ showURLBar: true });
  },

  onTitleFocus() {
    this.setState({ showURLBar: true });
  },

  onURLBarFocus() {
    this.refs.input.select();
  },

  onURLBarBlur() {
    this.setState({ showURLBar: false });
  },

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
  },

  render() {
    const { page, onLocationChange, onLocationContextMenu, bookmark, unbookmark } = this.props;
    const urlValue = page.userTyped !== null ? page.userTyped : page.location;
    const { showURLBar } = this.state;

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
      <div id="browser-location-bar"
        style={{
          flex: 1,
          display: 'flex',
          margin: '0 5px',
        }}>
        <Btn title="Info"
          image={''}
          clickHandler={function() {}}
          style={{
            flex: 1,
            display: 'flex',
          }} />
        <span id="browser-location-title-bar"
          tabIndex={0}
          onClick={this.onTitleClick}
          onFocus={this.onTitleFocus}
          style={{
            flex: 1,
            display: showURLBar ? 'none' : 'flex',
          }}>
          {page.title}
        </span>
        <input id="urlbar-input" type="text" ref="input"
          onFocus={this.onURLBarFocus}
          onBlur={this.onURLBarBlur}
          showURLBar={showURLBar}
          style={{
            flex: 1,
            display: showURLBar ? 'flex' : 'none',
          }}
          defaultValue={urlValue}
          onChange={onLocationChange}
          onKeyDown={this.handleKeyDown}
          onContextMenu={onLocationContextMenu} />

        <Btn title="Bookmark"
          image={page.isBookmarked
            ? 'glyph-bookmark-filled-16.svg'
            : 'glyph-bookmark-hollow-16.svg'}
          clickHandler={onBookmark}
          style={{
            flex: 1,
            display: 'flex',
          }} />
      </div>
    );
  },
});

export default Location;
