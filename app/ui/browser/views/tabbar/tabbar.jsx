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
import Style from '../../browser-style';
import Tab from './tab';
import Btn from '../../widgets/btn';

const TABBAR_STYLE = Style.registerStyle({
  minHeight: `${UIConstants.TABBAR_HEIGHT}px`,
  background: 'var(--theme-tabbar-color)',
});

const NEW_TAB_BUTTON_STYLE = Style.registerStyle({
  color: 'var(--theme-content-color)',
});

const TabBar = ({
  pages, currentPageIndex,
  handleTabContextMenu, handleNewTabClick, handleTabClick, handleTabClose,
}) => (
  <div id="browser-tabbar"
    className={TABBAR_STYLE}>
    {pages.map((page, i) => (
      <Tab key={`browser-tab-${i}`}
        className={`browser-tab-${i}`}
        isActive={currentPageIndex === i}
        page={page}
        onClick={handleTabClick(page.id)}
        onContextMenu={handleTabContextMenu(page.id)}
        onClose={handleTabClose(page.id)} />
      )
    )}
    <Btn id="new-tab"
      className={NEW_TAB_BUTTON_STYLE}
      title="Add new tab"
      image="glyph-addNew-24.svg"
      imgWidth="10px"
      imgHeight="10px"
      imgPosition="center"
      minWidth={`${UIConstants.TABBAR_HEIGHT}px`}
      onClick={handleNewTabClick} />
  </div>
);

TabBar.displayName = 'TabBar';

TabBar.propTypes = {
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  handleTabClose: PropTypes.func.isRequired,
  handleNewTabClick: PropTypes.func.isRequired,
  handleTabContextMenu: PropTypes.func.isRequired,
};

export default TabBar;
