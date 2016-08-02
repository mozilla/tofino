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
import { ipcRenderer } from '../../../../shared/electron';

import Style from '../../../shared/style';
import * as UIConstants from '../../constants/ui';
import Btn from '../../../shared/widgets/btn';
import LocationCompletionRow from './location-completion-row';

import { fixURL, getCurrentWebView } from '../../browser-util';
import { Page } from '../../model';
import * as selectors from '../../selectors';
import * as actions from '../../actions/main-actions';

const LOCATION_BAR_CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
});

const LOCATION_BAR_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
  margin: '7px 22vw',
  border: 'var(--theme-locationbar-border-width) solid',
  borderColor: 'var(--theme-locationbar-border-color)',
  backgroundColor: 'var(--theme-locationbar-background)',
  color: 'var(--theme-content-color)',

  WebkitAppRegion: 'no-drag',
  cursor: 'default',

  '@media (max-width: 1024px)': {
    margin: '7px 0px',
  },
});

const LOCATION_BAR_AUTOCOMPLETE_STYLE = Style.registerStyle({
  flexDirection: 'column',
  position: 'absolute',
  background: '#fcfcfc',
  fontSize: '110%',
  padding: '10px 20vw',
  left: 0,
  right: 0,
  top: '100%',
  zIndex: UIConstants.LOCATION_BAR_AUTOCOMPLETE_ZINDEX,
  cursor: 'default',
});

const LOCATION_BAR_BUTTONS_STYLE = Style.registerStyle({
  margin: '0 4px',
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
  fontSize: '130%',
});

const INPUT_BAR_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
  border: 'none',
  background: 'transparent',
  color: 'var(--theme-content-color)',
  '&::selection': {
    background: 'var(--theme-selection-color)',
    color: 'var(--theme-content-selected-color)',
  },
  fontWeight: 100,
  fontSize: '120%',
});

/**
 * The URL / location bar.
 * This needs to be a heavyweight component because we need to add listeners
 * to ipcRenderer on mount, and because the key-down event handler is non
 * trivial.
 */
export class Location extends Component {
  componentDidMount() {
    ipcRenderer.on('focus-url-bar', () => {
      this.input.select();
      this.props.dispatch(actions.setShowURLBar(this.props.page.id, true));
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
    if (this.props.showURLBar && document.activeElement !== this.input) {
      this.input.focus();
    }

    // This happens when userTypedLocation changed outside of a 'normal' input
    // change i.e., on location change.  Need to make sure the input is actually set.
    // No tests for this right now, since shallow rendering doesn't support 'refs'.
    const nextLocation = this.getRenderLocation();
    if (this.input &&
        this.props.showURLBar &&    // This focuses the element, so don't do if hidden!
        nextLocation &&
        this.input.value !== nextLocation) {
      this.setInputValue(nextLocation);
    }
  }

  getRenderLocation() {
    return this.props.userTypedLocation === null ?
            this.props.page.location : this.props.userTypedLocation;
  }

  getInfoButtonIcon() {
    const { focusedURLBar } = this.props;

    if (focusedURLBar) {
      return 'glyph-search-16.svg';
    }

    // The only state we have currently for this is the search icon --
    // fall back to default, but in the future we can have SSL/favicon
    // icons, etc.
    return '';
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

  getVisibleCompletionsForLocation() {
    const { profile } = this.props;
    const completionsForLocation = profile.completions.get(this.getRenderLocation());
    if (UIConstants.SHOW_COMPLETIONS && this.props.showCompletions &&
       this.props.focusedURLBar && completionsForLocation) {
      return completionsForLocation;
    }

    return null;
  }

  setInputValue(value) {
    // Can't use input.value here, since it breaks undo in chrome - See
    // http://stackoverflow.com/questions/16195644/in-chrome-undo-does-not-work-properly-for-input-element-after-contents-changed-p
    this.input.focus();
    this.input.select();
    this.input.ownerDocument.execCommand('insertText', false, value);
  }

  selectAutocompleteItem(url) {
    this.setInputValue(url);
    this.props.navigateTo(url);
    this.input.blur();
  }

  handleBookmarkClick = (e) => {
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

  handleTitleClick = () => {
    this.props.dispatch(actions.setShowURLBar(this.props.page.id, true));
  }

  handleTitleFocus = () => {
    this.props.dispatch(actions.setShowURLBar(this.props.page.id, true));
  }

  handleURLBarFocus = () => {
    this.input.select();
    this.props.dispatch(actions.setFocusedURLBar(this.props.page.id, true));
  }

  handleURLBarBlur = () => {
    this.props.dispatch(actions.setShowURLBar(this.props.page.id, false));
    this.props.dispatch(actions.setFocusedURLBar(this.props.page.id, false));
  }

  handleURLBarKeyDown = (ev, completionsForLocation) => {
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

  handleCompletionClick = (url) => {
    this.selectAutocompleteItem(url);
  }

  handleCompletionMouseOver = (index) => {
    this.props.dispatch(actions.setFocusedResultIndex(index));
  }

  render() {
    const { pages, page } = this.props;
    let completions = null;
    const completionsForLocation = this.getVisibleCompletionsForLocation();
    const urlValue = this.getRenderLocation();

    if (completionsForLocation) {
      const results = completionsForLocation.map((completion, index) => {
        return (<LocationCompletionRow completion={completion}
          isFocused={this.props.focusedResultIndex === index}
          onCompletionMouseOver={this.handleCompletionMouseOver}
          onCompletionClick={this.handleCompletionClick}
          index={index} />);
      });

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
          ref={i => this.input = i}
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

    return (
      <div className={LOCATION_BAR_CONTAINER_STYLE}>
        <div id="browser-location-bar"
          className={`${LOCATION_BAR_STYLE}`}>
          <Btn title="Info"
            className={LOCATION_BAR_BUTTONS_STYLE}
            image={this.getInfoButtonIcon()}
            imgWidth="16px"
            imgHeight="16px"
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
          <Btn title="Bookmark"
            className={LOCATION_BAR_BUTTONS_STYLE}
            image={this.getBookmarkIcon()}
            imgWidth="16px"
            imgHeight="16px"
            disabled={this.props.page.state === Page.PAGE_STATE_LOADING}
            onClick={this.handleBookmarkClick} />
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
  userTypedLocation: PropTypes.string,
  showCompletions: PropTypes.bool.isRequired,
  showURLBar: PropTypes.bool.isRequired,
  focusedURLBar: PropTypes.bool.isRequired,
  focusedResultIndex: PropTypes.number.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    userTypedLocation: selectors.getUserTypedLocation(state, ownProps.page.id),
    showCompletions: selectors.showCompletions(state),
    showURLBar: selectors.showURLBar(state, ownProps.page.id),
    focusedURLBar: selectors.focusedURLBar(state, ownProps.page.id),
    focusedResultIndex: selectors.focusedResultIndex(state),
  };
}

export default connect(mapStateToProps)(Location);
