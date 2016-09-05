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

export default Immutable.Record({
  // We're using separate Map and List immutables instead of an OrderedMap,
  // because passing in only ids to certain components will guarantee an
  // easy way of avoiding re-renders. A single sorted data structure containing
  // all pages will trigger unwanted re-renders when a sequence of pages is
  // needed (e.g. rendering a tab bar) but certain properties that don't matter
  // on those pages change (e.g. a page `meta` property that's not relevant).
  // Since we want to avoid deep equality checks and rely on shallow comparison,
  // mapping wouldn't be an option either since it creates new objects.
  map: Immutable.Map(),
  orderedIds: Immutable.List(),
  selectedId: '',
}, 'Pages');
