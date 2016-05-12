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

import request from './request';
import * as endpoints from '../../../shared/constants/endpoints';
import { getPageById } from '../selectors/index';

export function createPage({ url, session, page }) {
  return request(`/pages/${encodeURIComponent(url)}`, {
    method: 'POST',
    json: {
      session,
      page,
    }
  });
}

export function createSession({ ancestor, reason }) {
  return request('/session/start', {
    method: 'POST',
    json: {
      scope: 0,
      ancestor,
      reason,
    },
  })
}

export function destroySession({ session, reason }) {
  return request('/session/end', {
    method: 'POST',
    json: {
      session,
      reason,
    },
  });
}

export function createStar({ url, session, title }) {
  return request(`/stars/${encodeURIComponent(url)}`, {
    // @TODO Shouldn't this be a POST, in terms of creating
    // a new resource?
    method: 'PUT',
    json: { title, session },
  });
}

export function destroyStar({ url, session }) {
  return request(`/stars/${encodeURIComponent(url)}`, {
    method: 'DELETE',
    json: { session },
  });
}

export function query({ text }) {
  return request(`/query?q=${encodeURIComponent(text)}`, {
    method: 'GET',
  });
}

export function createHistory({ url, title, session }) {
  return request('/visits', {
    method: 'POST',
    json: {
      url,
      title,
      session,
    },
  });
}

