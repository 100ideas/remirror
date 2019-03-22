// import { Extension, ExtensionConstructor, ExtensionOptions } from '@remirror/core';
// import { Placeholder } from '@remirror/core-extensions';
// import React, { Component, createContext, FC } from 'react';

// /**
//  * A proof of concept solution where the extensions are passed as react components
//  */

// /**
//  * Creates a ReactContext for the Remirror component
//  */
// export const RemirrorContext = createContext({});

// /**
//  * Provides an extension manager which can be consumed by the remirror editor
//  *
//  * ```ts
//  * <RemirrorEditorProvider>
//  *   <ExtensionComponent extension={Placeholder} {...options} />
//  *   <NodeExtensionComponent extension={Mention<'mentionAt'>} onKeyDown={this.onKeyDown} />
//  *   {injectedProps => <div />}
//  * </RemirrorEditorProvider>
//  * ```
//  */
// export const RemirrorExtensionProvider: FC<any> = ({ children, ...props }) => {
//   return (
//     <Remirror {...props}>
//       {value => <RemirrorContext.Provider value={value}>{children}</RemirrorContext.Provider>}
//     </Remirror>
//   );
// };

// type ExtensionComponentProps<
//   GExt extends Extension,
//   GConstructor extends ExtensionConstructor<GExt, ExtensionOptions<GExt>>
// > =  {
//   Constructor: GConstructor;
//   order?: number;
//   children?: never;
//   // options: ExtensionOptions<GExt>;
// };

// class ExtensionComponent<
//   GExt extends Extension,
//   GConstructor extends ExtensionConstructor<GExt, ExtensionOptions<GExt>>
// > extends Component<ExtensionComponentProps<GExt, GConstructor>> {
//   public componentDidMount() {
//     const { Constructor, order, children: _, ...options } = this.props;
//     const instance = new Constructor(options);
//   }
//   public componentDidUpdate() {}

//   public render() {
//     return null;
//   }
// }

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

// const simple = () => {
//   // return <ExtensionComponent Constructor={Placeholder} order={0} />;
//   return <Ext Constructor={Placeholder} order={0}  />;
// };

// type A = ExtensionOptions<Placeholder>;
// type H = ExtensionComponentProps<Placeholder, typeof Placeholder>;
// const h: H = { emptyNodeClass: '' };
