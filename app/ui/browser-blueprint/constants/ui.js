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

import * as contentURLs from '../../../shared/constants/content-pages-locations';

export const HOME_PAGE = contentURLs.HISTORY_PAGE;

// Tabbar dimensions.
export const TABBAR_HEIGHT = 26; // px
export const TAB_DEFAULT_WIDTH = 19; // vw;

// Navbar and Overviewbar dimensions.
export const NAVBAR_HEIGHT = 42; // px
export const NAVBAR_HORIZONTAL_PADDING = 10; // px
export const OVERVIEWBAR_HEIGHT = NAVBAR_HEIGHT; // px
export const OVERVIEWBAR_HORIZONTAL_PADDING = NAVBAR_HORIZONTAL_PADDING; // px

// Overview (page summaries) dimensions.
export const CARD_WIDTH = 140; // px
export const CARD_HEIGHT = 175; // px
// Overview (page summaries) favicon/badge dimensions.
export const CARD_BADGE_WIDTH = 24; // px
export const CARD_BADGE_HEIGHT = 24; // px
export const CARD_BADGE_LARGE_WIDTH = 32; // px
export const CARD_BADGE_LARGE_HEIGHT = 32; // px

// Show autocompletions when typing in location bar
export const SHOW_COMPLETIONS = true;

// Content z-indices.
export const BROWSER_CONTENT_BASE_ZINDEX = 0;
export const BROWSER_CONTENT_ACTIVE_PAGE_ZINDEX = 1;

// Navbar view z-indices.
export const LOCATION_BAR_AUTOCOMPLETE_ZINDEX = 2;

// Page summaries view z-indices.
export const OVERVIEW_ZINDEX = 1;

// Other floating UI elements z-indices.
export const CONTENT_SEARCHBOX_ZINDEX = 1;
export const DEVELOPER_BAR_ZINDEX = 1;
export const STATUS_BAR_ZINDEX = 1;
