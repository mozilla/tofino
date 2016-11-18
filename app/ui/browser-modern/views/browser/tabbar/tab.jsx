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

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';

import Style from '../../../../shared/style';
import TabPointerArea from './tab-pointer-area';
import TabVisuals from './tab-visuals';
import TabContents from './tab-contents';

import * as UIConstants from '../../../constants/ui';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as PageActions from '../../../actions/page-actions';
import * as PageEffects from '../../../actions/page-effects';

const DRAG_DROP_TYPE = 'TAB';

const TAB_STYLE = Style.registerStyle({
  // Due to its visual elements, this component's bounds are much larger than
  // the area we want to be clickable. Since it can overlap other interactive
  // components, restrict the pointer events only to relevant children.
  pointerEvents: 'none',
  position: 'relative',
  alignItems: 'center',
  overflow: 'hidden',
  boxSizing: 'border-box',
  width: `${UIConstants.TAB_MIN_WIDTH}px`,
  minWidth: `${UIConstants.TAB_MIN_WIDTH}px`,
  height: `${UIConstants.TAB_HEIGHT}px`,
  margin: `0 -${UIConstants.TAB_OVERLAP}px`,
  padding: '0 24px',
  backgroundImage: 'var(--theme-window-background)',
  backgroundColor: 'var(--theme-tab-inactive-background)',
  color: 'var(--theme-tab-inactive-color)',
  textShadow: '0 1px var(--theme-tab-inactive-text-shadow)',
  opacity: 'var(--theme-tab-inactive-opacity)',
  '&[data-active-tab=true]': {
    backgroundColor: 'var(--theme-tab-active-background)',
    color: 'var(--theme-tab-active-color)',
    textShadow: '0 1px var(--theme-tab-active-text-shadow)',
    opacity: 'var(--theme-tab-active-opacity)',
    // Make sure this is displayed above other sibling tabs.
    zIndex: 1,
  },
  '&[data-pinned-tab=true]': {
    flexShrink: 0,
    width: `${UIConstants.TAB_PINNED_WIDTH}px`,
  },
  '&[data-mounted=true][data-pinned-tab=false]': {
    transition: 'width 0.2s ease-out',
    width: `${UIConstants.TAB_DEFAULT_WIDTH}px`,
  },
});

class Tab extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.scrollIntoViewIfNeeded();
    this.setState({ mounted: true }); // eslint-disable-line
  }

  componentDidUpdate() {
    this.scrollIntoViewIfNeeded();
  }

  scrollIntoViewIfNeeded() {
    if (this.props.isActive) {
      this.root.scrollIntoViewIfNeeded();
    }
  }

  handleTabPick = e => {
    if (e.button === 1) {
      this.props.dispatch(PageEffects.destroyPageSession({ id: this.props.pageId }));
    } else {
      this.props.dispatch(PageActions.setSelectedPage(this.props.pageId));
    }
  }

  handleTabDoubleClick = () => {
    if (!this.props.isPinned) {
      this.props.dispatch(PageEffects.setPagePinned(this.props.pageId));
    } else {
      this.props.dispatch(PageEffects.setPageUnpinned(this.props.pageId));
    }
  }

  render() {
    const {
      connectDropTarget = _ => _,
      connectDragSource = _ => _,
    } = this.props;
    return connectDropTarget(connectDragSource(
      <div className={`browser-tab ${TAB_STYLE}`}
        ref={e => this.root = e}
        data-mounted={this.state.mounted}
        data-pinned-tab={this.props.isPinned}
        data-active-tab={this.props.isActive}
        data-before-active-tab={this.props.isBeforeActive}
        data-after-active-tab={this.props.isAfterActive}>
        <TabContents pageId={this.props.pageId} />
        <TabPointerArea pageId={this.props.pageId}
          onMouseDown={this.handleTabPick}
          onDoubleClick={this.handleTabDoubleClick} />
        <TabVisuals />
      </div>
    ));
  }
}

Tab.displayName = 'Tab';

Tab.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  isPinned: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isBeforeActive: PropTypes.bool.isRequired,
  isAfterActive: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func,
  connectDragSource: PropTypes.func,
};

// react-dnd integration:
// Don't handle 'drop' events, we simply change tab ordering when a drag
// enters another tab (the `hover` callback).
// We can set the page index of the tab being dragged, and the reducer
// will handle resetting all of the other page indices appropriately.
function dropProperties(connector) {
  return {
    connectDropTarget: connector.dropTarget(),
  };
}

function dragProperties(connector) {
  return {
    connectDragSource: connector.dragSource(),
  };
}

const dropTarget = {
  hover: (props, monitor) => {
    const draggedPageId = monitor.getItem().pageId;
    const targetPageId = props.pageId;
    const targetPageIndex = props.pageIndex;
    if (targetPageId !== draggedPageId) {
      props.dispatch(PageActions.setPageIndex(draggedPageId, targetPageIndex));
    }
  },
};

const dragSource = {
  beginDrag(props) {
    return {
      pageId: props.pageId,
      pageIndex: props.pageIndex,
    };
  },
};

function mapStateToProps(state, ownProps) {
  const pageIndex = PagesSelectors.getPageIndexById(state, ownProps.pageId);
  const pageIsPinned = PagesSelectors.getPagePinned(state, ownProps.pageId);

  const selectedPageId = PagesSelectors.getSelectedPageId(state);
  const selectedPageIndex = PagesSelectors.getPageIndexById(state, selectedPageId);

  const isOverviewVisible = UISelectors.getOverviewVisible(state);

  return {
    pageIndex,
    isPinned: pageIsPinned,
    isActive: !isOverviewVisible && selectedPageId === ownProps.pageId,
    isBeforeActive: !isOverviewVisible && selectedPageIndex === pageIndex + 1,
    isAfterActive: !isOverviewVisible && selectedPageIndex === pageIndex - 1,
  };
}

/* eslint-disable new-cap */
export default connect(mapStateToProps)(
  DropTarget(DRAG_DROP_TYPE, dropTarget, dropProperties)(
    DragSource(DRAG_DROP_TYPE, dragSource, dragProperties)(
      Tab
    )
  )
);
