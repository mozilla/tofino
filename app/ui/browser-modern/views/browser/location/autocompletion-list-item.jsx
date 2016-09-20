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

import * as SharedPropTypes from '../../../model/shared-prop-types';

const AUTOCOMPLETIONS_LIST_ITEM_STYLE = Style.registerStyle({
  overflow: 'hidden',
  padding: '7px',
});

const TITLE_STYLE = Style.registerStyle({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const LOCATION_STYLE = Style.registerStyle({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'var(--theme-content-link-color)',
});

const SEPARATOR_STYLE = Style.registerStyle({
  padding: '0 4px',
});

class AutocompletionsListItem extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div className={AUTOCOMPLETIONS_LIST_ITEM_STYLE}>
        {this.props.data.title
        ? (
          <div>
            <div className={TITLE_STYLE}>
              {this.props.data.title}
            </div>
            <div className={SEPARATOR_STYLE}>
              {'–'}
            </div>
          </div>
        ) : (
          null
        )}
        <div className={LOCATION_STYLE}>
          {this.props.data.uri}
        </div>
      </div>
    );
  }
}

AutocompletionsListItem.displayName = 'AutocompletionsListItem';

AutocompletionsListItem.propTypes = {
  data: SharedPropTypes.LocationAutocompletion.isRequired,
};

export default AutocompletionsListItem;
