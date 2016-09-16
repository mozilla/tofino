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

// Developer effects

export const PERF_RECORD_START = 'PERF_RECORD_START_EFFECT';
export const PERF_RECORD_STOP = 'PERF_RECORD_STOP_EFFECT';

// External effects

export const MINIMIZE_WINDOW = 'MINIMIZE_WINDOW_EFFECT';
export const MAXIMIZE_WINDOW = 'MAXIMIZE_WINDOW_EFFECT';
export const CLOSE_WINDOW = 'CLOSE_WINDOW_EFFECT';
export const OPEN_APP_MENU = 'OPEN_APP_MENU_EFFECT';

// Profile effects

export const FETCH_LOCATION_AUTOCOMPLETIONS = 'FETCH_LOCATION_AUTOCOMPLETIONS_EFFECT';
export const SET_REMOTE_BOOKMARK_STATE = 'SET_REMOTE_BOOKMARK_STATE_EFFECT';
export const ADD_REMOTE_HISTORY = 'ADD_REMOTE_HISTORY_EFFECT';
export const ADD_CAPTURED_PAGE = 'ADD_CAPTURED_PAGE_EFFECT';

// Page effects

export const CREATE_PAGE_SESSION = 'CREATE_PAGE_SESSION_EFFECT';
export const DESTROY_PAGE_SESSION = 'DESTROY_PAGE_SESSION_EFFECT';
export const NAVIGATE_PAGE_TO = 'NAVIGATE_PAGE_TO_EFFECT';
export const NAVIGATE_PAGE_BACK = 'NAVIGATE_PAGE_BACK_EFFECT';
export const NAVIGATE_PAGE_FORWARD = 'NAVIGATE_PAGE_FORWARD_EFFECT';
export const NAVIGATE_PAGE_REFRESH = 'NAVIGATE_PAGE_REFRESH_EFFECT';
export const TOGGLE_DEVTOOLS = 'TOGGLE_DEVTOOLS_EFFECT';
export const PERFORM_PAGE_SEARCH = 'PERFORM_PAGE_SEARCH_EFFECT';
export const SET_PAGE_ZOOM_LEVEL = 'SET_PAGE_ZOOM_LEVEL_EFFECT';
export const CAPTURE_PAGE = 'CAPTURE_PAGE_EFFECT';
export const PARSE_PAGE_META_DATA = 'PARSE_PAGE_META_DATA_EFFECT';
export const GET_CERTIFICATE_ERROR = 'GET_CERTIFICATE_ERROR_EFFECT';

// UI effects

export const FOCUS_URL_BAR = 'FOCUS_URL_BAR_EFFECT';
export const SET_URL_BAR_VALUE = 'SET_URL_BAR_VALUE_EFFECT';
export const SHOW_DOWNLOAD_NOTIFICATION = 'SHOW_DOWNLOAD_NOTIFICATION_EFFECT';
