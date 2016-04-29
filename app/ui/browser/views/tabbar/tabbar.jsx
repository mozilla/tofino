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

import Style from '../../browser-style';
import Tab from './tab';
import Btn from '../navbar/btn';

const TABBAR_STYLE = Style.registerStyle({
  alignItems: 'center',
  minHeight: '25px',
  background: '#fff',
  borderBottom: '1px solid #fff',
  opacity: 0.9,
});

const NEW_TAB_BUTTON_STYLE = Style.registerStyle({
  marginLeft: '8px',
  color: '#555',
});

const TabBar = ({
  pages, currentPageIndex, pageAreaVisible,
  handleTabContextMenu, handleNewTabClick, handleTabClick, handleTabClose,
}) => {
  // This is the 'pages' section, which can be collapsed
  if (!pageAreaVisible) {
    return null;
  }

  return (
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

      <Btn className={NEW_TAB_BUTTON_STYLE}
        title="Add new tab"
        clickHandler={handleNewTabClick}>
        <i className="fa fa-plus" />
      </Btn>
    </div>
  );
};

TabBar.displayName = 'TabBar';

TabBar.propTypes = {
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  handleTabClose: PropTypes.func.isRequired,
  handleNewTabClick: PropTypes.func.isRequired,
  handleTabContextMenu: PropTypes.func.isRequired,
  pageAreaVisible: PropTypes.bool.isRequired,
};

export default TabBar;
