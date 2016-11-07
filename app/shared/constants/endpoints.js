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

import BUILD_CONFIG from '../../build-config';

export const TOFINO_PROTOCOL = 'tofino';

export const HISTORY_RESTORE_ADDR = `${TOFINO_PROTOCOL}://historyrestore`;

export const UA_SERVICE_ADDR = 'localhost';
export const UA_SERVICE_PORT = BUILD_CONFIG.packaged ? 9091 : 9090;
export const UA_SERVICE_VERSION = 'v1';

export const UA_SERVICE_ORIGIN = `http://${UA_SERVICE_ADDR}:${UA_SERVICE_PORT}`;
export const UA_SERVICE_HTTP = `${UA_SERVICE_ORIGIN}/${UA_SERVICE_VERSION}`;
export const UA_SERVICE_WS = `ws://${UA_SERVICE_ADDR}:${UA_SERVICE_PORT}/${UA_SERVICE_VERSION}/ws`;

export const CONTENT_SERVER_ADDR = 'localhost';
export const CONTENT_SERVER_PORT = BUILD_CONFIG.packaged ? 9192 : 9191;
export const CONTENT_SERVER_VERSION = 'v1';

export const CONTENT_SERVER_ORIGIN = `http://${CONTENT_SERVER_ADDR}:${CONTENT_SERVER_PORT}`;
export const CONTENT_SERVER_HTTP = `${CONTENT_SERVER_ORIGIN}/${CONTENT_SERVER_VERSION}`;
