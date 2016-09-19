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
import Btn from '../../../../shared/widgets/btn';

import BUILD_CONFIG from '../../../../../build-config';
import * as UIConstants from '../../../constants/ui';
import * as DeveloperEffects from '../../../actions/developer-effects';

const DEVELOPER_BAR_STYLE = Style.registerStyle({
  position: 'fixed',
  bottom: 0,
  right: 0,
  zIndex: UIConstants.DEVELOPER_BAR_ZINDEX,
  padding: '2px 8px',
  border: '1px solid var(--theme-statusbar-border-color)',
  borderTopLeftRadius: 'var(--theme-default-roundness)',
  borderRightWidth: 0,
  borderBottomWidth: 0,
  background: 'var(--theme-statusbar-background)',
  color: 'var(--theme-content-color)',
});

class DeveloperBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.state = {
      isRecording: false,
    };
  }

  handleRecordingClick = () => {
    if (this.state.isRecording) {
      this.setState({ isRecording: false });
      this.props.dispatch(DeveloperEffects.perfRecordStop());
    } else {
      this.setState({ isRecording: true });
      this.props.dispatch(DeveloperEffects.perfRecordStart());
    }
  }

  render() {
    if (!BUILD_CONFIG.development) {
      return null;
    }

    const isRecording = this.state.isRecording;

    return (
      <div className={`browser-developerbar ${DEVELOPER_BAR_STYLE}`}>
        <Btn id="record-button"
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          image={isRecording ? 'tool-profiler-active.svg' : 'tool-profiler.svg'}
          imgWidth="14px"
          imgHeight="14px"
          onClick={this.handleRecordingClick} />
      </div>
    );
  }
}

DeveloperBar.displayName = 'DeveloperBar';

DeveloperBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(DeveloperBar);
