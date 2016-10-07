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

import { protocol, app } from 'electron';
import tmp from 'tmp';
import thenify from 'thenify';
import fs from 'fs-promise';
import childProcess from 'child_process';
import * as endpoints from '../shared/constants/endpoints';

const mktmp = thenify(tmp.file);
const exec = thenify(childProcess.exec);
const tofinoColonSlash = new RegExp(`^${endpoints.TOFINO_PROTOCOL}:/`);

export const DEFAULT_PROTOCOLS = ['http', 'https', endpoints.TOFINO_PROTOCOL];

export function registerStandardSchemes() {
  protocol.registerStandardSchemes(DEFAULT_PROTOCOLS);
}

/**
 * Registers the protocol for `tofino://*` pages. Must be called after
 * app's 'ready' event.
 *
 * @TODO Proxy valid `chrome://*` URIs to `tofino://*`?
 *   https://github.com/electron/electron/issues/2618
 */
export function registerHttpProtocols() {
  protocol.registerHttpProtocol(endpoints.TOFINO_PROTOCOL, (request, callback) => {
    const redirectPath = request.url
      .replace(tofinoColonSlash, `${endpoints.CONTENT_SERVER_HTTP}`);

    callback({
      method: request.method,
      referrer: request.referrer,
      url: redirectPath,
    });
  }, e => { if (e) { throw e; } });
}

export function setDefaultBrowser() {
  const success = [];
  for (const p of DEFAULT_PROTOCOLS) {
    success.push(app.setAsDefaultProtocolClient(p));
  }

  return success.every(s => s);
}

export function isDefaultBrowser() {
  return DEFAULT_PROTOCOLS.every(p => app.isDefaultProtocolClient(p));
}

async function mergeRegistry(text) {
  const [path, fd] = await mktmp();

  await fs.write(fd, text, 0, 'utf8');
  await fs.close(fd);
  await exec(`regedit.exe /s ${path}`);
}

export async function addToWindowsRegistry() {
  const exepath = process.execPath.replace(/\\/g, '\\\\');
  await mergeRegistry(`Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\TofinoHTML]
@="Tofino HTML Document"

[HKEY_CLASSES_ROOT\\TofinoHTML\\DefaultIcon]
@="${exepath},0"

[HKEY_CLASSES_ROOT\\TofinoHTML\\shell]

[HKEY_CLASSES_ROOT\\TofinoHTML\\shell\\open]

[HKEY_CLASSES_ROOT\\TofinoHTML\\shell\\open\\command]
@="\\"${exepath}\\" -- \\"%1\\""

[HKEY_CURRENT_USER\\SOFTWARE\\Classes\\TofinoHTML]
@="Tofino HTML Document"

[HKEY_CURRENT_USER\\SOFTWARE\\Classes\\TofinoHTML\\DefaultIcon]
@="${exepath},0"

[HKEY_CURRENT_USER\\SOFTWARE\\Classes\\TofinoHTML\\shell]

[HKEY_CURRENT_USER\\SOFTWARE\\Classes\\TofinoHTML\\shell\\open]

[HKEY_CURRENT_USER\\SOFTWARE\\Classes\\TofinoHTML\\shell\\open\\command]
@="\\"${exepath}\\" -- \\"%1\\""

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino]
@="Tofino"

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\Capabilities]
"ApplicationDescription"="Project Tofino"
"ApplicationName"="Tofino"

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\Capabilities\\FileAssociations]
".htm"="TofinoHTML"
".html"="TofinoHTML"
".shtml"="TofinoHTML"
".xht"="TofinoHTML"
".xhtml"="TofinoHTML"
".webp"="TofinoHTML"

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\Capabilities\\StartMenu]
"StartMenuInternet"="Tofino"

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\Capabilities\\URLAssociations]
"ftp"="TofinoHTML"
"http"="TofinoHTML"
"https"="TofinoHTML"

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\InstallInfo]
"IconsVisible"=dword:00000001

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\shell]

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\shell\\open]

[HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino\\shell\\open\\command]
@="${exepath}"

[HKEY_CURRENT_USER\\SOFTWARE\\RegisteredApplications]
"Tofino"="Software\\\\Clients\\\\StartMenuInternet\\\\Tofino\\\\Capabilities"
`);
}

export async function removeFromWindowsRegistry() {
  await mergeRegistry(`Windows Registry Editor Version 5.00

[-HKEY_CLASSES_ROOT\\TofinoHTML]

[-HKEY_CURRENT_USER\\SOFTWARE\\Classes\\TofinoHTML]

[-HKEY_CURRENT_USER\\SOFTWARE\\Clients\\StartMenuInternet\\Tofino]

[HKEY_CURRENT_USER\\SOFTWARE\\RegisteredApplications]
"Tofino"=-
`);
}
