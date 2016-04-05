
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BrowserWindow from './browser.jsx';
import * as actions from '../actions/main-actions';
import { ipcRenderer } from 'electron';

export const App = ({ state }) => (
  <BrowserWindow pages={state.pages}
    pageOrder={state.pageOrder}
    currentPageIndex={state.currentPageIndex}
    ipcRenderer={ipcRenderer} />
);

App.propTypes = {
  state: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
