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

const NOTIFICATION_MESSAGES = {
  codec: site => `Tofino may have issues playing media on ${site} due to licensing.`,
  login: site => `Tofino may have issues with logging in on ${site}.`,
  persona: () => 'Tofino has issues with logging in via Persona.',
};

const NOTIFICATIONS_BY_URL = {
  feedly: {
    message: NOTIFICATION_MESSAGES.login('Feedly'),
    link: 'https://github.com/mozilla/tofino/issues/1129',
  },
  imgur: {
    message: NOTIFICATION_MESSAGES.codec('imgur'),
    link: 'https://github.com/mozilla/tofino/issues/1050',
  },
  // Blanket persona check on Mozilla domains
  mozilla: {
    message: NOTIFICATION_MESSAGES.persona(),
    link: 'https://github.com/mozilla/tofino/issues/1027',
  },
  netflix: {
    message: NOTIFICATION_MESSAGES.codec('Netflix'),
    link: 'https://github.com/mozilla/tofino/issues/997',
  },
  twitter: {
    message: NOTIFICATION_MESSAGES.codec('Twitter'),
    link: 'https://github.com/mozilla/tofino/issues/1050',
  },
  youtube: {
    message: NOTIFICATION_MESSAGES.codec('YouTube'),
    link: 'https://github.com/mozilla/tofino/issues/1004',
  },
};

const NOTIFICATIONS_BY_URL_KEYS = Object.keys(NOTIFICATIONS_BY_URL);

/**
 * Takes a URL and crudely parses the hostname for popular sites that have
 * known issues. The crudeness is due to subdomains and locale TLDs.
 */
export function getNotificationByURL(url) {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    return null;
  }

  for (const domain of NOTIFICATIONS_BY_URL_KEYS) {
    if (hostname.includes(domain)) {
      return NOTIFICATIONS_BY_URL[domain];
    }
  }

  return null;
}
