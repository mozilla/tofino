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

import Style from '../../../shared/style';

import * as ContentPropTypes from '../../model/content-prop-types';
import ListItem from '../../../shared/widgets/list-item';

const STAR_ITEM_STYLE = Style.registerStyle({
  '&:nth-child(odd)': {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  '&:nth-child(even)': {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
});

const STAR_ANCHOR_STYLE = Style.registerStyle({
  display: 'block',
  padding: '6px 8px',
  textDecoration: 'none',
  color: 'rgba(0,0,0,0.9)',
});

class StarItem extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <ListItem className={STAR_ITEM_STYLE}>
        <a className={STAR_ANCHOR_STYLE}
          href={this.props.star.location || ''}
          title={this.props.star.title || this.props.star.location}>
          {this.props.star.title || this.props.star.location}
        </a>
      </ListItem>
    );
  }
}

StarItem.displayName = 'StarItem';

StarItem.propTypes = {
  star: ContentPropTypes.StarredItem.isRequired,
};

export default StarItem;
