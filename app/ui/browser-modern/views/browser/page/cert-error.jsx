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
import * as SharedPropTypes from '../../../model/shared-prop-types';

import Style from '../../../../shared/style';

const CONTAINER_STYLE = Style.registerStyle({
  width: '40%',
  margin: '0 auto',
  display: 'block',
});

const CERTIFICATE_STYLE = Style.registerStyle({
  backgroundColor: 'var(--theme-error-page-cert-background-color)',
  fontWeight: 'bold',
  display: 'block',
  padding: '15px',
});

class CertErrorPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const certElements = [];
    const cert = this.props.pageState.get('certificate');
    const certData = cert && cert.get('data') ? cert.get('data').toString('ascii') : null;

    // See all properties `certificate` may have here
    // http://electron.atom.io/docs/api/app/#event-certificate-error
    if (cert && cert.issuerName) {
      certElements.push(<li key="issuer">Issuer's Common Name: {cert.issuerName}</li>);
    }
    if (cert && cert.subjectName) {
      certElements.push(<li key="subject">Subject's Common Name: {cert.subjectName}</li>);
    }
    if (cert && cert.serialNumber) {
      certElements.push(<li key="serial">Serial Number: {cert.serialNumber}</li>);
    }
    if (cert && cert.validStart) {
      certElements.push(<li key="valid-start">Start time validity: {cert.validStart}</li>);
    }
    if (cert && cert.validExpiry) {
      certElements.push(<li key="valid-expiry">Expires: {cert.validExpiry}</li>);
    }
    if (cert && cert.fingerprint) {
      certElements.push(<li key="fingerprint">Fingerprint: {cert.fingerprint}</li>);
    }

    return (
      <div className={CONTAINER_STYLE}>
        <h1>Your connection is not secure</h1>
        <p>
          The owner of {this.props.url} has configured
          their website improperly. To protect your information from being stolen,
          Tofino has not connected to this website.
        </p>
        <ul>
          <li>{this.props.pageState.get('description')} ({this.props.pageState.get('code')})</li>
        </ul>
        <ul className="certificate">
          {certElements}
        </ul>
        <div className={CERTIFICATE_STYLE}>
          <code>
            {certData}
          </code>
        </div>
      </div>
    );
  }
}

CertErrorPage.displayName = 'CertErrorPage';

CertErrorPage.propTypes = {
  url: PropTypes.string.isRequired,
  pageState: SharedPropTypes.PageState.isRequired,
};

export default CertErrorPage;
