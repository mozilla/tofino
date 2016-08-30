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

import * as SharedPropTypes from '../../model/shared-prop-types';
import Style from '../../../shared/style';
import OverviewCard from './cards/overview-card';

import * as actions from '../../actions/main-actions';

const OVERVIEW_CARDS_STYLE = Style.registerStyle({
  flexFlow: 'wrap',
  overflow: 'auto',
  margin: '45px',
});

const OverviewCards = function(props) {
  return (
    <div id="browser-overview-cards"
      className={OVERVIEW_CARDS_STYLE}>
      {props.pages.map((page, pageIndex) => (
        <OverviewCard key={`page-${page.id}`}
          page={page}
          pageIndex={pageIndex}
          isSelected={pageIndex === props.currentPageIndex}
          onClick={pageId => props.dispatch(actions.setCurrentTab(pageId))} />
      ))}
    </div>
  );
};

OverviewCards.displayName = 'OverviewCards';

OverviewCards.propTypes = {
  dispatch: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  pages: SharedPropTypes.Pages.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(OverviewCards);
