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

import { metadataRules, getMetadata } from 'page-metadata-parser';
import tofinoRules from './metadata-rules';

// Use our own rules, as well as those provided from `page-metadata-parser`.
const RULES = {
  ...metadataRules,
  ...tofinoRules,
};

const URL_PROPERTIES = [
  'icon_url',
  'image_url',
  'url',
];

export function parseMetadata(document) {
  const meta = getMetadata(document, RULES);

  if (!meta) {
    return meta;
  }

  // Handle URLs that lack protocol and append appropriate
  // 'http:' or 'https:'
  for (const prop of URL_PROPERTIES) {
    const value = meta[prop];
    if (value && value.substr(0, 2) === '//') {
      meta[prop] = `${document.location.protocol}${value}`;
    }
  }

  return meta;
}
