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

import Style from '../../../shared/style';
import HistoryItem from './history-item';
import List from '../../../shared/widgets/list';
import Search from '../../../shared/widgets/search';
import * as ContentPropTypes from '../../model/content-prop-types';
import * as MainEffects from '../../actions/main-effects';
import * as Selectors from '../../selectors';

const HISTORY_STYLE = Style.registerStyle({
  flex: 1,
  flexDirection: 'column',
  padding: '20px 10%',
  width: '80%',
});

const LIST_STYLE = Style.registerStyle({
  flex: 1,
});

const SEARCH_STYLE = Style.registerStyle({
  marginBottom: '10px',
  width: '300px',
});

const SEARCH_INPUT_STYLE = Style.registerStyle({
  border: '1px solid var(--theme-content-border-color)',
  color: 'var(--theme-content-color)',
  backgroundColor: 'var(--theme-content-background)',
  padding: '4px',
  '&:focus': {
    borderColor: 'var(--theme-content-selected-border-color)',
  },
});

class History extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(MainEffects.fetchHistory({ limit: 200 }));
  }

  handleSearch = e => {
    const query = e.target.value;
    const limit = query ? 20 : 200;
    this.props.dispatch(MainEffects.fetchHistory({ query, limit }));
  }

  render() {
    return (
      <div className={HISTORY_STYLE}>
        <Search placeholder="Search history..."
          className={SEARCH_STYLE}
          inputClassName={SEARCH_INPUT_STYLE}
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
    pages: Selectors.getVisitedPages(state),
  };
}

export default connect(mapStateToProps)(History);
