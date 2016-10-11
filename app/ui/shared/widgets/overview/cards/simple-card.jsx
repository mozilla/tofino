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
import { prettyUrl } from '../../../util/url-util';

class SimpleCard extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const meta = this.props.page.meta;
    const title = meta.title || this.props.page.title;
    const url = prettyUrl(this.props.page.location);

    return (
      <BaseCard {...this.props}>
        <SimpleSummary title={title}
          url={url} />
      </BaseCard>
    );
  }
}

SimpleCard.displayName = 'SimpleCard';

SimpleCard.propTypes = {
  // FIXME: Don't use object prop types for this component.
  page: PropTypes.object.isRequired, // eslint-disable-line
};

export default SimpleCard;
