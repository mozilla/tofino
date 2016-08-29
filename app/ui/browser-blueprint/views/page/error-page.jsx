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

import NetErrorPage from './net-error';
import CertErrorPage from './cert-error';
import Style from '../../../shared/style';

const ERROR_PAGE_STYLE = Style.registerStyle({
  width: '100%',
  height: '100%',
  position: 'absolute',
  color: 'rgb(66, 78, 90)',
  backgroundColor: '#FBFBFB',
  fontSize: '120%',
  overflowY: 'auto',
});

class ErrorPage extends Component {
  render() {
    const code = Math.abs(this.props.code);
    const isCertError = code === 501 || // ERR_CERT_AUTHORITY_INVALID
                        code === 129 || // ERR_SSL_WEAK_SERVER_EPHEMERAL_DH_KEY
                        /CERT/.test(this.props.description); // Catch all
    const page = isCertError
      ? <CertErrorPage {...this.props} />
      : <NetErrorPage {...this.props} />;

    return (
      <div className={`error-page ${ERROR_PAGE_STYLE}`}
        hidden={this.props.hidden}>
        {page}
      </div>
    );
  }
}

ErrorPage.displayName = 'ErrorPage';

ErrorPage.propTypes = {
  url: PropTypes.string,
  code: PropTypes.number,
  description: PropTypes.string,
  certificate: PropTypes.object,
  hidden: PropTypes.bool,
};

export default ErrorPage;
