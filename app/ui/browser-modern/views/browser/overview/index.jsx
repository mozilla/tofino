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
import Cards from './cards';

import * as UIConstants from '../../../constants/ui';
import * as UISelectors from '../../../selectors/ui';

const OVERVIEW_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'flex-start',
  zIndex: UIConstants.BROWSER_OVERVIEW_BASE_ZINDEX,
  backgroundColor: 'var(--theme-window-background)',
});

class Overview extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    if (!this.props.isOverviewVisible) {
      return null;
    }
    return (
      <div id="browser-overview"
        className={OVERVIEW_STYLE}>
        <Cards />
      </div>
    );
  }
}

Overview.displayName = 'Overview';

Overview.propTypes = {
  isOverviewVisible: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isOverviewVisible: UISelectors.getOverviewVisible(state),
  };
}

export default connect(mapStateToProps)(Overview);
