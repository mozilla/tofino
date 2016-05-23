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
import Relay from 'react-relay';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../../../shared/electron';

import Style from '../../browser-style';
import Btn from '../../widgets/btn';
import BookmarkButton from './bookmark-button';

// @TODO remove. temporary hack
import MainRoute from '../../main-route';

import { fixURL, getCurrentWebView } from '../../browser-util';
import { SHOW_COMPLETIONS } from '../../constants/ui';
import { Page } from '../../model';
import * as selectors from '../../selectors';
import * as actions from '../../actions/main-actions';

const LOCATION_BAR_CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
});

const LOCATION_BAR_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'center',
  overflow: 'hidden',
  margin: '10px 4vw',
  padding: '0 10px',
  border: 'var(--theme-locationbar-border-width) solid',
  borderColor: 'var(--theme-locationbar-border-color)',
  backgroundColor: 'var(--theme-locationbar-background)',
  color: 'var(--theme-content-color)',
  transition: `margin 0.3s ease-in-out,
               border-color 0.3s ease-in-out`,

  WebkitAppRegion: 'no-drag',
  cursor: 'default',

  '@media (max-width: 1024px)': {
    margin: '12px 0',
  },
});

const LOCATION_BAR_AUTOCOMPLETE_STYLE = Style.registerStyle({
  flexDirection: 'column',
  position: 'absolute',
  background: '#fcfcfc',
  color: 'var(--theme-body-color)',
  padding: 10,
  left: 0,
  right: 0,
  top: '100%',
  zIndex: 2,
  cursor: 'default',
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
  alignSelf: 'stretch',
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
  alignSelf: 'stretch',
  overflow: 'hidden',
  border: 'none',
  background: 'transparent',
  color: 'var(--theme-content-color)',
  '&::selection': {
    background: 'var(--theme-selection-color)',
    color: 'var(--theme-content-selected-color)',
  },
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

    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleTitleFocus = this.handleTitleFocus.bind(this);
    this.handleURLBarFocus = this.handleURLBarFocus.bind(this);
    this.handleURLBarBlur = this.handleURLBarBlur.bind(this);
    this.handleURLBarKeyDown = this.handleURLBarKeyDown.bind(this);
    this.handleBookmarkClick = this.handleBookmarkClick.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('focus-url-bar', () => {
      this.refs.input.select();
      this.props.dispatch(actions.setShowURLBar(true));
    });
  }

  componentWillReceiveProps(nextProps) {
    // Reset the focused result if the input has changed (so that an index doesn't
    // get reused over a different result set).
    // focusedResultIndex may want to be moved to redux a la userTypedLocation,
    // depending on the eventual UX and if anywhere else would want to change it.
    if (this.props.userTypedLocation !== nextProps.userTypedLocation) {
      this.props.dispatch(actions.setFocusedResultIndex(-1));
    }
  }

  componentDidUpdate() {
    // If we're showing the URL bar, it should be focused. The scenario
    // where this isn't true is immediately after displaying the URL bar,
    // so give it focus.
    if (this.props.showURLBar && document.activeElement !== this.refs.input) {
      this.refs.input.focus();
    }

    // This happens when userTypedLocation changed outside of a 'normal' input
    // change i.e., on location change.  Need to make sure the input is actually set.
    // No tests for this right now, since shallow rendering doesn't support 'refs'.
    const nextLocation = this.getRenderLocation();
    if (this.refs.input &&
        this.props.showURLBar &&    // This focuses the element, so don't do if hidden!
        nextLocation &&
        this.refs.input.value !== nextLocation) {
      this.setInputValue(nextLocation);
    }
  }

  getRenderLocation() {
    return this.props.userTypedLocation === null ?
            this.props.page.location : this.props.userTypedLocation;
  }

  getVisibleCompletionsForLocation() {
    const { profile } = this.props;
    const completionsForLocation = profile.completions.get(this.getRenderLocation());
    if (SHOW_COMPLETIONS && this.props.showCompletions &&
       this.props.focusedURLBar && completionsForLocation) {
      return completionsForLocation;
    }

    return null;
  }

  setInputValue(value) {
    // Can't use input.value here, since it breaks undo in chrome - See
    // http://stackoverflow.com/questions/16195644/in-chrome-undo-does-not-work-properly-for-input-element-after-contents-changed-p
    this.refs.input.focus();
    this.refs.input.select();
    this.refs.input.ownerDocument.execCommand('insertText', false, value);
  }

  selectAutocompleteItem(url) {
    this.setInputValue(url);
    this.props.navigateTo(url);
    this.refs.input.blur();
  }

  handleBookmarkClick(e) {
    var mutation = new AddBookmarkMutation({uri: 'http://gmail.com'});
    var query = Relay.Store.commitUpdate(mutation);
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
    this.props.dispatch(actions.setShowURLBar(true));
  }

  handleTitleFocus() {
    this.props.dispatch(actions.setShowURLBar(true));
  }

  handleURLBarFocus() {
    this.refs.input.select();
    this.props.dispatch(actions.setFocusedURLBar(true));
  }

  handleURLBarBlur() {
    this.props.dispatch(actions.setShowURLBar(false));
    this.props.dispatch(actions.setFocusedURLBar(false));
  }

  handleURLBarKeyDown(ev, completionsForLocation) {
    const maxCompletions = completionsForLocation ? completionsForLocation.length : -1;

    if (ev.key === 'Enter') {
      // When you hit enter, stop editing the URL bar. This avoids us
      // continuing to show completions, and also means you can tab around
      // web content.
      getCurrentWebView(ev.target.ownerDocument).focus();

      if (this.props.focusedResultIndex >= 0 &&
          this.props.focusedResultIndex < maxCompletions) {
        ev.preventDefault();
        this.selectAutocompleteItem(completionsForLocation[this.props.focusedResultIndex].uri);
      } else {
        this.props.navigateTo(fixURL(ev.target.value));
      }
    } else if (ev.key === 'Escape') {
      if (this.getVisibleCompletionsForLocation()) {
        // If there are visible completions, then close them.
        this.props.onClearCompletions();
      } else {
        // Otherwise, reset the input value to the page location
        this.props.onLocationReset();
      }
    } else if (ev.key === 'ArrowDown' && maxCompletions > 0) {
      const focusedResultIndex =
        this.props.focusedResultIndex >= maxCompletions - 1 ? 0 : this.props.focusedResultIndex + 1;
      this.props.dispatch(actions.setFocusedResultIndex(focusedResultIndex));
      ev.preventDefault();
    } else if (ev.key === 'ArrowUp' && maxCompletions > 0) {
      const focusedResultIndex =
        this.props.focusedResultIndex <= 0 ? maxCompletions - 1 : this.props.focusedResultIndex - 1;
      this.props.dispatch(actions.setFocusedResultIndex(focusedResultIndex));
      ev.preventDefault();
    }
  }

  render() {
    const { pages, page } = this.props;
    let completions = null;
    const completionsForLocation = this.getVisibleCompletionsForLocation();
    const urlValue = this.getRenderLocation();

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
            onMouseOver={() => { this.props.dispatch(actions.setFocusedResultIndex(i)); }}
            onClick={() => {
              this.selectAutocompleteItem(completionsForLocation[i].uri);
            }}
            style={this.props.focusedResultIndex === i ? {
              background: 'var(--theme-selection-color)',
              color: 'var(--theme-content-selected-color)',
            } : null}>
            <span>{completion.title}</span>&nbsp;—&nbsp;<span>{completion.uri}</span>
          </div>
          {snippet}
        </div>
      );
    };

    if (completionsForLocation) {
      const results = completionsForLocation.map(renderRow);

      completions = (
        <div id="autocomplete-results"
          className={LOCATION_BAR_AUTOCOMPLETE_STYLE}>{results}</div>
       );

      // Don't show the completion box if there aren't any, or if there's
      // only one that matches the URL exactly.
      if (completionsForLocation.length === 0 ||
           (completionsForLocation.length === 1 && completionsForLocation[0].uri === urlValue)) {
        completions = null;
      }
    }

    const allInputs = pages.map(p => {
      if (page === p) {
        return (<input
          id="urlbar-input"
          className={INPUT_BAR_STYLE}
          defaultValue={p.location}
          key={p.id}
          style={{
            // Need to keep this in the DOM so it can be focused in setInputValue.
            // This won't be a problem if we decide to get rid of the hidden URL UI state.
            position: !this.props.showURLBar ? 'absolute' : null,
            top: !this.props.showURLBar ? '-1000px' : null,
          }}
          disabled={!this.props.showURLBar}
          type="url"
          ref="input"
          onFocus={this.handleURLBarFocus}
          onBlur={this.handleURLBarBlur}
          onChange={(e) => {
            // There's a case here where the location can be reset from an action which
            // causes a react change event to fire.  In this case, there's no need to
            // notify about it.  Otherwise, pressing ESC will cause the location to
            // reset *and* trigger onChange, which makes the autocomplete popup open.
            if (this.getRenderLocation() !== e.target.value) {
              this.props.onLocationChange(e);
            }
          }}
          onKeyDown={(e) =>
            this.handleURLBarKeyDown(e, completionsForLocation)
          }
          onContextMenu={this.props.onLocationContextMenu} />);
      }

      return (<input
        key={p.id}
        defaultValue={p.location}
        style={{ display: 'none' }}
        disabled="true"
        type="url" />);
    });

    // @TODO remove. temporary hack to pass location into button.
    const renderRelay = (data) => {
      return (
        <BookmarkButton {...data} location={this.props.page.location} />
      );
    }

    return (
      <div className={LOCATION_BAR_CONTAINER_STYLE}>
        <div id="browser-location-bar"
          className={`${LOCATION_BAR_STYLE}`}>
          <Btn title="Info"
            className={LOCATION_BAR_BUTTONS_STYLE}
            image=""
            onClick={() => {}} />
          <div id="browser-location-title-bar"
            className={TITLE_BAR_STYLE}
            hidden={this.props.showURLBar}
            tabIndex={0}
            onClick={this.handleTitleClick}
            onFocus={this.handleTitleFocus}>
            <span>
              {this.props.page.title}
            </span>
          </div>
          {allInputs}
          <Relay.RootContainer
            Component={BookmarkButton}
            route={new MainRoute()}
            renderFetched={renderRelay}/>
          {completions}
        </div>
      </div>
    );
  }
}

Location.displayName = 'Location';

Location.propTypes = {
  dispatch: PropTypes.func.isRequired,
  page: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  onClearCompletions: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onLocationContextMenu: PropTypes.func.isRequired,
  onLocationReset: PropTypes.func.isRequired,
  isBookmarked: PropTypes.func.isRequired,
  bookmark: PropTypes.func.isRequired,
  unbookmark: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  userTypedLocation: PropTypes.string.isRequired,
  showCompletions: PropTypes.bool.isRequired,
  showURLBar: PropTypes.bool.isRequired,
  focusedURLBar: PropTypes.bool.isRequired,
  focusedResultIndex: PropTypes.number.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    userTypedLocation: selectors.getUserTypedLocation(state, ownProps.page.id),
    showCompletions: selectors.showCompletions(state),
    showURLBar: selectors.showURLBar(state),
    focusedURLBar: selectors.focusedURLBar(state),
    focusedResultIndex: selectors.focusedResultIndex(state),
  };
}

export default connect(mapStateToProps)(Location);
