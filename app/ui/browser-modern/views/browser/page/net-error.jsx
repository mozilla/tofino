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

class NetErrorPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div className={CONTAINER_STYLE}>
        <h1>Could not connect</h1>
        <p>Tofino can't find the server at {this.props.url}</p>
        <ul>
          <li>
            Check the address for typing errors such as ww.example.com
            instead of www.example.com
          </li>
          <li>If you are unable to load any pages, check your computer’s network connection.</li>
          <li>
            If your computer or network is protected by a firewall or proxy,
            make sure that Tofino is permitted to access the Web.
          </li>
          <li>{this.props.pageState.get('description')} ({this.props.pageState.get('code')})</li>
        </ul>
      </div>
    );
  }
}

NetErrorPage.displayName = 'NetErrorPage';

NetErrorPage.propTypes = {
  url: PropTypes.string.isRequired,
  pageState: SharedPropTypes.PageState.isRequired,
};

export default NetErrorPage;
