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

import * as SharedPropTypes from '../../../../shared/model/shared-prop-types';
import BaseCard from './base-card';
import ReviewableSummary from '../summaries/reviewable-summary';

const DEFAULT_MAX_RATING = 5;
const DEFAULT_MIN_RATING = 1;

const ReviewableCard = function(props) {
  const meta = props.page.meta;

  const title = meta.title || props.page.title;

  const reviewCount = parseInt(meta.review_count, 10);
  const rating = parseFloat(meta.rating, 10) || null;
  const maxRating = parseInt(meta.best_rating || DEFAULT_MAX_RATING, 10) || null;
  const minRating = parseInt(meta.worst_rating || DEFAULT_MIN_RATING, 10) || null;

  return (
    <BaseCard {...props}>
      <ReviewableSummary title={title}
        reviewCount={reviewCount}
        rating={rating}
        maxRating={maxRating}
        minRating={minRating} />
    </BaseCard>
  );
};

ReviewableCard.displayName = 'ReviewableCard';

ReviewableCard.propTypes = {
  page: SharedPropTypes.Page.isRequired,
  pageIndex: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ReviewableCard;
