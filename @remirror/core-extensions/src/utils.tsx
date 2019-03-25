import { Cast, Extension, SimpleExtensionConstructor } from '@remirror/core';
import React, { Component, ComponentClass } from 'react';

export interface BaseExtensionComponentProps {
  /**
   * Sets the priority for the extension. Lower number means the extension is loaded first and gives it priority.
   * `-1` is loaded before `0` and will overwrite any conflicting configuration.
   *
   * Base extensions are loaded with a priority of 1.
   *
   * @default 2
   */
  priority?: number;
  children?: never;
}

export type ExtensionComponentProps<GOptions extends {}> = BaseExtensionComponentProps & GOptions;

export interface RegisterExtensionParams<GOptions extends {}> {
  /** The extension identifier */
  id: symbol;
  /** The instance of the extension with the options applied */
  extension: Extension<GOptions>;
  /** The priority index for the extension */
  priority: number;
}

export type RegisterExtension<GOptions extends {}> = (params: RegisterExtensionParams<GOptions>) => void;

export type RemirrorComponentClass<P extends {}, GOptions extends {}> = ComponentClass<P> & {
  /**
   * The id for this component
   */
  $$remirrorId: symbol;
  /**
   * Injected into the static properties at mount time to register the extension
   */
  registerExtension: RegisterExtension<GOptions>;
};

class Cmp<GOptions extends {}> extends Component<ExtensionComponentProps<GOptions>> {
  public render() {
    return null;
  }
}

/**
 * Creates an extension component from the provided constructor
 *
 * ```ts
 * const Component = extensionComponent<SimpleOptions, typeof Simple>(Simple);
 * ```
 *
 * @param Constructor
 */
export const createExtensionComponent = <
  GOptions extends {},
  GConstructor extends SimpleExtensionConstructor<GOptions, Extension<GOptions>>
>(
  Constructor: GConstructor,
) => {
  class EnhancedComponent extends Component<ExtensionComponentProps<GOptions>> {
    public static $$remirrorId = Symbol(Constructor.name);

    /** An identifier to let us know that this component is an inbuilt remirror class */
    public static $$remirror = true;

    /**
     * Auto injected at runtime by the Extension
     */
    public static readonly registerExtension: RegisterExtension<GOptions>;

    public render() {
      const { children: _, priority = 2, ...options } = this.props;
      const extension = new Constructor(Cast<GOptions>(options));
      EnhancedComponent.registerExtension({ extension, id: EnhancedComponent.$$remirrorId, priority });

      // Non rendering component
      return <Cmp<{ team: boolean }> team={false} priority={1} />;
    }
  }

  return EnhancedComponent as RemirrorComponentClass<ExtensionComponentProps<GOptions>, GOptions>;
};
