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

import * as SharedPropTypes from '../../../model/shared-prop-types';
import Style from '../../../../shared/style';
import OverviewCard from '../../../../shared/widgets/overview/cards/overview-card';

import * as UIConstants from '../../../constants/ui';
import * as PageActions from '../../../actions/page';
import * as PagesSelectors from '../../../selectors/pages';

const OVERVIEW_CARDS_STYLE = Style.registerStyle({
  flexFlow: 'wrap',
  alignItems: 'flex-start',
  overflow: 'auto',
  margin: '45px',
});

class Cards extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleCardClick = pageId => {
    this.props.dispatch(PageActions.setSelectedPage(pageId));
  }

  render() {
    return (
      <div id="browser-overview-cards"
        className={OVERVIEW_CARDS_STYLE}>
        {this.props.pages.map((page, pageIndex) => (
          <OverviewCard key={`page-${page.id}`}
            page={page}
            width={UIConstants.CARD_WIDTH}
            height={UIConstants.CARD_HEIGHT}
            badgeWidth={UIConstants.CARD_BADGE_WIDTH}
            badgeHeight={UIConstants.CARD_BADGE_HEIGHT}
            badgeLargeWidth={UIConstants.CARD_BADGE_LARGE_WIDTH}
            badgeLargeHeight={UIConstants.CARD_BADGE_LARGE_HEIGHT}
            isSelected={pageIndex === this.props.selectedPageIndex}
            onClick={this.handleCardClick} />
        ))}
      </div>
    );
  }
}

Cards.displayName = 'Cards';

Cards.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pages: SharedPropTypes.Pages.isRequired,
  selectedPageIndex: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    pages: PagesSelectors.getPages(state),
    selectedPageIndex: PagesSelectors.getSelectedPageIndex(state),
  };
}

export default connect(mapStateToProps)(Cards);
