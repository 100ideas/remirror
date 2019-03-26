import { Placeholder } from '@remirror/core-extensions';
import React from 'react';
import { render } from 'react-testing-library';
import { RemirrorExtension } from '../remirror-extension';

const unregister = jest.fn();
const inject = {
  registerExtension: jest.fn(() => unregister),
};

test('can instantiate different extensions', () => {
  const { unmount } = render(
    <RemirrorExtension Constructor={Placeholder} emptyNodeClass='empty' {...inject} />,
  );

  expect(inject.registerExtension).toBeCalledWith(
    expect.objectContaining({ id: expect.anything(), extension: expect.any(Placeholder), priority: 2 }),
  );
  unmount();
  expect(unregister).toHaveBeenCalled();
});
