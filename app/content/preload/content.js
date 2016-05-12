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
import { readerify } from './reader';
import Readability from './readability';
import './scroll';
import { api } from '../../ui/browser/user-agent';

window._readerify = readerify.bind(null, Readability);

if (document.location.protocol === 'tofino:') {
  console.log('Adding _browser.');
  window._browser = {
    // We use `recentStars` instead of `stars` because the latter only
    // gives us URLs, and we want much more.
    async recentStars(limit) {
      const res = await api(`/recentStars?limit=${limit}`);
      if (res.ok) {
        const body = await res.json();
        return body.stars;
      }
      return [];
    },
  };
}
