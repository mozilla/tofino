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

import Style from '../../../../shared/style';
import Star from './star';

const CONTAINER_STYLE = Style.registerStyle({
  flexShrink: 0,
});

class Ratings extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    // Sanity checks
    if (this.props.minRating >= this.props.maxRating ||
        this.props.rating < this.props.minRating ||
        this.props.rating > this.props.maxRating) {
      return (<div />);
    }

    // Since the default for these values are 1 and 5, use the rating as the
    // pure star value, otherwise normalize it as you would. This is a bit weird,
    // since "1" is the lower default rating, so properly normalizing 3 of 5 stars,
    // where 1 is the minimum, traditional normalization would give us 2.5 stars as
    // the half way point. This is some magic to make things Close To Being Nice.
    const starRating = this.props.minRating === 1 && this.props.maxRating === 5
      ? this.props.rating
      : this.props.rating - (this.props.minRating / this.props.maxRating) - this.props.minRating;

    // This doesn't take into account min rating, but I don't think there are
    // common cases where the min isn't 0 or 1.
    const title = `${starRating} of ${this.props.maxRating} rating`;

    return (
      <div className={CONTAINER_STYLE}>
        {Array(5).fill().map((_, i) => {
          const starNumber = i + 1;
          if (starRating >= starNumber) {
            return (
              <Star title={title}
                type="full"
                key={i} />
            );
          }
          if (starRating > (starNumber - 1)) {
            return (
              <Star title={title}
                type="half"
                key={i} />
            );
          }
          return (
            <Star title={title}
              type="empty"
              key={i} />
          );
        })}
      </div>
    );
  }
}

Ratings.displayName = 'Ratings';

Ratings.propTypes = {
  rating: PropTypes.number.isRequired,
  maxRating: PropTypes.number.isRequired,
  minRating: PropTypes.number.isRequired,
};

export default Ratings;
