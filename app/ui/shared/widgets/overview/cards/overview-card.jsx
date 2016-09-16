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

/**
 * A factory class used to instantiate Cards displayed in the overview.
 * Calls the appropriate underlying card subclass, depending on metadata.
 */
import SimpleCard from './simple-card';
import ProductCard from './product-card';

class OverviewCard extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const meta = this.props.page.meta;

    if (meta.rating || meta.price) {
      return (<ProductCard {...this.props} />);
    }

    return (<SimpleCard {...this.props} />);
  }
}

OverviewCard.displayName = 'OverviewCard';

OverviewCard.propTypes = {
  // FIXME: Don't use object prop types for this component.
  page: PropTypes.object.isRequired, // eslint-disable-line
};

export default OverviewCard;
