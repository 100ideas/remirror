import { Doc, ExtensionManager, Paragraph, Text } from '@remirror/core';
import { Bold, Italic, Placeholder, Underline, Blockquote } from '@remirror/core-extensions';
import minDocument from 'min-document';

export const helpers = {
  getEditorState: jest.fn(),
  getPortalContainer: jest.fn(),
};
export const extensions = [
  new Doc(),
  new Paragraph(),
  new Text(),
  new Bold(),
  new Italic(),
  new Underline(),
  new Placeholder(),
  new Blockquote(),
];
export const manager = new ExtensionManager(extensions, helpers.getEditorState, helpers.getPortalContainer);
export const schema = manager.createSchema();
export const plugins = manager.plugins({ schema, ...helpers });
export const testDocument = minDocument;
export const initialJson = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Better docs to come soon...',
        },
      ],
    },
  ],
};
