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

import shallowEqual from 'fbjs/lib/shallowEqual';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

// If some component uses plain js objects as props, we're forced need to use
// deep quality checks on them to make sure we don't unnecessarily re-render.
// For example, a `style` property containing css rules would likely be passed
// as an object literal prop on a component, which will fail strict equality
// comparisons; however, we don't want to cause a re-render in such cases.
// Furthermore, there is no need to re-render that parent component when the
// children have re-rendered, which would happen when checking for deep equality,
// because their props or state are different; we do, however, want to re-render
// the parent component when the children to be presented are in a different order,
// or different in some other way, for which a shallow comparison of the
// `children` property would suffice. Lastly, children in such components may
// contain immutable.js props, which are throwing warnings when accessing some of
// their properties while doing deep equality checks using lodash's `deepEqual`.
//
// See https://github.com/facebook/react/blob/master/src/addons/shallowCompare.js
// for a similar implementation which assumes props are always immutable.js objects.
//
// This method is intended to be used only for components which don't contain
// any immutable.js objects as props, only plain js objects. Simply use
// React's `PureRenderMixin` directly when using only immutable.js props.
// Try not to have immutable.js objects along with plain js objects as props.
export function shouldPlainJsPropsComponentUpdate(nextProps, nextState) {
  const currChildren = this.props.children;
  const nextChildren = nextProps.children;

  const currPlainJsProps = omit(this.props, ['children']);
  const nextPlainJsProps = omit(nextProps, ['children']);

  return (
    !shallowEqual(this.state, nextState)) ||
    !shallowEqual(currChildren, nextChildren) ||
    !isEqual(currPlainJsProps, nextPlainJsProps);
}

// Like the previous method, but can be used for components that have both
// immutable.js objects along with plain js objects as props. This version of
// the `shouldComponentUpdate` method performs shallow equality comparisons on
// immutable.js props, and deep equality comparisons the the other props.
export function shouldMixedPropsComponentUpdate({ immutables }, nextProps, nextState) {
  const currChildren = this.props.children;
  const nextChildren = nextProps.children;

  const currImmutableProps = pick(this.props, immutables);
  const nextImmutableProps = pick(nextProps, immutables);

  const currPlainJsProps = omit(this.props, ['children', ...immutables]);
  const nextPlainJsProps = omit(nextProps, ['children', ...immutables]);

  return (
    !shallowEqual(this.state, nextState)) ||
    !shallowEqual(currChildren, nextChildren) ||
    !shallowEqual(currImmutableProps, nextImmutableProps) ||
    !isEqual(currPlainJsProps, nextPlainJsProps);
}
