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

import Immutable from 'immutable';

import { register } from '../util/record-constructors';

const VERSION = 1;

export default register(Immutable.Record({
  // We're using separate immutables data stores instead of a single OrderedMap,
  // because passing in only ids to certain components will guarantee an
  // easy way of avoiding re-renders. A single sorted data structure containing
  // all pages will trigger unwanted re-renders when a sequence of pages is
  // needed (e.g. rendering a tab bar) but certain properties that don't matter
  // on those pages change (e.g. a page `meta` property that's not relevant).
  // Since we want to avoid deep equality checks and rely on shallow comparison,
  // mapping or getting keys aren't viable options either since those operations
  // create new objects, which will always fail fast strict equality checks.
  // Furthermore, we'll have to separate the `id` set from the `ordered id` list
  // because changing the items in a list may cause components to unmount/mount
  // when that list is used as the source for a component's children. Usually
  // this is fine, but we don't want to destroy/create webviews when just
  // reordering pages, for example. An `OrderedSet` instead of a simple `Set`
  // is used for the same reason: stable and consistent iteration order is
  // necessary to avoid unmounting/mounting unrelated page components when
  // adding/removing pages.
  map: Immutable.Map(),
  ids: Immutable.OrderedSet(),
  displayOrder: Immutable.List(),
  selectedId: '',
  recentlyClosed: Immutable.List(),
}, `Pages_v${VERSION}`));
