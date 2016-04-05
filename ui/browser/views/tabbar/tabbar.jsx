
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
