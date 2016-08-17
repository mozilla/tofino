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

import Style from '../../../shared/style';

const CONTAINER_STYLE = Style.registerStyle({
  width: '700px',
  margin: '0 auto',
  display: 'block',
});

const CERTIFICATE_STYLE = Style.registerStyle({
  backgroundColor: '#ddd',
  fontWeight: 'bold',
  display: 'block',
  padding: '15px',
});

class CertErrorPage extends Component {
  render() {
    const certElements = [];
    const cert = this.props.certificate;
    const certData = cert ? cert.data.toString('ascii') : null;

    // See all properties `certificate` may have here
    // http://electron.atom.io/docs/api/app/#event-certificate-error
    if (cert && cert.issuerName) {
      certElements.push(<li>Issuer's Common Name: {cert.issuerName}</li>);
    }
    if (cert && cert.subjectName) {
      certElements.push(<li>Subject's Common Name: {cert.subjectName}</li>);
    }
    if (cert && cert.serialNumber) {
      certElements.push(<li>Serial Number: {cert.serialNumber}</li>);
    }
    if (cert && cert.validStart) {
      certElements.push(<li>Start time validity: {cert.validStart}</li>);
    }
    if (cert && cert.validExpiry) {
      certElements.push(<li>Expires: {cert.validExpiry}</li>);
    }
    if (cert && cert.fingerprint) {
      certElements.push(<li>Fingerprint: {cert.fingerprint}</li>);
    }

    return (
      <div className={CONTAINER_STYLE}>
        <h1>Your connection is not secure</h1>
        <p>
          The owner of <strong>{this.props.url}</strong> has configured
          their website improperly. To protect your information from being stolen,
          Tofino has not connected to this website.
        </p>
        <ul>
          <li>{this.props.description} ({this.props.code})</li>
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
  url: PropTypes.string,
  code: PropTypes.number,
  description: PropTypes.string,
  certificate: PropTypes.object,
};

export default CertErrorPage;
