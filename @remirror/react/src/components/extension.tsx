import { Cast, Extension, SimpleExtensionConstructor } from '@remirror/core';
import { Component } from 'react';
import { ExtensionComponentProps, RemirrorType } from '../types';

export class ExtensionComponent<
  GOptions extends {},
  GExtension extends Extension<GOptions, any> = Extension<GOptions, any>,
  GConstructor extends SimpleExtensionConstructor<GOptions, GExtension> = SimpleExtensionConstructor<
    GOptions,
    GExtension
  >,
  GProps extends ExtensionComponentProps<GOptions, GExtension, GConstructor> = ExtensionComponentProps<
    GOptions,
    GExtension,
    GConstructor
  >
> extends Component<GProps> {
  public static $$remirror = {
    type: RemirrorType.Extension,
  };

  public static defaultProps = { registerExtension: () => () => {} };

  private id = Symbol(this.props.Constructor.name);

  private unregisterExtension!: () => void;

  public componentWillUnmount() {
    this.unregisterExtension();
  }

  /**
   * A component that renders nothing but registers the extension every time it is called
   */
  public render() {
    const { Constructor, registerExtension, children: _, priority = 2, ...options } = this.props;
    const extension = new Constructor(Cast<GOptions>(options));
    this.unregisterExtension = registerExtension({ extension, id: this.id, priority });

    return null;
  }
}
