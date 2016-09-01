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

import Style from '../../../../shared/style';
import Tab from './tab';
import Btn from '../../../../shared/widgets/btn';

import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as UIConstants from '../../../constants/ui';
import * as PageActions from '../../../actions/page';
import * as PagesSelectors from '../../../selectors/pages';

const TABBAR_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'hidden',
  height: `${UIConstants.NAVBAR_HEIGHT}px`,
  backgroundColor: 'var(--theme-tabbar-background)',
});

const NEW_TAB_BUTTON_STYLE = Style.registerStyle({
});

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleNewTabClick = () => {
    this.props.dispatch(PageActions.createPage());
  }

  render() {
    return (
      <div id="browser-tabbar"
        className={TABBAR_STYLE}>
        {this.props.pages.map(page => (
          <Tab key={`tab-${page.id}`}
            pageId={page.id}
            pageTitle={page.title}
            pageLocation={page.location}
            pageFavicon={page.meta.icon_url} />
        ))}
        <Btn id="new-tab-button"
          className={NEW_TAB_BUTTON_STYLE}
          title="New tab"
          image="glyph-addnew.svg"
          imgWidth="14px"
          imgHeight="14px"
          imgPosition="center"
          minWidth={`${UIConstants.TABBAR_HEIGHT}px`}
          minHeight={`${UIConstants.TABBAR_HEIGHT}px`}
          onClick={this.handleNewTabClick} />
      </div>
    );
  }
}

TabBar.displayName = 'TabBar';

TabBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pages: SharedPropTypes.Pages.isRequired,
};

function mapStateToProps(state) {
  return {
    pages: PagesSelectors.getPages(state),
  };
}

export default connect(mapStateToProps)(TabBar);
