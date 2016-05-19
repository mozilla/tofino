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

/**
 * A mapping from a page id to a promise that
 * will resolve to a session id. When we initiate the session,
 * we immediately store a promise that will resolve to the session id
 * so that future requests using the page id can hook into the initial promise
 * even before we have the session.
 */
const PAGE_TO_SESSION = new Map();

async function waitForSession(page) {
  // If we have a session id, use it; this could have been generated
  // this browsing session, or from a previous session, but either way
  // this was an explicit choice.
  if (page.sessionId) {
    return page.sessionId;
  } else if (PAGE_TO_SESSION.has(page.id)) {
    // If we have a promise to the session for this page, and the page
    // does not have its own sessionId, we probably hit a race condition,
    // so wait until the page has its sessionId by listening for this promise.
    return PAGE_TO_SESSION.get(page.id);
  }

  // If we have neither promise nor sessionId, then something
  // terrible has happened.
  throw new Error(`No session mapping for page ${page.id}.`);
}

export function createSession(pageId, { scope = 0, ancestor, reason }) {
  const requestPromise = request('/session/start', {
    method: 'POST',
    json: {
      scope,
      ancestor,
      reason,
    },
  });

  // Set the map from the page to a promise resolving to the session ID
  // immediately for future requests.
  PAGE_TO_SESSION.set(pageId, requestPromise.then(res => res.session));

  return requestPromise;
}

export async function destroySession(page, { reason }) {
  const session = await waitForSession(page);
  return request('/session/end', {
    method: 'POST',
    json: {
      session,
      reason,
    },
  });
}

export async function createPage(page, { url, readerResult }) {
  const session = await waitForSession(page);
  return request(`/pages/${encodeURIComponent(url)}`, {
    method: 'POST',
    json: {
      session,
      page: readerResult,
    },
  });
}

export async function createStar(page, { url, title }) {
  const session = await waitForSession(page);
  return request(`/stars/${encodeURIComponent(url)}`, {
    // @TODO Shouldn't this be a POST, in terms of creating
    // a new resource?
    method: 'PUT',
    json: { title, session },
  });
}

export async function destroyStar(page, { url }) {
  const session = await waitForSession(page);
  return request(`/stars/${encodeURIComponent(url)}`, {
    method: 'DELETE',
    json: { session },
  });
}

export async function createHistory(page, { url, title }) {
  const session = await waitForSession(page);
  return request('/visits', {
    method: 'POST',
    json: {
      url,
      title,
      session,
    },
  });
}

/**
 * Requests that do not require a session.
 */

export async function query({ text }) {
  return request(`/query?q=${encodeURIComponent(text)}`, {
    method: 'GET',
  });
}
