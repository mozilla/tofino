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

import BaseCard from './base-card';
import SimpleSummary from '../summaries/simple-summary';

class SimpleCard extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const meta = this.props.page.meta;
    const title = meta.title || this.props.page.title;

    return (
      <BaseCard {...this.props}>
        <SimpleSummary title={title}
          url={this.props.page.location} />
      </BaseCard>
    );
  }
}

SimpleCard.displayName = 'SimpleCard';

SimpleCard.propTypes = {
  page: PropTypes.object.isRequired,
};

export default SimpleCard;
