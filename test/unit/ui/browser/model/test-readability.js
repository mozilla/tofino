// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import jsdom from 'jsdom';

import Readability from '../../../../../app/shared/preload/readability.js';

describe('Readability', () => {
  it('Is barely functional', (done) => {
    const sampleDoc = `
<html>
<head>
<title>Hello, world</title>
</head>
<body>
<div class="main">
<h1 class="header">The article goes here</h1>
<div class="article">
Here is some text
<p>Here is a paragraph <b>with bold</b> and
lots and lots and lots and lots of text
and lots more and lots more
and lots and lots and lots</p>
<p>Here is a paragraph <b>with bold</b> and
lots and lots and lots and lots of text
and lots more and lots more
and lots and lots and lots</p>
<p>Here is a paragraph <b>with bold</b> and
lots and lots and lots and lots of text
and lots more and lots more
and lots and lots and lots</p>
and some more
<p>Here is a paragraph <b>with bold</b> and
lots and lots and lots and lots of text
and lots more and lots more
and lots and lots and lots</p>
and some more
<p>Here is a paragraph <b>with bold</b> and
lots and lots and lots and lots of text
and lots more and lots more
and lots and lots and lots</p>
and some more
<p>Here is a paragraph <b>with bold</b> and
lots and lots and lots and lots of text
and lots more and lots more
and lots and lots and lots</p>
and some more
<ul><li>Hello</li><li>World</li></ul>
Eat
</div>
</div>
</body>
</html>`;
    jsdom.env({
      html: sampleDoc,
      url: 'http://example.com/foo/',
      done: (errors, window) => {
        const result = new Readability(
          'http://example.com/foo/',
          window.document).parse();
        expect(result.title).toBe('Hello, world');
        expect(result.excerpt).toBe('Here is some text');
        expect(result.textContent).toMatch(
          /^Here is some text\n\n\nHere is a paragraph with bold and\nlots/);
        done();
      },
    });
  });
});
