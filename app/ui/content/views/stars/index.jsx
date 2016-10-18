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
import { connect } from 'react-redux';

import Style from '../../../shared/style';
import StarItem from './star-item';
import List from '../../../shared/widgets/list';
import * as ContentPropTypes from '../../model/content-prop-types';
import * as MainEffects from '../../actions/main-effects';
import * as Selectors from '../../selectors';

const STARS_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'auto',
  padding: '20px 10%',
});

class Stars extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(MainEffects.fetchStars({ limit: 1000 }));
  }

  render() {
    return (
      <List className={STARS_STYLE}>
        {this.props.items.map(star => (
          <StarItem key={`star-item-${star.location}`}
            star={star} />
        ))}
      </List>
    );
  }
}

Stars.displayName = 'Stars';

Stars.propTypes = {
  dispatch: PropTypes.func.isRequired,
  items: ContentPropTypes.StarredItems.isRequired,
};

function mapStateToProps(state) {
  return {
    items: Selectors.getStarredItems(state),
  };
}

export default connect(mapStateToProps)(Stars);
