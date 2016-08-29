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

class NetErrorPage extends Component {
  render() {
    return (
      <div className={CONTAINER_STYLE}>
        <h1>Could not connect</h1>
        <p>Tofino can't find the server at <strong>{this.props.url}</strong></p>
        <ul>
          <li>
            Check the address for typing errors such as <strong>ww</strong>.example.com
            instead of <strong>www</strong>.example.com
          </li>
          <li>If you are unable to load any pages, check your computer’s network connection.</li>
          <li>
            If your computer or network is protected by a firewall or proxy,
            make sure that Tofino is permitted to access the Web.
          </li>
          <li>{this.props.description} ({this.props.code})</li>
        </ul>
      </div>
    );
  }
}

NetErrorPage.displayName = 'NetErrorPage';

NetErrorPage.propTypes = {
  url: PropTypes.string,
  code: PropTypes.number,
  description: PropTypes.string,
};

export default NetErrorPage;
