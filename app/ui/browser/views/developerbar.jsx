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

import BUILD_CONFIG from '../../../../build-config';
import Style from '../browser-style';
import Btn from './navbar/btn';
import { perfStart, perfStop } from '../actions/developer';

const DEVELOPER_BAR_STYLE = Style.registerStyle({
  position: 'fixed',
  bottom: 0,
  right: 0,
  zIndex: 1,
  padding: '2px 10px',
  borderTopLeftRadius: '3px',
  border: '1px solid #999',
  backgroundColor: '#eee',
  alignItems: 'center',
});

/**
 * A developer bar positioned at the bottom of browser chrome to provide
 * utilities in development mode.
 */
class DeveloperBar extends Component {
  constructor(props) {
    super(props);

    this.onRecordingClick = this.onRecordingClick.bind(this);

    this.state = {
      isRecording: false,
    };
  }

  onRecordingClick() {
    const isCurrentlyRecording = this.state.isRecording;
    this.setState({ isRecording: !isCurrentlyRecording });

    if (isCurrentlyRecording) {
      perfStop();
    } else {
      perfStart();
    }
  }

  render() {
    if (!BUILD_CONFIG.development) {
      return null;
    }

    const isRecording = this.state.isRecording;

    return (
      <div className={DEVELOPER_BAR_STYLE}>
        <Btn title={isRecording ? 'Stop Recording' : 'Start Recording'}
          image={isRecording ? 'tool-profiler-active.svg' : 'tool-profiler.svg'}
          clickHandler={this.onRecordingClick} />
      </div>
    );
  }
}

export default DeveloperBar;
