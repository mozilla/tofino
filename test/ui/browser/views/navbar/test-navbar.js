
// We need to make the actions/external not depend on electron for this to
// be testable outside of electron, but otherwise we could do ...

/*
import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import NavBar from '../../../../../ui/browser/views/navbar/navbar.jsx';
import { Page } from '../../../../../ui/browser/model/index';

describe('components', function() {
  describe('NavBar', function() {
    it('should render the empty case', function() {
      const wrapper = shallow(
        <NavBar page={null} dispatch={expect.createSpy()} />
      );

      expect(wrapper.html()).toEqual('<div id="browser-navbar"></div>');
    });

    it('should call onDelete', function() {
      const page = new Page({ location: 'https://www.mozilla.org' });
      const wrapper = shallow(
        <NavBar page={page} dispatch={expect.createSpy()} />
      );

      expect(wrapper.html()).toEqual('...');
    });
  });
});
*/
