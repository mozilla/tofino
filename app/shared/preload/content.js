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

import './hover-status';
import './context-menu';
import './scroll';
import { readerify } from './reader';
import Readability from './readability';
import request from '../../shared/request';
import * as endpoints from '../../shared/constants/endpoints';

window._readerify = readerify.bind(null, Readability);

if (document.origin === endpoints.CONTENT_SERVER_ORIGIN) {
  window._browser = {
    async visited(limit) {
      return (await request(`/visits?limit=${limit}`)).pages;
    },

    async query(string, since, limit, snippetSize) {
      const args = [];
      args.push(`q=${encodeURIComponent(string)}`);
      if (since) {
        since = `${since}`;
        args.push(`since=${encodeURIComponent(since)}`);
      }
      if (limit) {
        limit = `${limit}`;
        args.push(`limit=${encodeURIComponent(limit)}`);
      }
      if (snippetSize) {
        snippetSize = `${snippetSize}`;
        args.push(`snippetSize=${encodeURIComponent(snippetSize)}`);
      }

      return (await request(`/query?${args.join('&')}`)).results;
    },

    // We use `recentStars` instead of `stars` because the latter only
    // gives us URLs, and we want much more.
    async recentStars(limit) {
      return (await request(`/recentStars?limit=${limit}`)).stars;
    },
  };
}
