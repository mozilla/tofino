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
import { getNotificationByURL } from '../../../util/notifications';
import * as PagesSelectors from '../../../selectors/pages';
import * as PageEffects from '../../../actions/page-effects';

const NOTIFICATION_BAR_STYLE = Style.registerStyle({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '24px',
  padding: '0 20px',
  borderTop: 'var(--theme-notification-bar-border)',
  borderBottom: 'var(--theme-notification-bar-border)',
  color: 'rgba(0,0,0,0.95)',
  background: 'var(--theme-notification-bar-background)',
  width: '100%',
  alignItems: 'center',
});

const NOTIFICATION_LINK_STYLE = Style.registerStyle({
  marginLeft: '5px',
  color: 'rgba(0,0,0,0.95)',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: 0,
});

class NotificationBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onLinkClick = () => {
    this.props.dispatch(PageEffects.createPageSession(this.props.link));
  }

  render() {
    if (!this.props.message) {
      return null;
    }
    return (
      <div className={`browser-notificationbar ${NOTIFICATION_BAR_STYLE}`}>
        <span>{this.props.message}</span>
        <button className={NOTIFICATION_LINK_STYLE}
          onClick={this.onLinkClick}
          title={this.props.link}>
          {'[More Info...]'}
        </button>
      </div>
    );
  }
}

NotificationBar.displayName = 'NotificationBar';

NotificationBar.propTypes = {
  link: PropTypes.string,
  message: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const page = PagesSelectors.getSelectedPage(state) || {};
  const { link, message } = getNotificationByURL(page.location) || {};

  return {
    link,
    message,
  };
}

export default connect(mapStateToProps)(NotificationBar);
