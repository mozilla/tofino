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

/**
 * The following are rules custom to Tofino. Many can probably be rolled into
 * page-metadata-parser once we have a good feeling of what we're doing.
 * The `buildRuleset` function is copied from `page-metadata-parser`, we should
 * also consider contributing an easy way in p-m-p to add rules without requiring
 * fathom.
 */

import { dom, rule, ruleset } from 'fathom-web';

function buildRuleset(name, rules) {
  const reversedRules = Array.from(rules).reverse();
  const builtRuleset = ruleset(...reversedRules.map(([query, handler], order) => rule(
    dom(query),
    node => [{
      score: order,
      flavor: name,
      notes: handler(node),
    }]
  )));

  return doc => {
    const kb = builtRuleset.score(doc);
    const maxNode = kb.max(name);
    if (maxNode) {
      const value = maxNode.flavors.get(name);
      if (value) {
        return value.trim();
      }
    }
    return void 0;
  };
}

/**
 * !!! If you add a new rule here, you should make sure it's also
 * in the page model in app/browser/ui/browser/model/index.js
 */
const metadataRules = {
  // This is a hacky metadata parsing mostly for testing now.
  player_url: buildRuleset('player_url', [
    ['meta[property="twitter:player"]', node => node.element.content],
  ]),
  player_stream_url: buildRuleset('player_stream_url', [
    ['meta[property="twitter:player:stream"]', node => node.element.content],
  ]),
  player_stream_content_type: buildRuleset('player_stream_content_type', [
    ['meta[property="twitter:player:stream:content_type"]', node => node.element.content],
  ]),
};

export default metadataRules;
