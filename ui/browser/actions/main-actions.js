
import * as types from '../constants/action-types';

export function createTab(location) {
  return { type: types.CREATE_TAB, location };
}

export function duplicateTab(pageIndex) {
  return { type: types.DUPLICATE_TAB, pageIndex };
}
export function attachTab(page) {
  return { type: types.ATTACH_TAB, page };
}

export function closeTab(pageIndex) {
  return { type: types.CLOSE_TAB, pageIndex };
}

export function setLocation(userTyped) {
  return { type: types.SET_LOCATION, userTyped };
}

export function setPageDetails(pageIndex, details) {
  return { type: types.SET_PAGE_DETAILS, pageIndex, details };
}

export function setCurrentTab(pageIndex) {
  return { type: types.SET_CURRENT_TAB, pageIndex };
}

export function setPageOrder(pageOrder) {
  return { type: types.SET_PAGE_ORDER, pageOrder };
}
