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

// Getting Readability.js to work is a pain in the ass, so we fake it for now.

export function readerify(document) {
  const location = document.location;

  const base = location.pathname.substr(0, location.pathname.lastIndexOf('/') + 1);
  const uri = {
    spec: location.href,
    host: location.host,

    // TODO This is incomplete, needs username/password and port
    prePath: `${location.protocol}//${location.host}`,
    scheme: location.protocol.substr(0, location.protocol.indexOf(':')),
    pathBase: `${location.protocol}//${location.host}${base}`,
  };

  // document.cloneNode() can cause the webview to break (bug 1128774).
  // Serialize and then parse the document instead.
  const docStr = new XMLSerializer().serializeToString(document);
  return docStr;
}
