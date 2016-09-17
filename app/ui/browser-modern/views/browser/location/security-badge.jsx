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
import omit from 'lodash/omit';

import * as SharedPropTypes from '../../../model/shared-prop-types';
import PageStateModel from '../../../model/page-state';
import Btn from '../../../../shared/widgets/btn';

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
    if (/^https:/.test(this.props.url) && !this.props.pageState.error) {
      image = 'ssl-secure.svg';
    }

    // If we have a tofino:// page, if the URL is empty (occurs during
    // some page loads in our state), or if the page is still loading (many sites
    // use http -> https redirects, we shouldn't penalize them for a quick interstitial),
    // just hide the icon
    let hidden = this.props.hidden;
    if (!this.props.url ||
        this.props.pageState.load === PageStateModel.STATES.PRE_LOADING ||
        this.props.pageState.load === PageStateModel.STATES.LOADING ||
        /^tofino:/.test(this.props.url)) {
      hidden = true;
    }

    return (
      <Btn {...omit(this.props, Object.keys(OmittedContainerProps))}
        image={image}
        hidden={hidden}>
        {React.Children.toArray(this.props.children)}
      </Btn>
    );
  }
}

SecurityBadge.displayName = 'SecurityBadge';

const OmittedContainerProps = {
  url: PropTypes.string.isRequired,
  image: PropTypes.string,
  hidden: PropTypes.bool,
  pageState: SharedPropTypes.PageState.isRequired,
};

SecurityBadge.propTypes = {
  ...omit(Btn.propTypes, Object.keys(OmittedContainerProps)),
  url: OmittedContainerProps.url,
  pageState: OmittedContainerProps.pageState,
};

SecurityBadge.defaultProps = {
  url: '',
  hidden: false,
};

export default SecurityBadge;
