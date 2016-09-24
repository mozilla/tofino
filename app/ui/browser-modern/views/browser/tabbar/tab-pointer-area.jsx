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

import * as PagesSelectors from '../../../selectors/pages';

/**
 * Tab components are visually laid out in such a way that resuts in complex
 * overlapping due to their visual elements. Therefore, pointer interaction
 * would be hidered if relying on the default bounds alone. This component is
 * responsible for providing an explicitly interactive rectangular area for tabs.
 */

const TAB_POINTER_AREA_STYLE = Style.registerStyle({
  // Make sure this is underneath other sibling interactive elements.
  zIndex: -1,
  pointerEvents: 'all',
  position: 'absolute',
  left: '15px',
  right: '15px',
  top: 0,
  bottom: 0,
});

class TabPointerArea extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div className={`tab-pointer-area ${TAB_POINTER_AREA_STYLE}`}
        title={this.props.tooltipText}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp} />
    );
  }
}

TabPointerArea.displayName = 'TabPointerArea';

TabPointerArea.propTypes = {
  tooltipText: PropTypes.string.isRequired,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);

  return {
    tooltipText: page ? page.title || page.meta.title || page.location : '',
  };
}

export default connect(mapStateToProps)(TabPointerArea);
