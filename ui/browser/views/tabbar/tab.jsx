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
    const {
      page, isActive, onClose, onDragEnter, onDrop, onClick, onContextMenu,
    } = this.props;
    const { onDragStart, onDragEnd } = this;

    const title = page.title || 'loading';
    const classes = [
      ...(isActive ? ['active'] : []),
      ...(this.state.dragging ? ['dragging'] : []),
    ];

    return (
      <div className={classes.join(' ')}
        draggable="true"
        {...{ title, onDragEnter, onDrop, onClick, onContextMenu,
             onDragStart, onDragEnd }}>
        <span>
          {title}
          {page.isLoading ? <i className="fa fa-spinner fa-pulse" /> : null}
        </span>
        <a onClick={onClose}>
          <i className="fa fa-close" />
        </a>
      </div>
    );
  }
}

Tab.propTypes = {
  page: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
};

export default Tab;
