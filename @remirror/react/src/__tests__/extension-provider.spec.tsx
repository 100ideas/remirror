import {
  Cast,
  Extension,
  ExtensionConstructor,
  ExtensionManager,
  ExtensionOptions,
  isObject,
  isSymbol,
} from '@remirror/core';
import React, {
  Children,
  Component,
  ComponentType,
  createContext,
  FC,
  isValidElement,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { render } from 'react-testing-library';

/**
 * A proof of concept solution where the extensions are passed as react components
 */

/**
 * Creates a ReactContext for the Remirror component
 */
export const RemirrorContext = createContext({});

/**
 * Provides an extension manager which can be consumed by the remirror editor
 *
 * ```ts
 * <RemirrorEditorProvider>
 *   <ExtensionComponent extension={Placeholder} {...options} />
 *   <NodeExtensionComponent extension={Mention<'mentionAt'>} onKeyDown={this.onKeyDown} />
 *   {injectedProps => <div />}
 * </RemirrorEditorProvider>
 * ```
 */
export const RemirrorExtensionProvider: FC<any> = ({ children, ...props }) => {
  return (
    <Remirror {...props}>
      {value => <RemirrorContext.Provider value={value}>{children}</RemirrorContext.Provider>}
    </Remirror>
  );
};

type ExtensionComponentProps<
  GExt extends Extension,
  GConstructor extends ExtensionConstructor<GExt, ExtensionOptions<GExt>>
> = ExtensionOptions<GExt> & {
  Constructor: GConstructor;
  order?: number;
  children?: never;
};

// class ExtensionComponent<
//   GExt extends Extension,
//   GConstructor extends ExtensionConstructor<GExt, ExtensionOptions<GExt>>
// > extends Component<ExtensionComponentProps<GExt, GConstructor>> {
//   constructor(props: ExtensionComponentProps<GExt, GConstructor>) {
//     super(props);
//   }

//   public componentDidMount() {
//     const { Constructor, order, children: _, ...options } = this.props;
//     const instance = new Constructor(options as ExtensionOptions<GExt>);
//   }
//   public componentDidUpdate() {}

//   public render() {
//     return null;
//   }
// }

interface ExtraProps {
  priority?: number;
  children?: never;
}

interface SimpleExtensionConstructor<GOptions extends {}, GExtension extends Extension<GOptions>> {
  // tslint:disable-next-line: callable-types
  new (options: GOptions): GExtension;
}
const extensionComponent = <
  GOptions extends {},
  GConstructor extends SimpleExtensionConstructor<GOptions, Extension<GOptions>>
>(
  Constructor: GConstructor,
) => {
  class EnhancedComponent extends Component<ExtraProps & GOptions> {
    public static $$id = Symbol(Constructor.name);

    /**
     * Auto injected at runtime
     */
    public static readonly registerInstance: (instance: Extension<GOptions>, id: symbol) => void;

    public componentDidMount() {
      const { children: _, priority: _order, ...options } = this.props;
      console.log('component is mounting');
      const instance = new Constructor(Cast<GOptions>(options));
      EnhancedComponent.registerInstance(instance, EnhancedComponent.$$id);
    }

    public render() {
      console.log('render called');
      // Non rendering component
      return <React.Fragment />;
      // return null;
    }
  }

  return EnhancedComponent;
};

interface SimpleOptions {
  simple: boolean;
}

class Simple extends Extension<SimpleOptions> {
  public static Component = extensionComponent<SimpleOptions, typeof Simple>(Simple);

  get name(): 'simple' {
    return 'simple';
  }
}

interface AnotherOptions {
  another: boolean;
}

class Another extends Extension<AnotherOptions> {
  public static Component = extensionComponent<AnotherOptions, typeof Another>(Another);

  get name(): 'another' {
    return 'another';
  }
}

// const Ext = <GExt extends Extension,
// GConstructor extends ExtensionConstructor<GExt, ExtensionOptions<GExt>>({Constructor, children: _, order, ...props}: ExtensionComponentProps<GExt, GConstructor> & ExtensionOptions<GExt>) => {
//   // useEffect(() => {
//   //   return () => {
//   //     const instance = new Constructor(props as ExtensionOptions<GExt>);
//   //   },
//   //   [input]
//   // })

//   return null;
// }

const simple = () => {
  // return <ExtensionComponent Constructor={Placeholder} order={0} />;
  return <Simple.Component simple={true} />;
};

type ExtensionComponent<GOptions extends {} = any> = ComponentType<any> & {
  readonly $$id: symbol;
  registerInstance(instance: Extension<GOptions>, id: symbol): void;
};

const isValidExtensionElementType = <GOptions extends {} = any>(
  value: unknown,
): value is ReactElement<any> & { type: ExtensionComponent<GOptions> } => {
  return isObject(value) && isValidElement(value) && isSymbol((value.type as any).$$id);
};

/**
 * Finds the remirror editor amongst it's children and injects
 */
const Parent: FC = ({ children }) => {
  const extensionElementArray = Children.toArray(children).filter(isValidExtensionElementType);
  const [symbols, setSymbols] = useState(extensionElementArray.map(child => child.type.$$id));

  const [manager, setManager] = useState<ExtensionManager>();

  const registerInstance: ExtensionComponent['registerInstance'] = (instance, $$id) => {
    instances.set($$id, instance);
    setSymbols(symbols.filter(sym => sym !== $$id));
    console.log('registered instance', $$id, instance);
  };

  extensionElementArray.forEach(child => {
    console.log(child.type);
    child.type.registerInstance = registerInstance;
  });

  const instances = new Map<symbol, Extension<any>>();

  useEffect(() => {
    const extensions = Array.from(instances.entries()).map(([, ext]) => ext);
    if (symbols.length === 0 && extensions.length > 0) {
      const m = ExtensionManager.create({
        extensions,
        getEditorState: () => Cast({}),
        getPortalContainer: () => Cast({}),
      });
      console.log(m);
      setManager(m);
    }
  }, [symbols]);

  return <>{children}</>;
};

test('something', () => {
  render(
    <Parent<{}>>
      <Simple.Component simple={true} priority={1} />
      <Another.Component another={true} priority={0} />
    </Parent>,
  );
});
