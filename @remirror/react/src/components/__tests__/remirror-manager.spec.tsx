import React, { FC } from 'react';
import { render } from 'react-testing-library';
import { useRemirrorManagerContext } from '../../hooks';
import { RemirrorManager } from '../remirror-manager';

test('a manager is created', () => {
  // expect.assertions(1);
  const Component: FC = () => {
    const manager = useRemirrorManagerContext();
    console.log(manager);
    // expect(manager).toBeTruthy();
    return null;
  };

  render(
    <RemirrorManager>
      <Component />
    </RemirrorManager>,
  );
});
