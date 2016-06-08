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
import { connect } from 'react-redux';

import Style from '../../../shared/style';
import HistoryItem from './history-item';
import List from '../../../shared/widgets/list';
import Search from '../../../shared/widgets/search';
import * as ContentPropTypes from '../../model/content-prop-types';
import * as actions from '../../actions/main-actions';
import * as selectors from '../../selectors';

// TODO: Don't rely on the user agent injecting helpers into our page.
// Fixed after https://github.com/mozilla/tofino/pull/609
const UA = window._browser;

const HISTORY_STYLE = Style.registerStyle({
  flex: 1,
  flexDirection: 'column',
  padding: '20px 10%',
});

const LIST_STYLE = Style.registerStyle({
  flex: 1,
  overflow: 'auto',
});

const SEARCH_STYLE = Style.registerStyle({
  marginBottom: '10px',
  width: '300px',
});

class History extends Component {
  componentDidMount() {
    this.props.dispatch(actions.showHistory({ UA, limit: 200 }));
  }

  handleSearch = e => {
    const query = e.target.value;
    const limit = query ? 20 : 200;
    this.props.dispatch(actions.showHistory({ UA, query, limit }));
  }

  render() {
    return (
      <div className={HISTORY_STYLE}>
        <Search hidden={false}
          className={SEARCH_STYLE}
          onKeyUp={this.handleSearch} />
        <List className={LIST_STYLE}>
          {this.props.pages.map(page => (
            <HistoryItem key={`history-item-${page.uri}`}
              page={page} />
          ))}
        </List>
      </div>
    );
  }
}

History.displayName = 'History';

History.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pages: ContentPropTypes.VisitedPages.isRequired,
};

function mapStateToProps(state) {
  return {
    pages: selectors.getVisitedPages(state),
  };
}

export default connect(mapStateToProps)(History);
