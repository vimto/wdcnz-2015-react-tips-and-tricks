require('babel/polyfill');
import React from 'react/addons';
import Router from './router';
import attachFastClick from 'fastclick';
import Flux from './flux';
import Diagnostics from './diagnostics.coffee';
import {loadAllFonts} from './lib/fonts/font-manager';

Diagnostics.setup();

Router.run((Handler) => {
  React.render(<Handler flux={Flux}/>, document.getElementById('wrapper'));
});

loadAllFonts();

// Prevent the click delay on devices that support touch events
// This will do nothing if the device doesn't support touch input
attachFastClick(global.document.body);

// Enable React dev tools in Chrome
global.React = React;
