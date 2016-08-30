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

import * as SharedPropTypes from '../../../model/shared-prop-types';
import BaseCard from './base-card';
import SimpleSummary from '../summaries/simple-summary';

const SimpleCard = function(props) {
  const meta = props.page.meta;

  const title = meta.title || props.page.title;

  return (
    <BaseCard {...props}>
      <SimpleSummary title={title}
        url={props.page.location} />
    </BaseCard>
  );
};

SimpleCard.displayName = 'SimpleCard';

SimpleCard.propTypes = {
  page: SharedPropTypes.Page.isRequired,
  pageIndex: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SimpleCard;
