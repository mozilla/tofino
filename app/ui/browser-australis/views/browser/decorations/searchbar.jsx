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
import Search from '../../../../shared/widgets/search';

import * as UIConstants from '../../../constants/ui';
import * as UISelectors from '../../../selectors/ui';
import * as ExternalActions from '../../../actions/external';

const SEARCH_STYLE = Style.registerStyle({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: UIConstants.SEARCH_BAR_INDEX,
  borderTop: '1px solid var(--theme-window-background)',
  color: 'var(--theme-content-color)',
});

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    if (this.props.isVisible) {
      this.search.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.isVisible) {
      this.search.focus();
    } else {
      this.search.blur();
    }
  }

  handleSearchKeyUp = (e) => {
    const doc = e.target.ownerDocument;
    const text = e.target.value;
    ExternalActions.performPageSearch(doc, text);
  }

  render() {
    return (
      <Search ref={element => this.search = element}
        id="browser-page-searchbar"
        className={SEARCH_STYLE}
        hidden={!this.props.isVisible}
        onKeyUp={this.handleSearchKeyUp} />
    );
  }
}

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  isVisible: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    isVisible: UISelectors.getPageSearchVisible(state),
  };
}

export default connect(mapStateToProps)(SearchBar);
