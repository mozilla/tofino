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
    return (
      <Btn title="Connection"
        className={this.props.className}
        image={this.props.image}
        imgWidth="16px"
        imgHeight="16px"
        onClick={this.props.onClick} />
    );
  }
}

SecurityBadge.displayName = 'SecurityBadge';

SecurityBadge.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  const pageLocation = page.location;
  const pageLoadState = PagesSelectors.getPageState(state, ownProps.pageId).load;
  const pageErrorState = PagesSelectors.getPageState(state, ownProps.pageId).error;

  let image = 'ssl-insecure.svg';
  if (!pageLocation ||
      pageLoadState === PageStateModel.STATES.CONNECTING ||
      pageLoadState === PageStateModel.STATES.LOADING) {
    // If the URL is empty (occurs during page loads when navigating back/forward),
    // or if the page is still loading (many sites use http -> https redirects,
    // we shouldn't penalize them for a quick interstitial), ust use the 'globe' icon.
    image = 'ssl-unknown.svg';
  } else if (pageLocation.startsWith('https') && !pageErrorState) {
    // Since we have unconfigurable security settings, if we access an HTTPS page and it loads,
    // it is considered secure. Otherwise, all HTTP pages are insecure. Also, since
    // we block all mixed content, this is even easier.
    image = 'ssl-secure.svg';
  } else if (pageLocation.startsWith(TOFINO_PROTOCOL)) {
    image = 'tofino-page-icon.png';
  }

  return {
    image,
  };
}

export default connect(mapStateToProps)(SecurityBadge);
