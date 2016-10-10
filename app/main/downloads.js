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

export function registerDownloadHandlers(bw) {
  bw.webContents.session.on('will-download', (event, item) => {
    const itemData = {
      url: item.getURL(),
      filename: item.getFilename(),
    };
    item.once('done', (_event, state) => {
      if (state === 'completed') {
        bw.send('download-completed', itemData);
      } else if (state === 'interrupted') {
        bw.send('download-error', itemData);
      }
    });
  });
}
