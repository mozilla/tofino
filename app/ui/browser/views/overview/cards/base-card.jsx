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
import * as UIConstants from '../../../constants/ui';
import Style from '../../../../shared/style';
import Thumbnail from '../../../../shared/widgets/thumbnail';

const CARD_STYLE = Style.registerStyle({
  WebkitUserSelect: 'none',
  position: 'relative',
  margin: '20px',
  cursor: 'pointer',
});

const SUMMARY_STYLE = Style.registerStyle({
  background: 'var(--theme-overview-summary-background)',
  position: 'absolute',
  top: '50%',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '5px',
  paddingTop: '15px',
});

const BaseCard = function(props) {
  return (
    <Thumbnail className={CARD_STYLE}
      style={{
        backgroundColor: props.backgroundColor,
        borderColor: props.isSelected
          ? 'var(--theme-content-selected-border-color)'
          : 'var(--theme-content-border-color)',
        boxShadow: props.isSelected
          ? 'var(--theme-default-selected-shadow)'
          : 'var(--theme-default-shadow)',
      }}
      src={props.backgroundImage}
      imgWidth={`${UIConstants.CARD_WIDTH}px`}
      imgHeight={`${UIConstants.CARD_HEIGHT}px`}
      imgMode="contain"
      imgPosition="top center"
      onClick={() => props.onClick(props.page.id)}>
      <div className={SUMMARY_STYLE}>
        {props.children}
      </div>
    </Thumbnail>
  );
};

BaseCard.displayName = 'BaseCard';

BaseCard.propTypes = {
  page: SharedPropTypes.Page.isRequired,
  isSelected: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func.isRequired,
};

export default BaseCard;
