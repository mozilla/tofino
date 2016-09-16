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
import { connect } from 'react-redux';

import * as UIConstants from '../../constants/ui';
import Style from '../../../shared/style';
import Btn from '../../../shared/widgets/btn';
import FittedImage from '../../../shared/widgets/fitted-image';
import VerticalSeparator from '../../../shared/widgets/vertical-separator';

import { Page } from '../../model';
import * as selectors from '../../selectors';

const TAB_STYLE = Style.registerStyle({
  overflow: 'hidden',
  WebkitUserSelect: 'none',
  WebkitAppRegion: 'no-drag',
});

const TAB_CONTENTS_STYLE = Style.registerStyle({
  alignItems: 'center',
  overflow: 'hidden',
  width: `${UIConstants.TAB_DEFAULT_WIDTH}vw`,
  padding: '0 8px',
  backgroundColor: 'var(--theme-tab-inactive-background)',
  color: 'var(--theme-tab-inactive-color)',
  opacity: 'var(--theme-tab-inactive-opacity)',
  '&.active-tab': {
    backgroundColor: 'var(--theme-tab-background)',
    backgroundImage: 'url(assets/chrome-background.png)',
    backgroundSize: 'var(--theme-window-image-tile-size)',
    backgroundAttachment: 'fixed',
    color: 'var(--theme-tab-color)',
    opacity: 'var(--theme-tab-opacity)',
  },
});

const TAB_TITLE_STYLE = Style.registerStyle({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const FAVICON_STYLE = Style.registerStyle({
  marginRight: '5px',
});

/**
 * Tab is an element on the TabBar at the top of a browser window which shows
 * one of the opened tabs. The web page contained within the tab may not be
 * visible
 */
export const Tab = function(props) {
  const modes = [
    ...(props.isActive ? ['active-tab'] : []),
  ].join(' ');

  return (
    <div className={`tab ${TAB_STYLE}`}
      onContextMenu={props.onContextMenu}
      onClick={props.onClick}>
      <VerticalSeparator style={{
        opacity: props.isActive || props.isAfterActive || (
          props.isFirst && props.pageSumariesVisible) ? 0 : 1,
      }} />
      <div className={`${TAB_CONTENTS_STYLE} ${modes}`}>
        {props.page.meta.icon_url
          ? <FittedImage className={FAVICON_STYLE}
            src={props.page.meta.icon_url}
            width="16px"
            height="16px"
            mode="contain" />
          : (<div />)
        }
        <span className={TAB_TITLE_STYLE}>
          {props.page.state === Page.PAGE_STATE_LOADING
            ? 'Loading...'
            : props.page.title
          }
        </span>
        <span>
          {props.page.state === Page.PAGE_STATE_LOADING
            ? <i className="fa fa-spinner fa-pulse" />
            : null
          }
        </span>
        <Btn className="tab-close"
          title="Close tab"
          image="glyph-addnew.svg"
          imgWidth="8px"
          imgHeight="8px"
          imgPosition="center"
          style={{ transform: 'rotate(45deg)' }}
          onClick={props.onClose} />
      </div>
      <VerticalSeparator style={{
        opacity: props.isActive || !props.isLast ? 0 : 1,
      }} />
    </div>
  );
};

Tab.displayName = 'Tab';

Tab.propTypes = {
  pageSumariesVisible: PropTypes.bool.isRequired,
  page: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isAfterActive: PropTypes.bool.isRequired,
  isBeforeActive: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    pageSumariesVisible: selectors.getShowPageSummaries(state),
  };
}

export default connect(mapStateToProps)(Tab);
