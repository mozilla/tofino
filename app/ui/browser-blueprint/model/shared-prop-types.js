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

import { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as Model from './';

export const Page = PropTypes.instanceOf(Model.Page);
export const Pages = ImmutablePropTypes.listOf(Page.isRequired);

export const Profile = PropTypes.instanceOf(Model.Profile);
export const Profiles = ImmutablePropTypes.listOf(Profile.isRequired);
