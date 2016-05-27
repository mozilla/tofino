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

function showHistoryResults(visited) {
  const ul = document.getElementById('history');

  while (ul.hasChildNodes()) {
    ul.removeChild(ul.lastChild);
  }

  visited.forEach(page => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = page.uri;
    a.title = page.title || page.uri;
    a.appendChild(document.createTextNode(page.title || page.uri));
    li.appendChild(a);
    li.appendChild(document.createElement('br'));
    if (page.snippet) {
      const p = document.createElement('p');
      p.className = 'excerpt';
      p.appendChild(document.createTextNode(page.snippet));
      li.appendChild(p);
    }
    ul.appendChild(li);
  });
}

function handleHistoryQuery(e) {
  e.preventDefault();
  const q = document.search.filter.value;
  if (q) {
    window._browser.query(q, undefined, 20, 'large').then(showHistoryResults);
  } else {
    fetchRecentHistory();
  }
}

export function bindHistorySearch() {
  document.getElementById('search').addEventListener('keyup', handleHistoryQuery);
}

export function fetchRecentHistory() {
  window._browser.visited(200).then(showHistoryResults);
}
