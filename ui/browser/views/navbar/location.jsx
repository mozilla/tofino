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

  constructor(props) {
    super(props);
    this.state = {
      showURLBar: false,
    };

    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleTitleFocus = this.handleTitleFocus.bind(this);
    this.handleURLBarFocus = this.handleURLBarFocus.bind(this);
    this.handleURLBarBlur = this.handleURLBarBlur.bind(this);
  }


  componentDidMount() {
    this.props.ipcRenderer.on('focus-urlbar', () => this.refs.input.select());
  }

  componentDidUpdate() {
    // If we're showing the URL bar, it should be focused. The scenario
    // where this isn't true is immediately after displaying the URL bar,
    // so give it focus
    if (this.state.showURLBar && document.activeElement !== this.refs.input) {
      this.refs.input.focus();
    }
  }

  handleTitleClick() {
    this.setState({ showURLBar: true });
  }

  handleTitleFocus() {
    this.setState({ showURLBar: true });
  }

  handleURLBarFocus() {
    this.refs.input.select();
  }

  handleURLBarBlur() {
    this.setState({ showURLBar: false });
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
    const { page, onLocationChange, onLocationContextMenu,
      isBookmarked, bookmark, unbookmark } = this.props;
    const urlValue = page.userTyped !== null ? page.userTyped : page.location;
    const { showURLBar } = this.state;

    const onBookmark = e => {
      const webview = getCurrentWebView(e.target.ownerDocument);
      const title = webview.getTitle();
      const url = webview.getURL();
      if (isBookmarked(url)) {
        unbookmark(url);
      } else {
        bookmark(title, url);
      }
    };

    const bookmarkImage = (() => {
      if (page.isLoading) {
        return 'glyph-bookmark-unknown-16.svg';
      }
      if (isBookmarked(page.location)) {
        return 'glyph-bookmark-filled-16.svg';
      }
      return 'glyph-bookmark-hollow-16.svg';
    })();

    return (
      <div id="browser-location-bar"
        style={{
          flex: 1,
          display: 'flex',
          margin: '5px 50px',
          backgroundColor: '#fff',
          border: 'solid 1px #e5e5e5',
          borderRadius: '3px',
        }}>
        <Btn title="Info"
          image={''}
          clickHandler={function() {}}
          style={{
            display: 'flex',
            margin: '0px 3px 0px 3px',
          }} />
        <span id="browser-location-title-bar"
          tabIndex={0}
          onClick={this.handleTitleClick}
          onFocus={this.handleTitleFocus}
          style={{
            flex: 1,
            display: showURLBar ? 'none' : 'block',
            marginTop: '3px',
            textAlign: 'center',
            overflow: 'hidden',
          }}>
          {page.title}
        </span>
        <input id="urlbar-input"
          type="text"
          ref="input"
          onFocus={this.handleURLBarFocus}
          onBlur={this.handleURLBarBlur}
          showURLBar={showURLBar}
          style={{
            flex: 1,
            margin: '0px 10px',
            padding: '0px 10px',
            display: showURLBar ? 'block' : 'none',
          }}
          defaultValue={urlValue}
          onChange={onLocationChange}
          onKeyDown={this.handleKeyDown}
          onContextMenu={onLocationContextMenu} />

        <Btn title="Bookmark"
          image={bookmarkImage}
          disabled={page.isLoading}
          clickHandler={onBookmark}
          style={{
            display: 'flex',
            margin: '2px 6px 0px 6px',
          }} />
      </div>
    );
  }
}

Location.propTypes = {
  page: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onLocationContextMenu: PropTypes.func.isRequired,
  onLocationReset: PropTypes.func.isRequired,
  isBookmarked: PropTypes.func.isRequired,
  bookmark: PropTypes.func.isRequired,
  unbookmark: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
};

export default Location;
