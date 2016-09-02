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

import React, { PropTypes } from 'react';

import Style from '../../../shared/style';
import { prettyUrl } from '../../../../shared/url';

const GRADIENT_MASK = `-webkit-linear-gradient(left,
                      rgba(0, 0, 0, 1) 0%,
                      rgba(0, 0, 0, 1) 90%,
                      rgba(0, 0, 0, 0) 95%)`;

const ROW_STYLE = Style.registerStyle({
  padding: '5px',
});

const TITLE_STYLE = Style.registerStyle({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  paddingRight: '10px',
  flex: 6,
  '-webkit-mask-image': GRADIENT_MASK,
  color: 'var(--theme-locationbar-title-color)',
});

const URL_STYLE = Style.registerStyle({
  flex: 4,
  color: 'var(--theme-content-color-alt)',
  fontSize: '11px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  marginTop: '3px',
  '-webkit-mask-image': GRADIENT_MASK,
});

const FOCUSED_RESULT_STYLE = Style.registerStyle({
  backgroundColor: 'var(--theme-selection-color)',
});

/**
 * A completion row in the address bar.
 */
export function LocationCompletionRow(props) {
  /*
  // @TODO figure out what to do with the fulltext data
  //
  // We get safe, decorated (<b>foo</b>) HTML from the database.
  const snippet = props.completion.snippet ? (
    <div
      dangerouslySetInnerHTML={{          // eslint-disable-line react/no-danger
        __html: props.completion.snippet,
      }}>
    </div>
  ) : null;
  */

  return (
    <div className={`completion-row ${ROW_STYLE} ${props.isFocused ? FOCUSED_RESULT_STYLE : ''}`}
      onMouseDown={(ev) => { ev.preventDefault(); }}
      onMouseOver={() => { props.onCompletionMouseOver(props.index); }}
      onClick={() => {
        props.onCompletionClick(props.completion.uri);
      }}>
      <span className={`completion-title ${TITLE_STYLE}`}>{props.completion.title}</span>
      <span className={`completion-url ${URL_STYLE}`}>{prettyUrl(props.completion.uri)}</span>
    </div>
  );
}

LocationCompletionRow.displayName = 'LocationCompletionRow';

LocationCompletionRow.propTypes = {
  completion: PropTypes.object.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onCompletionClick: PropTypes.func.isRequired,
  onCompletionMouseOver: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default LocationCompletionRow;
