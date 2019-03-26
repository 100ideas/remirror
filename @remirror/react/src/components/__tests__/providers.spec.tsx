import React from 'react';

import { omit } from '@remirror/core';
import { injectedPropsShape, positionerShape } from '@test-fixtures/object-shapes';
import { createTestManager } from '@test-fixtures/schema-helpers';
import { render } from 'react-testing-library';
import { bubblePositioner } from '../../positioners';
import { RemirrorEditorProvider, withPositioner, withRemirror } from '../providers';

test('withRemirror', () => {
  const mock = jest.fn();
  const Cmp = withRemirror(props => {
    mock(props);
    return <div />;
  });

  render(
    <RemirrorEditorProvider manager={createTestManager()}>
      <Cmp />
    </RemirrorEditorProvider>,
  );

  expect(mock).toHaveBeenCalledWith(expect.objectContaining(injectedPropsShape));
});

test('withPositioner', () => {
  const mock = jest.fn();
  const Menu = withPositioner({ positioner: bubblePositioner, positionerId: 'bubble', refKey: 'altRef' })(
    props => {
      mock(props);
      return <div />;
    },
  );

  render(
    <RemirrorEditorProvider manager={createTestManager()}>
      <Menu />
    </RemirrorEditorProvider>,
  );

  expect(mock).toHaveBeenCalledWith(
    expect.objectContaining({ ...omit(positionerShape, ['ref']), altRef: expect.any(Function) }),
  );
});
