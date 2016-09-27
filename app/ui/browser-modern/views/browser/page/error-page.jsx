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
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import Style from '../../../../shared/style';
import NetErrorPage from './net-error';
import CertErrorPage from './cert-error';

import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as PagesSelectors from '../../../selectors/pages';

const ERROR_PAGE_STYLE = Style.registerStyle({
  width: '100%',
  height: '100%',
  position: 'absolute',
  color: 'var(--theme-error-page-color)',
  backgroundColor: 'var(--theme-error-page-background-color)',
  fontSize: '120%',
  overflowY: 'auto',
});

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    if (this.props.hidden) {
      return null;
    }

    const code = Math.abs(this.props.pageState.code);
    const isCertError = (
      code === 501 || // ERR_CERT_AUTHORITY_INVALID
      code === 129 || // ERR_SSL_WEAK_SERVER_EPHEMERAL_DH_KEY
      /CERT/.test(this.props.pageState.description) // Catch all
    );

    return (
      <div className={`error-page-${this.props.pageId} ${ERROR_PAGE_STYLE}`}>
        {isCertError
          ? <CertErrorPage url={this.props.pageLocation}
            code={this.props.pageState.code}
            description={this.props.pageState.description}
            certificate={this.props.pageState.certificate} />
          : <NetErrorPage url={this.props.pageLocation}
            code={this.props.pageState.code}
            description={this.props.pageState.description} />
        }
      </div>
    );
  }
}

ErrorPage.displayName = 'ErrorPage';

ErrorPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  pageId: PropTypes.string.isRequired,
  pageLocation: PropTypes.string.isRequired,
  pageState: SharedPropTypes.PageState.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageLocation: page ? page.location : '',
    pageState: page ? page.state : {},
  };
}

export default connect(mapStateToProps)(ErrorPage);
