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

import ProfileModel from './profile';
import PageModel from './page';
import PageMetaModel from './page-meta';
import PageLocalHistoryItemModel from './page-local-history-item';
import LocationAutocompletionModel from './location-autocompletion';
import PageStateModel from './page-state';
import SSLCertificateModel from './ssl-certificate';

export const Profile = PropTypes.instanceOf(ProfileModel);
export const Profiles = ImmutablePropTypes.listOf(Profile.isRequired);

export const PageIds = ImmutablePropTypes.listOf(PropTypes.string.isRequired);
export const UnorderedPageIds = ImmutablePropTypes.setOf(PropTypes.string.isRequired);

export const Page = PropTypes.instanceOf(PageModel);
export const Pages = ImmutablePropTypes.listOf(Page.isRequired);

export const PageMeta = PropTypes.instanceOf(PageMetaModel);
export const PageState = PropTypes.instanceOf(PageStateModel);
export const PageMetas = ImmutablePropTypes.listOf(PageMeta.isRequired);

export const SSLCertificate = PropTypes.instanceOf(SSLCertificateModel);

export const PageLocalHistoryItem = PropTypes.instanceOf(PageLocalHistoryItemModel);
export const PageLocalHistoryItems = ImmutablePropTypes.listOf(PageLocalHistoryItem);

export const LocationAutocompletion = PropTypes.instanceOf(LocationAutocompletionModel);
export const LocationAutocompletions = ImmutablePropTypes.listOf(LocationAutocompletion);
