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

import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import History from './history';
import Stars from './stars';
import NoMatch from './errors/nomatch';

const VALID_COMPONENTS = {
  history: History,
  stars: Stars,
};

class Routes extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    // TODO: We'd like to use `react-router` here, but can't yet because of
    // custom schemes, which aren't yet supported by the `history` library.
    // See https://github.com/ReactJSTraining/history/issues/311
    const page = document.location.hostname;
    if (page in VALID_COMPONENTS) {
      const Subpage = VALID_COMPONENTS[page];
      return <Subpage />;
    }
    return <NoMatch />;
  }
}

Routes.displayName = 'Routes';

export default Routes;
