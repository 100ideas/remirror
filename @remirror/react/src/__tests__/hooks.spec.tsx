import React, { FC } from 'react';

import { injectedPropsShape, positionerShape } from '@test-fixtures/object-shapes';
import { createTestManager } from '@test-fixtures/schema-helpers';
import { render } from 'react-testing-library';
import { RemirrorEditorProvider } from '../components/providers';
import { usePositioner, useRemirrorContext } from '../hooks';
import { bubblePositioner } from '../positioners';

test('useRemirrorContext', () => {
  expect.assertions(1);
  const HookComponent: FC = () => {
    const injectedProps = useRemirrorContext();
    expect(injectedProps).toMatchObject(injectedPropsShape);
    return <div />;
  };

  render(
    <RemirrorEditorProvider manager={createTestManager()}>
      <HookComponent />
    </RemirrorEditorProvider>,
  );
});

test('usePositioner', () => {
  expect.assertions(1);
  const HookComponent: FC = () => {
    const injectedProps = usePositioner({ positioner: bubblePositioner, positionerId: 'bubble-menu' });
    expect(injectedProps).toMatchObject(positionerShape);
    return <div />;
  };

  render(
    <RemirrorEditorProvider manager={createTestManager()}>
      <HookComponent />
    </RemirrorEditorProvider>,
  );
});
