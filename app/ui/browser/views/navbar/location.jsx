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

import Style from '../../browser-style';
import Btn from './btn';

import { fixURL, getCurrentWebView } from '../../browser-util';
import { SHOW_COMPLETIONS } from '../../constants/ui';
import { Page } from '../../model';
import { getUserTypedLocation } from '../../selectors';

const LOCATION_BAR_CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
});

const LOCATION_BAR_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'center',
  overflow: 'hidden',
  padding: '0 10px',
  backgroundColor: '#fff',
  borderRadius: '2px',
  border: '1px solid',
  borderColor: '#e5e5e5',
  transition: `margin 0.3s ease-in-out,
               border-color 0.3s ease-in-out`,

  WebkitAppRegion: 'no-drag',

  margin: '12px 4vw',

  '@media (max-width: 1024px)': {
    margin: '12px 0',
  },
});

const LOCATION_BAR_AUTOCOMPLETE_STYLE = Style.registerStyle({
  flexDirection: 'column',
  position: 'absolute',
  background: '#fcfcfc',
  padding: 10,
  left: 0,
  right: 0,
  top: '100%',
  zIndex: 2,
});

const LOCATION_BAR_RESULTS_SNIPPET_STYLE = Style.registerStyle({
  color: 'rgba(100, 100, 100, 1)',
  padding: '0.5em',
  'white-space': 'pre-wrap',           // So that spaces show up in snippets.
  zIndex: 2,
});

const LOCATION_BAR_BUTTONS_STYLE = Style.registerStyle({
  margin: '0 3px',
});

const TITLE_BAR_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '*': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const INPUT_BAR_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
  border: 'none',
});

/**
 * The URL / location bar.
 * This needs to be a heavyweight component because we need to add listeners
 * to ipcRenderer on mount, and because the key-down event handler is non
 * trivial.
 */
export class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showURLBar: false,
      focusedResultIndex: -1,
    };

    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleTitleFocus = this.handleTitleFocus.bind(this);
    this.handleURLBarFocus = this.handleURLBarFocus.bind(this);
    this.handleURLBarBlur = this.handleURLBarBlur.bind(this);
    this.handleURLBarKeyDown = this.handleURLBarKeyDown.bind(this);
    this.toggleBookmark = this.toggleBookmark.bind(this);
  }

  componentDidMount() {
    this.props.ipcRenderer.on('focus-url-bar', () => {
      this.refs.input.select();
      this.setState({ showURLBar: true });
    });
    this.setInputValue(this.getRenderURL());
  }

  componentWillReceiveProps(nextProps) {
    // Reset the focused result if the input has changed (so that an index doesn't
    // get reused over a different result set).
    // focusedResultIndex may want to be moved to redux a la userTypedLocation,
    // depending on the eventual UX and if anywhere else would want to change it.
    if (this.props.userTypedLocation !== nextProps.userTypedLocation) {
      this.setState({ focusedResultIndex: -1 });
    }
  }

  componentDidUpdate() {
    // If we're showing the URL bar, it should be focused. The scenario
    // where this isn't true is immediately after displaying the URL bar,
    // so give it focus.
    if (this.state.showURLBar && document.activeElement !== this.refs.input) {
      this.refs.input.focus();
    }

    // this happens when userTypedLocation changed outside of a 'normal' input
    // change i.e. 'paste' context menu.  Need to make sure the input is actually set.
    // No tests for this right now, since shallow rendering doesn't support 'refs'.
    const nextLocation = this.getRenderURL();
    if (this.refs.input && nextLocation && this.refs.input.value !== nextLocation) {
      this.setInputValue(nextLocation);
    }
  }

  getRenderURL() {
    return this.props.userTypedLocation === null ?
            this.props.page.location : this.props.userTypedLocation;
  }

  getBookmarkIcon() {
    const { page, isBookmarked } = this.props;
    if (page.state === Page.PAGE_STATE_LOADING) {
      return 'glyph-bookmark-unknown-16.svg';
    }
    if (isBookmarked(page.location)) {
      return 'glyph-bookmark-filled-16.svg';
    }
    return 'glyph-bookmark-hollow-16.svg';
  }

  setInputValue(value) {
    // Can't use input.value here, since it breaks undo in chrome - See
    // http://stackoverflow.com/questions/16195644/in-chrome-undo-does-not-work-properly-for-input-element-after-contents-changed-p
    this.refs.input.focus();
    this.refs.input.select();
    this.refs.input.ownerDocument.execCommand('insertText', false, value);
  }

  toggleBookmark(e) {
    const { isBookmarked, bookmark, unbookmark } = this.props;
    const webview = getCurrentWebView(e.target.ownerDocument);
    const title = webview.getTitle();
    const url = webview.getURL();
    if (isBookmarked(url)) {
      unbookmark(url);
    } else {
      bookmark(title, url);
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

  handleURLBarKeyDown(ev, completionsForURL) {
    const maxCompletions = completionsForURL ? completionsForURL.length : -1;

    if (ev.key === 'Enter') {
      if (this.state.focusedResultIndex >= 0 &&
          this.state.focusedResultIndex < maxCompletions) {
        ev.preventDefault();
        this.setInputValue(completionsForURL[this.state.focusedResultIndex].uri);
      } else {
        this.props.navigateTo(fixURL(ev.target.value));
      }
    } else if (ev.key === 'Escape') {
      this.props.onLocationReset();
      ev.target.select();
    } else if (ev.key === 'ArrowDown' && maxCompletions > 0) {
      const focusedResultIndex =
        this.state.focusedResultIndex >= maxCompletions - 1 ? 0 : this.state.focusedResultIndex + 1;
      this.setState({ focusedResultIndex });
      ev.preventDefault();
    } else if (ev.key === 'ArrowUp' && maxCompletions > 0) {
      const focusedResultIndex =
        this.state.focusedResultIndex <= 0 ? maxCompletions - 1 : this.state.focusedResultIndex - 1;
      this.setState({ focusedResultIndex });
      ev.preventDefault();
    }
  }

  render() {
    const { profile } = this.props;
    const urlValue = this.getRenderURL();
    let completions = null;
    const completionsForURL = profile.completions.get(urlValue);

    const renderRow = (completion, i) => {
      // We get safe, decorated (<b>foo</b>) HTML from the database.
      const snippet = completion.snippet ? (
        <div
          className={LOCATION_BAR_RESULTS_SNIPPET_STYLE}
          dangerouslySetInnerHTML={{          // eslint-disable-line react/no-danger
            __html: completion.snippet,
          }}>
        </div>
      ) : null;

      return (
        <div style={{
          // We're nesting multi-line items inside a flexbox, so
          // we need to mark these children as columnar.
          'flex-flow': 'column',
          display: 'flex',
        }}>
          <div
            key={completion.uri}
            onMouseDown={(ev) => { ev.preventDefault(); }}
            onMouseOver={() => { this.setState({ focusedResultIndex: i }); }}
            onClick={() => {
              this.setInputValue(completionsForURL[i].uri);
            }}
            style={this.state.focusedResultIndex === i ? { background: 'red' } : null}>
            <span>{completion.title}</span>&nbsp;—&nbsp;<span>{completion.uri}</span>
          </div>
          {snippet}
        </div>
      );
    };

    if (SHOW_COMPLETIONS && completionsForURL) {
      const results = completionsForURL.map(renderRow);

      completions = (
        <div id="autocomplete-results"
          className={LOCATION_BAR_AUTOCOMPLETE_STYLE}>{results}</div>
       );

      // Don't show the completion box if there aren't any, or if there's
      // only one that matches the URL exactly.
      if (completionsForURL.length === 0 ||
           (completionsForURL.length === 1 && completionsForURL[0].uri === urlValue)) {
        completions = null;
      }
    }

    return (
      <div className={LOCATION_BAR_CONTAINER_STYLE}>
        <div id="browser-location-bar"
          className={`${LOCATION_BAR_STYLE}`}>
          <Btn title="Info"
            className={LOCATION_BAR_BUTTONS_STYLE}
            image=""
            clickHandler={() => {}} />
          <div id="browser-location-title-bar"
            className={TITLE_BAR_STYLE}
            hidden={this.state.showURLBar}
            tabIndex={0}
            onClick={this.handleTitleClick}
            onFocus={this.handleTitleFocus}>
            <span>
              {this.props.page.title}
            </span>
          </div>
          <input id="urlbar-input"
            className={INPUT_BAR_STYLE}
            style={{
              // Need to keep this in the DOM so it can be focused in setInputValue.
              // This won't be a problem if we decide to get rid of the hidden URL UI state.
              position: !this.state.showURLBar ? 'absolute' : null,
              top: !this.state.showURLBar ? '-1000px' : null,
            }}
            type="url"
            ref="input"
            onFocus={this.handleURLBarFocus}
            onBlur={this.handleURLBarBlur}
            onChange={this.props.onLocationChange}
            onKeyDown={(e) =>
              this.handleURLBarKeyDown(e, completionsForURL)
            }
            onContextMenu={this.props.onLocationContextMenu} />
          <Btn title="Bookmark"
            className={LOCATION_BAR_BUTTONS_STYLE}
            image={this.getBookmarkIcon()}
            disabled={this.props.page.state === Page.PAGE_STATE_LOADING}
            clickHandler={this.toggleBookmark} />
          {completions}
        </div>
      </div>
    );
  }
}

Location.propTypes = {
  page: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onLocationContextMenu: PropTypes.func.isRequired,
  onLocationReset: PropTypes.func.isRequired,
  isBookmarked: PropTypes.func.isRequired,
  bookmark: PropTypes.func.isRequired,
  unbookmark: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  userTypedLocation: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    userTypedLocation: getUserTypedLocation(state, ownProps.page.id),
  };
}

export default connect(mapStateToProps)(Location);
