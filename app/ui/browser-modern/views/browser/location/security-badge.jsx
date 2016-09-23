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

import PageStateModel from '../../../model/page-state';
import Btn from '../../../../shared/widgets/btn';

import { TOFINO_PROTOCOL } from '../../../../../shared/constants/endpoints';
import * as PagesSelectors from '../../../selectors/pages';

class SecurityBadge extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    // Since we have unconfigurable security settings, if we access an HTTPS page and it loads,
    // it is considered secure. Otherwise, all HTTP pages are insecure. Also, since
    // we block all mixed content, this is even easier.
    let image = 'ssl-insecure.svg';
    if (/^https:/.test(this.props.url) && !this.props.errorState) {
      image = 'ssl-secure.svg';
    }

    // If we have a tofino:// page, if the URL is empty (occurs during
    // some page loads in our state), or if the page is still loading (many sites
    // use http -> https redirects, we shouldn't penalize them for a quick interstitial),
    // just hide the icon
    let hidden = false;
    if (!this.props.url ||
        this.props.url.startsWith(TOFINO_PROTOCOL) ||
        this.props.loadState === PageStateModel.STATES.CONNECTING ||
        this.props.loadState === PageStateModel.STATES.LOADING) {
      hidden = true;
    }

    return (
      <Btn title="Connection"
        hidden={hidden}
        image={image}
        imgWidth="16px"
        imgHeight="16px"
        onClick={this.props.onClick} />
    );
  }
}

SecurityBadge.displayName = 'SecurityBadge';

SecurityBadge.propTypes = {
  url: PropTypes.string.isRequired,
  loadState: PropTypes.string,
  errorState: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    url: page ? page.location : '',
    loadState: page ? PagesSelectors.getPageState(state, ownProps.pageId).load : '',
    errorState: page ? PagesSelectors.getPageState(state, ownProps.pageId).error : '',
  };
}

export default connect(mapStateToProps)(SecurityBadge);
