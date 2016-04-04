/* eslint func-names: 0 */

/**
 * React doesn't support non-HTML attributes unless the element is a custom
 * element which must have a hyphen in the tag name. This means React can't
 * render most of the attributes of a <webview> so we use this <web-view> as a
 * wrapper.
 */
(function() {
  class WebView extends HTMLElement {
    createdCallback() {
      const shadow = this.createShadowRoot();

      this.webview = document.createElement('webview');
      for (let i = 0; i < this.attributes.length; i++) {
        const attr = this.attributes[i];
        this.webview.setAttribute(attr.name, attr.value);
      }

      shadow.appendChild(this.webview);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue) {
        this.webview.setAttribute(name, newValue);
      } else {
        this.webview.removeAttribute(name);
      }
    }
  }

  document.registerElement('web-view', WebView);
}());
