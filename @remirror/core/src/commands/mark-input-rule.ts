import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';
import { isFunction } from '../helpers';
import { Attrs } from '../types';

/**
 * Creates an input rule based on the provided regex for the provided mark type
 *
 * @param param
 */
export const markInputRule = (
  regexp: RegExp,
  markType: MarkType,
  getAttrs?: ((attrs: string[]) => Attrs) | Attrs,
) => {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = isFunction(getAttrs) ? getAttrs(match) : getAttrs;
    const { tr } = state;
    let markEnd = end;

    if (match[1]) {
      const startSpaces = match[0].search(/\S/);
      const textStart = start + match[0].indexOf(match[1]);
      const textEnd = textStart + match[1].length;
      if (textEnd < end) {
        tr.delete(textEnd, end);
      }
      if (textStart > start) {
        tr.delete(start + startSpaces, textStart);
      }
      markEnd = start + startSpaces + match[1].length;
    }

    tr.addMark(start, markEnd, markType.create(attrs));
    tr.removeStoredMark(markType); // Do not continue with mark.
    return tr;
  });
};
