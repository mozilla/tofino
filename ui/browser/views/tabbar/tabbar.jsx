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
import Tab from './tab.jsx';
import { menuTabContext } from '../../actions/external';
import { createTab, closeTab, setCurrentTab } from '../../actions/main-actions';
import { TabBarDragDrop, TabDragDrop } from './dragdrop';

/**
 * The TabBar runs across the top of each browser window, containing the
 * window management buttons, and browser tabs
 */
const TabBar = ({ pageOrder, pages, currentPageIndex, dispatch }) => {
  const barDragDrop = new TabBarDragDrop(pages, pageOrder, dispatch);

  return (
    <div id="browser-tabs" dragzone="copy string:test/uri-list"
      {...barDragDrop.handlers}>

      {pageOrder.map((i) => {
        const page = pages.get(i);
        const dragDrop = new TabDragDrop(page, pageOrder, i);

        return (
          <Tab key={`browser-tab-${i}`} className={`browser-tab-${i}`}
            isActive={currentPageIndex === i}
            page={page}
            onClick={() => dispatch(setCurrentTab(i))}
            onContextMenu={() => menuTabContext(i, dispatch)}
            onClose={e => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(closeTab(i));
            }}
            {...dragDrop.handlers} />
        );
      })}

      <a className="newtab" onClick={() => dispatch(createTab())}>
        <i className="fa fa-plus" />
      </a>
    </div>
  );
};

TabBar.propTypes = {
  pageOrder: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(TabBar);
