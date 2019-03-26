import { Placeholder, PlaceholderOptions } from '@remirror/core-extensions';
import React from 'react';
import { render } from 'react-testing-library';
import { ExtensionComponent } from '../remirror-extension';

test('simple', () => {
  render(<ExtensionComponent<PlaceholderOptions> Constructor={Placeholder} emptyNodeClass='empty' />);
});
