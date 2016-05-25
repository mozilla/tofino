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

export const UA_SERVICE_ADDR = 'localhost';
export const UA_SERVICE_PORT = 9090;
export const UA_SERVICE_VERSION = 'v1';

export const UA_SERVICE_HTTP = `http://${UA_SERVICE_ADDR}:${UA_SERVICE_PORT}/${UA_SERVICE_VERSION}`;
export const UA_SERVICE_WS = `ws://${UA_SERVICE_ADDR}:${UA_SERVICE_PORT}/${UA_SERVICE_VERSION}/ws`;
