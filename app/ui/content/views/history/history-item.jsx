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

import React from 'react';

import Style from '../../../shared/style';

import * as ContentPropTypes from '../../model/content-prop-types';
import ListItem from '../../../shared/widgets/list-item';

const HISTORY_ITEM_STYLE = Style.registerStyle({
  '&:nth-child(odd)': {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  '&:nth-child(even)': {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  '& > a': {
    textDecoration: 'none',
    color: 'rgba(0,0,0,0.9)',
  },
});

const HISTORY_ANCHOR_STYLE = Style.registerStyle({
  padding: '6px 8px',
  display: 'block',
});

function HistoryItem(props) {
  return (
    <ListItem className={HISTORY_ITEM_STYLE}>
      <a className={HISTORY_ANCHOR_STYLE}
        href={props.page.uri}
        title={props.page.title || props.page.uri}>
        {props.page.title || props.page.uri}
      </a>
      {props.page.snippet
      ? (
        <p>{props.page.snippet}</p>
      ) : (
        null
      )}
    </ListItem>
  );
}

HistoryItem.displayName = 'HistoryItem';

HistoryItem.propTypes = {
  page: ContentPropTypes.VisitedPage.isRequired,
};

export default HistoryItem;
