import React, { Children, cloneElement, Component, ReactElement } from 'react';

import { Doc, ExtensionManager, ExtensionMap, ExtensionMapValue, Paragraph, Text } from '@remirror/core';
import { Composition, History, Placeholder } from '@remirror/core-extensions';
import { RemirrorManagerContext } from '../contexts';
import { asDefaultProps, isManagedEditorProvider, isRemirrorExtensionComponent } from '../helpers';
import { RegisterExtension, RemirrorManagerProps } from '../types';

interface State {
  manager?: ExtensionManager;
  length: number;
}

export class RemirrorManager extends Component<RemirrorManagerProps, State> {
  public static defaultProps = asDefaultProps<RemirrorManagerProps>()({
    useBaseExtensions: true,
  });

  private get extensionComponents() {
    return Children.toArray(this.props.children).filter(isRemirrorExtensionComponent);
  }

  private get baseExtensions(): ExtensionMapValue[] {
    return this.props.useBaseExtensions ? baseExtensions : [];
  }

  private extensionMap: ExtensionMap = new Map();

  public state: State = {
    manager: undefined,
    length: this.extensionComponents.length,
  };

  private registerExtension: RegisterExtension<any> = ({ extension, id, priority }) => {
    console.log('registering extension', id, extension);
    // Check if this is the first time the extension is being added
    const update = this.extensionMap.has(id);

    this.extensionMap.set(id, { extension, priority });
    const entries = extensionMapToArray({ map: this.extensionMap, base: this.baseExtensions });

    this.setState(() => ({
      manager: ExtensionManager.create(entries),
      ...(update ? {} : { length: this.extensionComponents.length }),
    }));

    return this.unregisterExtension(id);
  };

  private unregisterExtension(id: symbol) {
    return () => {
      this.extensionMap.delete(id);
      this.setState({
        length: this.extensionComponents.length,
        manager: ExtensionManager.create(
          extensionMapToArray({ map: this.extensionMap, base: this.baseExtensions }),
        ),
      });
    };
  }

  private mapChildren() {
    const { children } = this.props;
    return Children.map(children, child => {
      const { manager } = this.state;

      // if (isValidElement(child) && isArray((child.props as any).children)) {}

      if (isRemirrorExtensionComponent(child)) {
        console.log('is remirror child', child, this.state);
        return mapExtensionComponent({ element: child, registerExtension: this.registerExtension });
      }

      if (isManagedEditorProvider(child)) {
        console.log('is managed editor', this.state);
        if (manager) {
          return child;
        }
        return null; // Render nothing while the manager has not yet been instantiated
      }

      // throw new Error(
      //   'Invalid element found in children of Remirror Manager. Please only use supported Remirror elements or a fragment.',
      // );
      return child;
    });
  }

  public shouldComponentUpdate(_nextProps: RemirrorManagerProps, nextState: State) {
    const { manager } = this.state;

    // No unnecessary updates
    if (manager && manager.isEqual(nextState.manager)) {
      return false;
    }

    return true;
  }

  public render() {
    const { manager } = this.state;
    console.log('This is the manager', manager);
    return (
      <RemirrorManagerContext.Provider value={manager}>{this.mapChildren()}</RemirrorManagerContext.Provider>
    );
  }
}

interface MapExtensionComponentParams<GOptions extends {}> {
  element: ReactElement;
  registerExtension: RegisterExtension<GOptions>;
}

/**
 * Clone the extension and insert insert the register extension prop
 *
 * @param params
 */
const mapExtensionComponent = <GOptions extends {}>({
  element,
  registerExtension,
}: MapExtensionComponentParams<GOptions>) => {
  return cloneElement(element, { ...element.props, registerExtension });
};

interface ExtensionMapToArrayParams {
  /**
   * Map of extension with a unique symbol for the key
   */
  map: ExtensionMap;
  /**
   * The base extensions or an empty array
   */
  base: ExtensionMapValue[];
}
/**
 * Convert an extension map to it's array of values
 *
 * @param params
 */
const extensionMapToArray = ({ map, base }: ExtensionMapToArrayParams) =>
  base.concat(Array.from(map.entries()).map(([, value]) => value));

export const baseExtensions: ExtensionMapValue[] = [
  { extension: new Composition(), priority: 2 },
  { extension: new Doc(), priority: 2 },
  { extension: new Text(), priority: 2 },
  { extension: new Paragraph(), priority: 2 },
  { extension: new History(), priority: 2 },
  { extension: new Placeholder(), priority: 2 },
];
