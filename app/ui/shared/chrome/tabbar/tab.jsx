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

import * as UIConstants from '../../constants/ui';
import { Page } from '../../model/browser';
import Style from '../../../shared/style';
import Btn from '../../../shared/widgets/btn';

const TAB_STYLE = Style.registerStyle({
  alignItems: 'center',
  overflow: 'hidden',
  width: `${UIConstants.TAB_DEFAULT_WIDTH}vw`,
  border: '1px solid var(--theme-tab-border-color)',
  borderTopWidth: 0,
  borderBottomWidth: 0,
  marginLeft: '-1px',
  padding: '0 8px',
  backgroundColor: 'var(--theme-tab-inactive-background)',
  color: 'var(--theme-tab-inactive-color)',
  opacity: 'var(--theme-tab-inactive-opacity)',
  '&.active': {
    backgroundColor: 'var(--theme-tab-background)',
    color: 'var(--theme-tab-color)',
    opacity: 'var(--theme-tab-opacity)',
  },
  cursor: 'default',
});

const TAB_TITLE_STYLE = Style.registerStyle({
  flex: '1',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const TAB_CLOSE_BUTTON_STYLE = Style.registerStyle({
  color: 'var(--theme-content-color)',
});

/**
 * Tab is an element on the TabBar at the top of a browser window which shows
 * one of the opened tabs. The web page contained within the tab may not be
 * visible
 */
function Tab(props) {
  const {
    page, isActive, onClose, onClick, onContextMenu,
  } = props;

  const modes = [
    ...(isActive ? ['active'] : []),
  ];

  return (
    <div className={`tab ${TAB_STYLE} ${modes.join(' ')}`}
      {...{ onClick, onContextMenu }}>
      <span className={TAB_TITLE_STYLE}>
        {page.state === Page.PAGE_STATE_LOADING ? 'Loading...' : page.title}
      </span>
      <span>
        {page.state === Page.PAGE_STATE_LOADING ? <i className="fa fa-spinner fa-pulse" /> : null}
      </span>
      <Btn className={`tab-close ${TAB_CLOSE_BUTTON_STYLE}`}
        title="Close tab"
        onClick={onClose}>
        <i className="fa fa-close" />
      </Btn>
    </div>
  );
}

Tab.displayName = 'Tab';

Tab.propTypes = {
  page: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
};

export default Tab;
