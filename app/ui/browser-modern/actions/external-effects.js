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

import * as EffectTypes from '../constants/effect-types';

export function maximizeWindow() {
  return {
    type: EffectTypes.MAXIMIZE_WINDOW,
  };
}

export function minimizeWindow() {
  return {
    type: EffectTypes.MINIMIZE_WINDOW,
  };
}

export function closeWindow() {
  return {
    type: EffectTypes.CLOSE_WINDOW,
  };
}

export function reloadWindow() {
  return {
    type: EffectTypes.RELOAD_WINDOW,
  };
}

export function openAppMenu() {
  return {
    type: EffectTypes.OPEN_APP_MENU,
  };
}
