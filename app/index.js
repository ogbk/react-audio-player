import React from 'react';
import { render } from 'react-dom';

import { App } from './components/App';

require('./sass/styles.sass');

render(
  <App />,
  window.document.getElementById('root'),
);
