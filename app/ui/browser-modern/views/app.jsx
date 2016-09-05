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

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import Style from '../../shared/style';
import BrowserWindow from './browser/window';

import * as SharedPropTypes from '../model/shared-prop-types';
import * as PagesSelectors from '../selectors/pages';
import * as PageEffects from '../actions/page-effects';
import WebViewController from '../../shared/util/webview-controller';
import Deferred from '../../shared/util/deferred';

const APP_STYLE = Style.registerStyle({
  width: '100%',
  height: '100%',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.webViewController = new WebViewController(() => this.props.pages);
    this.addWebViewControllerListeners();
  }

  componentWillMount() {
    // All navigations need to be performed after this component mounts/updates,
    // so that the `pages` accessor on the `webViewController` is up to date.
    // When the redux store updates causing react to update the components tree,
    // a descendant component may be considered updated before this one, thus
    // any operation on the `webViewController` won't work in the descendant
    // components, since this component's properties won't be updated yet.
    this.updated = new Deferred();
  }

  componentDidMount() {
    this.updated.resolve();
  }

  componentWillReceiveProps() {
    this.updated = new Deferred();
  }

  componentDidUpdate() {
    this.updated.resolve();
  }

  addWebViewControllerListeners() {
    this.webViewController.on('navigate-to', (pageId, location) => {
      this.props.dispatch(PageEffects.navigatePageTo(pageId, location));
    });

    this.webViewController.on('navigate-back', (pageId) => {
      this.props.dispatch(PageEffects.navigatePageBack(pageId));
    });

    this.webViewController.on('navigate-forward', (pageId) => {
      this.props.dispatch(PageEffects.navigatePageForward(pageId));
    });

    this.webViewController.on('navigate-refresh', (pageId) => {
      this.props.dispatch(PageEffects.navigatePageRefresh(pageId));
    });
  }

  handlePageMount = (pageId, location) => {
    // Handle the initial navigation when a new Page component mounts.
    this.updated.promise.then(() => this.webViewController.navigateTo(pageId, location));
  }

  handleNavigateBack = pageId => {
    this.webViewController.navigateBack(pageId);
  }

  handleNavigateForward = pageId => {
    this.webViewController.navigateForward(pageId);
  }

  handleNavigateRefresh = pageId => {
    this.webViewController.navigateRefresh(pageId);
  }

  handleNavigateTo = (pageId, location) => {
    this.webViewController.navigateTo(pageId, location);
  }

  render() {
    const Element = Style.Element;
    return (
      <div className={APP_STYLE}>
        <BrowserWindow onPageMount={this.handlePageMount}
          onNavigateBack={this.handleNavigateBack}
          onNavigateForward={this.handleNavigateForward}
          onNavigateRefresh={this.handleNavigateRefresh}
          onNavigateTo={this.handleNavigateTo} />
        {/* Set a random prop on the Style.Element component, since we do
            want this to rerender when styles change even though there aren't
            any props passed in, to silence why-did-you-update warnings. */}
        <Element rand={Math.random()} />
      </div>
    );
  }
}

App.displayName = 'App';

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pages: SharedPropTypes.Pages.isRequired,
};

function mapStateToProps(state) {
  return {
    pages: PagesSelectors.getPages(state),
  };
}

export default connect(mapStateToProps)(Style.component(App));
