# User Agent Service REST API

This document provides protocol-level details of the User Agent
Service REST API.

# Overview

The User Agent Service provides two sub-components intended to back an
abstract conception of browsing: an HTTP REST API to allow bulk access
to data, and a light WebSocket API to push incremental changes to
clients.  The WebSocket API will be documented separately.

The abstract conception of browsing introduces two high-level
concepts, _scopes_ and _sessions_.  Roughly speaking, a _scope_
identifies a logical or conceptual grouping of browsing behaviour.
For Tofino, a scope corresponds to an open browser window; for a
mobile search activity, a scope might correspond to a single
interaction with the main activity.  A _session_ identifies a single
browsing context.  It takes place within a scope (put differently,
scopes encapsulate sessions) and may have a logical _ancestor
session_.  For Tofino, a session corresponds to a single tab; a tab
spawned by clicking a link with "target=_blank" would correspond to a
new session with the original tab as it's ancestor session.

Scopes are currently allocated as new sessions in Tofino.
Alternatively, use any fixed integer scope (such as scope 0).

Full-text indexing is currently opt-in: see
[POST /v1/pages](#post-v1pages).  The data store will return
snippets, which for now are HTML escaped string with bold tags
wrapping highlighted words.  It's safe to use `innerHTML` and
friends to render snippets in privileged UI.

Throughout, timestamps are integer microseconds since the Unix epoch.
Note that this is *not* the output of JavaScript's `Date.now()`!  Use
a higher-resolution timing library, or (in a pinch) approximate
microseconds using `1000 * Date.now()`.  The decision to use
microseconds maintains compatibility with Firefox's Places database,
which uses microseconds internally.

## URL Structure

All requests will be to URLs for the form:

    http[s]://<server-url>/v1/<api-endpoint>

Note that:

* The URL embeds a version identifier "v1"; future revisions of this
  API may introduce new version numbers.
* The base URL of the server may be configured on a per-client basis.
* At this time, there is no requirement for API access to be over a
  properly-validated HTTPS connection.

## Request Format

All POST requests must have a content-type of `application/json` with
a utf8-encoded JSON body, and should specify the content-length
header.  Most requests include body parameters, but some have query
parameters.  Over time we intend to migrate to all body parameters, to
be consistent with other Mozilla services.

## Response Format

All successful requests will produce a response with HTTP status code
of "200" and content-type of "application/json".  The structure of the
response body will depend on the endpoint in question.

Failures due to invalid behavior from the client will produce a
response with HTTP status code in the "4XX" range and content-type of
"application/json".  Failures due to an unexpected situation on the
server will produce a response with HTTP status code in the "5XX"
range and content-type of "application/json".

### Page Object Format

Many requests will produce a JSON object representing a page, or a
JSON array of such page objects.  Each such page object will contain
keys

* url - (string) URL of the page
* lastVisited - (integer) timestamp of the last visit to the page
* title - (optional string) last recorded title of the page
* snippet - (optional string) last summary snippet extracted from the page

---

TODO: diffs WebSocket API documentation

---

# API Endpoints

* Sessions
    * [POST /v1/sessions/start](#post-v1sessionsstart)
    * [POST /v1/sessions/end](#post-v1sessionsend)

* History visits
    * [POST /v1/visits](#post-v1visits)
    * [GET /v1/visits](#get-v1visits)

* Page details
    * [POST /v1/pages](#post-v1pages)
    * [GET /v1/query](#get-v1query)

* Stars
    * [POST /v1/stars/star](#post-v1starsstar)
    * [POST /v1/stars/unstar](#post-v1starsunstar)
    * [GET /v1/stars](#get-v1stars)

## POST /v1/sessions/start

Start a new browsing session.  A session roughly corresponds to a tab.

___Body parameters___

* scope - (optional) integer session ID to mark as the scope of this session.
* ancestor - (optional) integer session ID to mark as the ancestor of this session.

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/sessions/start" \
-d '{
  "scope": 0,
  "session: 100
}'
```

### Response

Successful requests will produce a "200 OK" response with the
allocated session ID in the JSON body:

```json
{
  "session": 101
}
```

## POST /v1/sessions/end

End an existing browsing session.  A session roughly corresponds to a tab.

___Body parameters___

* session - integer session ID to end.

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/sessions/end \
-d '{
  "session: 100
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## POST /v1/visits

Record a visit to a URL, optionally adding a title event to that URL.

___Body parameters___

* session - integer session ID to associate visit with.
* url - string URL to visit.
* title (optional) - string title of visited URL.

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/visits \
-d '{
  "session: 100,
  "url": "https://www.mozilla.org/en-US/firefox/new/",
  "title": "Download Firefox - Free Web Browser",
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## GET /v1/visits

Return visits to all URLs, optionally limiting the number of visits
returned.  See also [GET /v1/query](#get-v1query).

___Query parameters___

* limit - (optional) integer maximum number of visits to return; default: no limit.

### Request

```sh
curl -v \
-X GET \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/visits?limit=10 \
-d '{
}'
```

### Response

Successful requests will produce a "200 OK" response with a JSON body
containing a `results` array of [page objects](#page-object-format):

```json
{
  "results": [
    {
      "url": "https://www.mozilla.org/en-US/firefox/new/",
      "title": "Download Firefox - Free Web Browser",
      "lastVisited": 14000000,
      "snippet": "HTML escaped string with <b>bold tags</b> wrapping highlighted words"
    },
    {
      "url": "https://reddit.com/",
      "title": "reddit - the front page of the internet",
      "lastVisited": 15000000
    }
  ]
}
```

## POST /v1/pages

Add captured text content for a URL.

___Body parameters___

* url - string URL to associate text content with.
* session - integer session ID to associate captured text content with.
* page - page content (see example below).

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/pages \
-d '{
  "session": 101,
  "url": "https://reddit.com/",
  "page": {
    "title": "reddit - the front page of the internet",
    "excerpt": <string excerpt, for example as extracted by Readability.js>,
    "textContent": <string full text content, for example as extracted by Readability.js>
  }
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## GET /v1/query

Search for URLs, titles, and text content matching a query string,
optionally limiting the number of visits to return.

___Query parameters___

* q - string query to search for.
* limit - (optional) integer maximum number of visits to return; default: no limit.
* since - (optional) integer timestamp; if present, only return
  results more recently visited than this.
* snippetSize - (optional) string, one of "tiny", "medium", "large",
  "huge".  Defaults to "medium".

### Request

```sh
curl -v \
-X GET \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/query?q=reddit&limit=10&since=13000000&snippetSize=-15
```

### Response

Successful requests will produce a "200 OK" response with a JSON body
containing a `results` array of [page objects](#page-object-format):

```json
{
  "results": [
    {
      "url": "https://reddit.com/",
      "title": "reddit - the front page of the internet",
      "lastVisited": 15000000,
      "snippet": "HTML escaped string with <b>bold tags</b> wrapping highlighted words"
    }
  ]
}
```

## POST /v1/stars/star

Mark the given URL as starred.

___Body parameters___

* url - string URL to star.
* session - integer session ID to associate star action with.
* title (optional) - string title of starred URL.

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/stars/star \
-d '{
  "session": 101,
  "url": "https://reddit.com/",
  "title": "reddit - the front page of the internet"
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## POST /v1/stars/unstar

Mark the given URL as not starred.

___Body parameters___

* url - string URL to unstar.
* session - integer session ID to associate unstar action with.

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/stars/unstar \
-d '{
  "session": 101,
  "url": "https://reddit.com/"
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## GET /v1/stars

Get currently starred URLs, ordered from most to least recently
starred, optionally limiting the number of starred URLs returned.

___Query parameters___

* limit - (optional) integer maximum number of starred URLs to return; default: no limit.

### Request

```sh
curl -v \
-X GET \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/stars?limit=10"
```

### Response

Successful requests will produce a "200 OK" response with a JSON body
containing a `results` array of [page objects](#page-object-format):

```json
{
  "results": [
    {
      "url": "https://reddit.com/",
      "title": "reddit - the front page of the internet",
      "lastVisited": 15000000
    },
    {
      "url": "https://www.mozilla.org/en-US/firefox/new/",
      "title": "Download Firefox - Free Web Browser",
      "lastVisited": 14000000
    }
  ]
}
```

# Implementation

https://github.com/mozilla/tofino/blob/master/app/services/user-agent-service/server.js

# Example client

https://github.com/mozilla/tofino/blob/master/app/ui/browser/lib/user-agent-http-client.js
