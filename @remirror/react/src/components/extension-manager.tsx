import React, { Children, cloneElement, createContext, PureComponent, ReactElement } from 'react';

import { Cast, ExtensionManager } from '@remirror/core';
import { isRemirrorEditorType, isRemirrorExtensionComponent } from '../helpers';
import { ExtensionMap, ExtensionMapValue, RegisterExtension, RemirrorManagerProps } from '../types';

export const ExtensionManagerContext = createContext<ExtensionManager>(Cast<ExtensionManager>({}));

interface State {
  entries: ExtensionMapValue[];
  length: number;
}

export class RemirrorManager extends PureComponent<RemirrorManagerProps, State> {
  private get extensionComponents() {
    return Children.toArray(this.props.children).filter(isRemirrorExtensionComponent);
  }

  private manager?: ExtensionManager;
  private extensionMap: ExtensionMap = new Map();

  public state: State = {
    entries: [],
    length: this.extensionComponents.length,
  };

  private registerExtension: RegisterExtension<any> = ({ extension, id, priority }) => {
    // Check if this is the first time the extension is being added
    if (this.extensionMap.has(id)) {
      // This is an updated extension
    } else {
      //
    }
    this.extensionMap.set(id, { extension, priority });

    if (this.extensionMap.size === this.state.length) {
      this.manager = ExtensionManager.create;
    }

    return () => {
      this.extensionMap.delete(id);
      this.setState({
        length: this.extensionComponents.length,
        entries: extensionMapToArray(this.extensionMap),
      });
    };
  };

  private mapChildren() {
    const { children } = this.props;
    return Children.map(children, child => {
      if (isRemirrorExtensionComponent(child)) {
        return mapExtensionComponent({ element: child, registerExtension: this.registerExtension });
      }

      if (isRemirrorEditorType(child)) {
        return null;
      }

      throw new Error(
        'Invalid element found in children of Remirror Manager. Please only use supported elements',
      );
    });
  }

  public render() {
    return this.mapChildren();
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

interface MapRemirrorEditorProvider {
  element: ReactElement;
  manager: ExtensionManager;
}

/**
 * Surround the remirror instance in a ExtensionManagerProvider so that the updated values of manager are
 * automatically injected.
 *
 * @param params
 */
const mapRemirrorEditorProvider = ({ element, manager }: MapRemirrorEditorProvider) => {
  return <ExtensionManagerContext.Provider value={manager}>{element}</ExtensionManagerContext.Provider>;
};

/**
 * Convert an extension map to it's array of values
 *
 * @param map
 */
const extensionMapToArray = (map: ExtensionMap) => Array.from(map.entries()).map(([, value]) => value);
