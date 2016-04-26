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

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Style from '../../browser-style';
import Btn from '../navbar/btn';

const TAB_STYLE = Style.registerStyle({
  alignSelf: 'stretch',
  alignItems: 'center',
  overflow: 'hidden',
  width: '20vw',
  fontSize: '75%',
  background: '#eee',
  color: '#777',
  '&.active': {
    background: '#fff',
    color: '#555',
  },
  '&.dragging': {
    opacity: '0.6',
  },
});

const TAB_TITLE_STYLE = Style.registerStyle({
  flex: '1',
  marginLeft: '12px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const TAB_CLOSE_BUTTON_STYLE = Style.registerStyle({
  marginRight: '8px',
  color: '#555',
});

/**
 * Tab is an element on the TabBar at the top of a browser window which shows
 * one of the opened tabs. The web page contained within the tab may not be
 * visible
 */
class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = { dragging: false };

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragStart(event) {
    this.props.onDragStart(event);
    this.setState({ dragging: true });
  }

  onDragEnd(event) {
    this.setState({ dragging: false });
    this.props.onDragEnd(event);
  }

  render() {
    const { onDragStart, onDragEnd } = this;
    const {
      page, isActive, onClose, onDragEnter, onDrop, onClick, onContextMenu,
    } = this.props;

    const modes = [
      ...(isActive ? ['active'] : []),
      ...(this.state.dragging ? ['dragging'] : []),
    ];

    return (
      <div className={`${TAB_STYLE} ${modes.join(' ')}`}
        draggable="true"
        {...{ onDragEnter, onDrop, onClick, onContextMenu, onDragStart, onDragEnd }}>
        <span className={TAB_TITLE_STYLE}>
          {page.title || 'Loading...'}
        </span>
        <span>
          {page.isLoading ? <i className="fa fa-spinner fa-pulse" /> : null}
        </span>
        <Btn className={TAB_CLOSE_BUTTON_STYLE}
          title="Close tab"
          clickHandler={onClose}>
          <i className="fa fa-close" />
        </Btn>
      </div>
    );
  }
}

Tab.displayName = 'Tab';

Tab.propTypes = {
  page: PropTypes.object.isRequired,
  pageId: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  // @TODO create a selector on the reducer to get this.
  page: state.browserWindow.get('pages').find(p => p.id === ownProps.pageId),
});

export default connect(mapStateToProps)(Tab);
