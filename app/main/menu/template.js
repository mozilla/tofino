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

import menus from './menus';

export const MinimalAppMenuTemplate = [
  menus.file,
  menus.edit,
  menus.window,
  menus.help,
];

export const AppMenuTemplate = [
  menus.file,
  menus.edit,
  menus.view,
  menus.history,
  menus.bookmarks,
  menus.tools,
  menus.window,
  menus.help,
];

export const WindowMenuTemplate = [
  ...menus.file.submenu,
  menus.edit,
  menus.view,
  menus.history,
  menus.bookmarks,
  menus.tools,
  menus.window,
  menus.help,
];

if (process.platform === 'darwin') {
  MinimalAppMenuTemplate.unshift(menus.osx);
  AppMenuTemplate.unshift(menus.osx);
}
