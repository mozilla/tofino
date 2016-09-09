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
import Tab from './tab';
import Btn from '../../../shared/widgets/btn';

import * as selectors from '../../selectors';

const TABBAR_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
});

export const TabBar = (props) => (
  <div id="browser-tabbar"
    className={TABBAR_STYLE}>
    {props.pages.map((page, i) => (
      <Tab key={`browser-tab-${i}`}
        className={`browser-tab-${i}`}
        isActive={props.currentPageIndex === i && !props.pageSumariesVisible}
        isBeforeActive={props.currentPageIndex === i + 1 && !props.pageSumariesVisible}
        isAfterActive={props.currentPageIndex === i - 1 && !props.pageSumariesVisible}
        isFirst={i === 0}
        isLast={i === props.pages.count() - 1}
        page={page}
        onClick={props.handleTabClick(page.id)}
        onContextMenu={props.handleTabContextMenu(page.id)}
        onClose={props.handleTabClose(page.id)} />
    ))}
    <Btn id="new-tab"
      title="Add new tab"
      image="glyph-addnew.svg"
      imgWidth="8px"
      imgHeight="8px"
      imgPosition="center"
      minWidth={`${UIConstants.TABBAR_HEIGHT}px`}
      minHeight={`${UIConstants.TABBAR_HEIGHT}px`}
      onClick={props.handleNewTabClick} />
  </div>
);

TabBar.displayName = 'TabBar';

TabBar.propTypes = {
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  pageSumariesVisible: PropTypes.bool.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  handleTabClose: PropTypes.func.isRequired,
  handleNewTabClick: PropTypes.func.isRequired,
  handleTabContextMenu: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    pageSumariesVisible: selectors.getShowPageSummaries(state),
  };
}

export default connect(mapStateToProps)(TabBar);
