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

import Style from '../../../style';
import Thumbnail from '../../thumbnail';
import FittedImage from '../../fitted-image';

import * as Endpoints from '../../../../../shared/constants/endpoints';

const TOFINO_LOGO = 'assets/logo-tofino.png';

const CARD_STYLE_NORMAL = {
  boxShadow: `
    var(--theme-default-shadow),
    var(--theme-content-border-color) 0 0 0 1px inset`,
};

const CARD_STYLE_ACTIVE = {
  boxShadow: `
    var(--theme-default-selected-shadow),
    var(--theme-content-selected-border-color) 0 0 0 1px inset`,
};

const CARD_STYLE = Style.registerStyle({
  WebkitUserSelect: 'none',
  overflow: 'hidden',
  position: 'relative',
  margin: '20px',
  border: 'none',
  cursor: 'pointer',
  ...CARD_STYLE_NORMAL,
  '&:hover, &[data-selected="true"]': CARD_STYLE_ACTIVE,
});

const BADGE_STYLE = Style.registerStyle({
  position: 'absolute',
  zIndex: -1,
});

const BACKGROUND_STYLE = Style.registerStyle({
  WebkitFilter: 'blur(30px) saturate(2)',
  backgroundSize: '100% auto',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: -2,
});

const SUMMARY_STYLE = Style.registerStyle({
  background: 'var(--theme-overview-summary-background)',
  position: 'absolute',
  top: '50%',
  bottom: 0,
  left: 0,
  right: 0,
  margin: '1px',
  padding: '5px',
  paddingTop: '15px',
});

const BaseCard = props => {
  let backgroundImage;
  let badgeImage;

  if (props.page.location.startsWith(Endpoints.TOFINO_PROTOCOL)) {
    badgeImage = TOFINO_LOGO;
  } else {
    backgroundImage = props.backgroundImage || props.page.meta.image_url;
    badgeImage = props.badgeImage || props.page.meta.icon_url;
  }

  return (
    <Thumbnail className={CARD_STYLE}
      data-selected={props.isSelected}
      src={backgroundImage}
      imgWidth={`${props.width}px`}
      imgHeight={`${props.height}px`}
      imgMode="100% auto"
      imgPosition="top center"
      onClick={() => props.onClick(props.page.id)}>
      <FittedImage className={BADGE_STYLE}
        style={backgroundImage ? {
          top: 0,
          left: 0,
        } : {
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        src={badgeImage}
        width={backgroundImage
          ? `${props.badgeWidth}px`
          : `${props.badgeLargeWidth}px`}
        height={backgroundImage
          ? `${props.badgeHeight}px`
          : `${props.badgeLargeHeight}px`}
        mode="contain" />
      <div className={BACKGROUND_STYLE}
        style={{
          backgroundImage: `url(${backgroundImage || badgeImage})`,
        }} />
      <div className={SUMMARY_STYLE}>
        {props.children}
      </div>
    </Thumbnail>
  );
};

BaseCard.displayName = 'BaseCard';

BaseCard.propTypes = {
  page: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  badgeWidth: PropTypes.number.isRequired,
  badgeHeight: PropTypes.number.isRequired,
  badgeLargeWidth: PropTypes.number.isRequired,
  badgeLargeHeight: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string,
  backgroundImage: PropTypes.string,
  badgeImage: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func.isRequired,
};

export default BaseCard;
