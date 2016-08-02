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
import ProductSummary from '../summaries/product-summary';

const DEFAULT_MAX_RATING = 5;
const DEFAULT_MIN_RATING = 1;

/**
 * Takes a Page's meta object and determines how to format
 * the price of a product on page.
 */
function getPrice(meta) {
  if (meta.currency && meta.price) {
    const formatted = (new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: meta.currency,
    })).format(meta.price);

    // It's possible for `price` to already include the currency symbol,
    // like "$30.00", in which case, formatting it returns NaN; just return
    // the price in that case, or for whatever other reason the value is
    // improperly formatted.

    // Number.isNaN doesn't work, but NaN does, since NumberFormat returns
    // A STRING VERSION OF "NaN" IF IT FAILS. AHHHHHHHHHHH.
    // And apparently `isNaN("$34.00") === true` so let's just use
    // a string comparison because we can't have nice things.
    return formatted === 'NaN' ? meta.price : formatted;
  } else if (meta.price) {
    return meta.price;
  }
  return undefined;
}

const ProductCard = function(props) {
  const meta = props.page.meta;

  const title = meta.title || props.page.title;

  const price = getPrice(meta);
  const reviewCount = parseInt(meta.review_count, 10);
  const rating = parseFloat(meta.rating, 10) || null;
  const maxRating = parseInt(meta.best_rating || DEFAULT_MAX_RATING, 10) || null;
  const minRating = parseInt(meta.worst_rating || DEFAULT_MIN_RATING, 10) || null;

  return (
    <BaseCard {...props}>
      <ProductSummary title={title}
        price={price}
        reviewCount={reviewCount}
        rating={rating}
        maxRating={maxRating}
        minRating={minRating} />
    </BaseCard>
  );
};

ProductCard.displayName = 'ProductCard';

ProductCard.propTypes = {
  page: SharedPropTypes.Page.isRequired,
  pageIndex: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProductCard;
