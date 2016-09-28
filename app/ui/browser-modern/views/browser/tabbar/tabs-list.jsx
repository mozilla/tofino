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

import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import Style from '../../../../shared/style';
import Tab from './tab';

import * as UIConstants from '../../../constants/ui';
import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as PagesSelectors from '../../../selectors/pages';

const TABS_LIST_STYLE = Style.registerStyle({
  WebkitUserSelect: 'none',
  WebkitAppRegion: 'no-drag',
  overflow: 'hidden',
  padding: `0 ${UIConstants.TAB_OVERLAP}px`,
});

class TabsList extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div id="browser-tabs"
        className={TABS_LIST_STYLE}>
        {this.props.pageIds.map(pageId => (
          <Tab key={`tab-${pageId}`}
            pageId={pageId} />
        ))}
      </div>
    );
  }
}

TabsList.displayName = 'TabsList';

TabsList.propTypes = {
  pageIds: SharedPropTypes.PageIds.isRequired,
};

function mapStateToProps(state) {
  return {
    pageIds: PagesSelectors.getPageIdsInDisplayOrder(state),
  };
}

export default connect(mapStateToProps)(TabsList);
