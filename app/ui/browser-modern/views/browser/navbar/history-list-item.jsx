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

import Style from '../../../../shared/style';
import { prettyUrl } from '../../../../shared/util/url-util';

import * as SharedPropTypes from '../../../model/shared-prop-types';

const HISTORY_LIST_ITEM_STYLE = Style.registerStyle({
  overflow: 'hidden',
  padding: '7px',
});

const LOCATION_STYLE = Style.registerStyle({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'var(--theme-content-link-color)',
});

const CHECKMARK_STYLE = Style.registerStyle({
  marginRight: '6px',
});

class HistoryListItem extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div className={HISTORY_LIST_ITEM_STYLE}>
        <div className={LOCATION_STYLE}>
          <i className={`fa fa-check ${CHECKMARK_STYLE}`}
            hidden={!this.props.data.active} />
          {prettyUrl(this.props.data.url)}
        </div>
      </div>
    );
  }
}

HistoryListItem.displayName = 'HistoryListItem';

HistoryListItem.propTypes = {
  data: SharedPropTypes.PageLocalHistoryItem.isRequired,
};

export default HistoryListItem;
