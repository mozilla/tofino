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
[POST /v1/pages/:url](#post-v1pagesurl).  The data store will return
snippets, which for now are HTML escaped string with bold tags
wrapping highlighted words.  It's safe to use `innerContent` and
friends to render snippets in privileged UI.

Throughout, timestamps are integer milliseconds since the Unix epoch.

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

---

TODO: diffs WebSocket API documentation

---

# API Endpoints

* Sessions
    * [POST /v1/session/start](#post-v1sessionstart)
    * [POST /v1/session/end](#get-v1sessionend)

* History visits
    * [POST /v1/visits](#post-v1visits)
    * [GET /v1/visits](#get-v1visits)

* Page details
    * [POST /v1/pages/:url](#post-v1pagesurl)
    * [GET /v1/query](#get-v1query)

* Stars
    * [PUT /v1/stars/:url](#put-v1starsurl)
    * [DELETE /v1/stars/:url](#delete-v1starsurl)
    * [GET /v1/stars](#get-v1stars)
    * [GET /v1/recentStars](#get-v1recentstars)

## POST /v1/session/start

Start a new browsing session.  A session roughly corresponds to a tab.

___Body parameters___

* scope - (optional) integer session ID to mark as the scope of this session.
* ancestor - (optional) integer session ID to mark as the ancestor of this session.

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/session/start" \
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

## POST /v1/session/end

End an existing browsing session.  A session roughly corresponds to a tab.

___Body parameters___

* session - integer session ID to end.

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/session/end \
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
"http://localhost:9090/v1/session/end \
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

* limit - (optional) integer maximum number of visits to return.

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
containing a pages array.  Each page will contain keys `url` (string),
and `lastVisited` (integer timestamp), optional `title` (string), and
optional `snippet` (string).

```json
{
  "pages": [
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
    },
  ]
}
```

## POST /v1/pages/:url

Add captured text content for a URL.

___URL parameters___

* url - string URL to associate text content with.

___Body parameters___

* session - integer session ID to associate captured text content with.
* page - page content (see example below).

### Request

```sh
curl -v \
-X POST \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/pages/https%3A%2F%2Freddit.com%2F%26test%3D%202 \
-d '{
  "session": 101,
  "page": {
    "title": "reddit - the front page of the internet",
    "excerpt": <string excerpt, for example as extracted by Readability.js>,
    "textContent": <string full text content, for example as extracted by Readability.js>,
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## GET /v1/query

Search for URLs, titles, and text content matching a query string.

___Query parameters___

* q - string query to search for.
* limit - (optional) integer maximum number of results to return.
* since - (optional) integer timestamp; if present, only return
  results more recently visited than this.
* snippetSize - (optional) integer, one of -5/-15/-40/-64 for tiny,
  medium, large, and huge snippet extracts, respectively.  In the
  future, we will clarify this -- right now, it's a direct translation
  to SQLite's numeric range.

### Request

```sh
curl -v \
-X GET \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/query?q=reddit&limit=10&since=13000000&snippetSize=-15
```

### Response

Successful requests will produce a "200 OK" response with a `results`
array in the JSON body:

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

## PUT /v1/stars/:url

Mark the given URL as starred.

___URL parameters___

* url - string URL to star.

___Body parameters___

* session - integer session ID to associate star action with.
* title (optional) - string title of starred URL.

### Request

```sh
curl -v \
-X PUT \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/stars/https%3A%2F%2Freddit.com%2F%26test%3D%202 \
-d '{
  "session": 101,
  "title": "reddit - the front page of the internet"
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## DELETE /v1/stars/:url

Mark the given URL as not starred.

___URL parameters___

* url - string URL to unstar.

___Body parameters___

* session - integer session ID to associate unstar action with.

### Request

```sh
curl -v \
-X DELETE \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/stars/https%3A%2F%2Freddit.com%2F%26test%3D%202 \
-d '{
  "session": 101
}'
```

### Response

Successful requests will produce a "200 OK" response with an empty JSON body:

```json
{
}
```

## GET /v1/stars

Get the currently starred URLs.

### Request

```sh
curl -v \
-X GET \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/stars
```

### Response

Successful requests will produce a "200 OK" response with an array
`stars` in the JSON body:

```json
{
  "stars": [
    "https://www.mozilla.org/en-US/firefox/new/",
    "https://reddit.com/"
  ]
}
```

## GET /v1/recentStars

Get recently starred URLs, ordered from most to least recent.

___Query parameters___

* limit - (optional) integer maximum number of starred URLs to return.

### Request

```sh
curl -v \
-X GET \
-H "Content-Type: application/json" \
"http://localhost:9090/v1/recentStars?limit=10"
```

### Response

Successful requests will produce a "200 OK" response with an array
`stars` in the JSON body:

```json
{
  "stars": [
    {
      "url": "https://reddit.com/",
      "title": "reddit - the front page of the internet",
      "visitedAt": 15000000
    },
    {
      "location": "https://www.mozilla.org/en-US/firefox/new/",
      "title": "Download Firefox - Free Web Browser",
      "lastVisited": 14000000
    }
  ]
}
```

# Implementation

https://github.com/mozilla/tofino/blob/master/app/services/user-agent-service/server.js

# Example client

https://github.com/mozilla/tofino/blob/master/app/ui/browser/lib/user-agent.js
