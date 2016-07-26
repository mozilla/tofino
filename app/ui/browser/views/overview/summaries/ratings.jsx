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

import React, { PropTypes } from 'react';

import Style from '../../../../shared/style';
import Btn from '../../../../shared/widgets/btn';

const STAR_IMAGES = {
  full: 'glyph-ratings-full-16.svg',
  half: 'glyph-ratings-half-16.svg',
  empty: 'glyph-ratings-empty-16.svg',
};

const CONTAINER_STYLE = Style.registerStyle({
  flexShrink: 0,
});

const STAR_STYLE = Style.registerStyle({
});

function Star({ index, title, type }) {
  const image = STAR_IMAGES[type];
  return (<Btn title={title}
    key={index}
    className={STAR_STYLE}
    image={image}
    imgWidth="16px"
    imgHeight="16px"
    disabled={false}
    onClick={() => {}} />);
}

Star.displayName = 'Star';

Star.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const Ratings = function(props) {
  // Sanity checks
  if (props.minRating >= props.maxRating ||
      props.rating < props.minRating ||
      props.rating > props.maxRating) {
    return (<div />);
  }

  // Since the default for these values are 1 and 5, use the rating as the pure star value,
  // otherwise normalize it as you would. This is a bit weird, since "1" is the lower default
  // rating, so properly normalizing 3 of 5 stars, where 1 is the minimum, traditional normalization
  // would give us 2.5 stars as the half way point. This is some magic to make things
  // Close To Being Nice.
  const starRating = props.minRating === 1 && props.maxRating === 5 ? props.rating :
                     (props.rating - props.minRating / props.maxRating - props.minRating);
  // This doesn't take into account min rating, but I don't think there are common cases
  // where the min isn't 0 or 1.
  const title = `${starRating} of ${props.maxRating} rating`;

  const stars = new Array(5).fill(0).map((_, i) => {
    const starNumber = i + 1;
    if (starRating >= starNumber) {
      return new Star({ title, type: 'full', key: i });
    }
    if (starRating > (starNumber - 1)) {
      return new Star({ title, type: 'half', key: i });
    }
    return new Star({ title, type: 'empty', key: i });
  });

  return (
    <div className={CONTAINER_STYLE}>
      {stars}
    </div>
  );
};

Ratings.displayName = 'Ratings';

Ratings.propTypes = {
  rating: PropTypes.number.isRequired,
  maxRating: PropTypes.number.isRequired,
  minRating: PropTypes.number.isRequired,
};

export default Ratings;
