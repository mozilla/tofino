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

export const SessionStartReason = {
  newTab: 0,
};

export const SessionEndReason = {
  tabClosed: 0,
};

export const VisitType = {
  unknown: 0,
};

export const StarOp = {
  unstar: -1,
  star: 1,
};

// This is an obscuring wrapper around sqlite's numeric range -- 64 is the largest possible.
export const SnippetSize = {
  tiny: -5,
  medium: -15,
  large: -40,
  huge: -64,
};
