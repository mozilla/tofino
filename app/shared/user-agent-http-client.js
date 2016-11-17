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

/* global fetch */
import 'isomorphic-fetch';
import * as endpoints from './constants/endpoints';
import * as UUIDUtil from './uuid-util';

export class UserAgentHttpClient {
  constructor({ version, host, port }) {
    if (!version || !host || !port) {
      throw new Error('Must have host, port, and version defined.');
    }

    this.version = version;
    this.host = host;
    this.port = port;
    // No trailing slash -- all service URLs should include leading slash.
    this.url = `http://${this.host}:${this.port}/${this.version}`;
    this.wsUrl = `ws://${this.host}:${this.port}/${this.version}/ws`;

    /**
     * A mapping from a page id to a promise that will resolve to a session id.
     * When we initiate the session, we immediately store a promise that will
     * resolve to the session id so that future requests using the page id can
     * hook into the initial promise even before we have the session.
     *
     * This remains for historical reasons, although it's strictly a front-end
     * convenience and has nothing to do with the HTTP API exposed by the UAS.
     */
    this.PAGE_TO_SESSION = new Map();
  }

  uaRequest(url, options) {
    const newOptions = Object.assign({}, options);
    if (!newOptions.headers) {
      newOptions.headers = {};
    }
    newOptions.headers['Accept'] = 'application/json';
    newOptions.headers['Content-Type'] = 'application/json';

    if (!newOptions.body && newOptions.json instanceof Object) {
      newOptions.body = JSON.stringify(newOptions.json);
    }

    return fetch(`${this.url}${url}`, newOptions).then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    });
  }

  async waitForSession(page) {
    if (typeof page === 'number') {
      // If we're given a numeric session id, just use it.
      return page;
    } else if (page.sessionId) {
      // If we have a session id, use it; this could have been generated
      // this browsing session, or from a previous session, but either way
      // this was an explicit choice.
      return page.sessionId;
    } else if (this.PAGE_TO_SESSION.has(page.id)) {
      // If we have a promise to the session for this page, and the page
      // does not have its own sessionId, we probably hit a race condition,
      // so wait until the page has its sessionId by listening for this promise.
      return this.PAGE_TO_SESSION.get(page.id);
    } else if (UUIDUtil.isUUID(page) && this.PAGE_TO_SESSION.has(page)) {
      // Also allow passing in the pageId itself
      return this.PAGE_TO_SESSION.get(page);
    }

    // If we have neither promise nor sessionId, then something
    // terrible has happened.
    throw new Error(`No session mapping for page ${page.id}.`);
  }

  createSession(pageId, { scope = 0, ancestor, reason } = {}) {
    const requestPromise = this.uaRequest('/sessions/start', {
      method: 'POST',
      json: {
        scope,
        ancestor,
        reason,
      },
    });

    if (pageId) {
      // Set the map from the page to a promise resolving to the session ID
      // immediately for future requests.
      this.PAGE_TO_SESSION.set(pageId, requestPromise.then(res => res.session));
    }

    return requestPromise;
  }

  async destroySession(page, { reason } = {}) {
    const session = await this.waitForSession(page);
    return this.uaRequest('/sessions/end', {
      method: 'POST',
      json: {
        session,
        reason,
      },
    });
  }

  async createPage(page, { url, readerResult }) {
    const session = await this.waitForSession(page);
    return this.uaRequest('/pages/page', {
      method: 'POST',
      json: {
        session,
        url,
        page: readerResult,
      },
    });
  }

  async createStar(page, { url, title }) {
    const session = await this.waitForSession(page);
    return this.uaRequest('/stars/star', {
      method: 'POST',
      json: {
        session,
        url,
        title,
      },
    });
  }

  async destroyStar(page, { url }) {
    const session = await this.waitForSession(page);
    return this.uaRequest('/stars/unstar', {
      method: 'POST',
      json: {
        session,
        url,
      },
    });
  }

  async createHistory(page, { url, title }) {
    const session = await this.waitForSession(page);
    return this.uaRequest('/visits/visit', {
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

  async query({ text, since, limit, snippetSize }) {
    const args = [];
    args.push(`q=${encodeURIComponent(text)}`);
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

    return this.uaRequest(`/pages?${args.join('&')}`, {
      method: 'GET',
    });
  }

  async visited({ limit }) {
    const args = [];
    if (limit) {
      limit = `${limit}`;
      args.push(`limit=${encodeURIComponent(limit)}`);
    }

    return this.uaRequest(`/visits${args.length ? '?' : ''}${args.join('&')}`, {
      method: 'GET',
    });
  }

  async stars({ limit }) {
    const args = [];
    if (limit) {
      limit = `${limit}`;
      args.push(`limit=${encodeURIComponent(limit)}`);
    }

    return this.uaRequest(`/stars${args.length ? '?' : ''}${args.join('&')}`, {
      method: 'GET',
    });
  }
}

// For now, endpoint is fixed.  In the future, configure this when loading content page.
const userAgentHttpClient = new UserAgentHttpClient(
  { version: endpoints.UA_SERVICE_VERSION,
    host: endpoints.UA_SERVICE_ADDR,
    port: endpoints.UA_SERVICE_PORT });

export default userAgentHttpClient;
