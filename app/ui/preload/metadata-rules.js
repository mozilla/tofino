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
        return value.trim ? value.trim() : value;
      }
    }
    return void 0;
  };
}

const mapToContentOrText = node => node.element.content || node.element.innerText;
const parseIntText = node => parseInt(node.element.innerText, 10);
const parseFloatText = node => parseFloat(node.element.innerText, 10);

/**
 * !!! If you add a new rule here, you should make sure it's also
 * in the page model in app/browser/ui/browser/model/index.js
 */
const metadataRules = {
  // Overwrite pmp's icon_url ruleset, and add a few more additional rules
  icon_url: buildRuleset('icon_url', [
    ['link[rel="apple-touch-icon"]', node => node.element.href],
    ['link[rel="apple-touch-icon-precomposed"]', node => node.element.href],
    ['link[rel="icon"]', node => node.element.href],
    ['link[rel="fluid-icon"]', node => node.element.href],
    ['link[rel="shortcut icon"]', node => node.element.href],
    ['link[rel="Shortcut Icon"]', node => node.element.href],
    ['link[rel="mask-icon"]', node => node.element.href],
    // Fallback to just checking root favicon.ico
    ['body', node => `${node.element.ownerDocument.location.origin}/favicon.ico`],
  ]),

  // title takes some properties from page-metadata-parser,
  // and adds additional rules, like for Amazon.
  title: buildRuleset('title', [
    ['meta[property="og:title"]', node => node.element.content],
    ['meta[property="twitter:title"]', node => node.element.content],
    ['meta[name="hdl"]', node => node.element.content],
    // Amazon
    ['#productTitle', node => node.element.innerText],
    ['title', node => node.element.text],
  ]),

  // image_url takes some properties from page-metadata-parser,
  // and adds additional rules, like for Amazon.
  image_url: buildRuleset('image_url', [
    ['meta[property="og:image"]', node => node.element.content],
    ['meta[property="twitter:image"]', node => node.element.content],
    ['meta[name="thumbnail"]', node => node.element.content],
    // amazon
    ['#landingImage', node => node.element.src],
    // Comment out `img` because not sure how this beats out #landingImage on
    // Amazon pages, even when after it in list?
    // ['img', node => node.element.src],
  ]),

  rating: buildRuleset('rating', [
    ['[itemprop="aggregateRating"] [itemprop="ratingValue"]', mapToContentOrText],
    // amazon
    ['#reviewStarsLinkedCustomerReviews span', parseFloatText],
  ]),
  best_rating: buildRuleset('best_rating', [
    ['[itemprop="aggregateRating"] [itemprop="bestRating"]', mapToContentOrText],
  ]),
  worst_rating: buildRuleset('worst_rating', [
    ['[itemprop="aggregateRating"] [itemprop="worstRating"]', mapToContentOrText],
  ]),
  review_count: buildRuleset('review_count', [
    ['[itemprop="aggregateRating"] [itemprop="reviewCount"]', mapToContentOrText],
    // amazon
    ['#acrCustomerReviewText', parseIntText],
  ]),
};

export default metadataRules;
