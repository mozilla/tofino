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

const ROW_STYLE = Style.registerStyle({
  // We're nesting multi-line items inside a flexbox, so
  // we need to mark these children as columnar.
  flexDirection: 'column',
});

const FOCUSED_RESULT_STYLE = Style.registerStyle({
  background: 'var(--theme-selection-color)',
  color: 'var(--theme-content-selected-color)',
});

const COMPLETION_TEXT_STYLE = Style.registerStyle({
  color: 'rgba(100, 100, 100, 1)',
  padding: '0.5em',
  whiteSpace: 'pre-wrap',           // So that spaces show up in snippets.
  zIndex: 2,
});

/**
 * A completion row in the address bar.
 */
export function LocationCompletionRow(props) {
  // We get safe, decorated (<b>foo</b>) HTML from the database.
  const snippet = props.completion.snippet ? (
    <div
      className={COMPLETION_TEXT_STYLE}
      dangerouslySetInnerHTML={{          // eslint-disable-line react/no-danger
        __html: props.completion.snippet,
      }}>
    </div>
  ) : null;

  return (
    <div className={`completion-row ${ROW_STYLE}`}>
      <div
        onMouseDown={(ev) => { ev.preventDefault(); }}
        onMouseOver={() => { props.onCompletionMouseOver(props.index); }}
        onClick={() => {
          props.onCompletionClick(props.completion.uri);
        }}
        className={props.isFocused ? FOCUSED_RESULT_STYLE : null}>
        <span>{props.completion.title}</span>&nbsp;—&nbsp;<span>{props.completion.uri}</span>
      </div>
      {snippet}
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
