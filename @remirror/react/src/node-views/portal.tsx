import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';

import { NodeViewPortalComponentProps, NodeViewPortalContainer, PortalList, PortalMap } from '@remirror/core';

export interface NodeViewPortalProps {
  children: (nodeViewPortalContainer: NodeViewPortalContainer) => JSX.Element;
}

export interface PortalRendererState {
  portals: PortalList;
}

export class NodeViewPortal extends React.Component<NodeViewPortalProps> {
  public nodeViewPortalContainer: NodeViewPortalContainer;

  constructor(props: NodeViewPortalProps) {
    super(props);
    this.nodeViewPortalContainer = new NodeViewPortalContainer();
  }

  public componentDidUpdate() {
    this.nodeViewPortalContainer.forceUpdate();
  }

  public render() {
    return this.props.children(this.nodeViewPortalContainer);
  }
}

export class NodeViewPortalComponent extends React.Component<
  NodeViewPortalComponentProps,
  PortalRendererState
> {
  public state = {
    portals: Array.from(this.props.nodeViewPortalContainer.portals.entries()),
  };

  private disposeListener!: () => void;

  constructor(props: NodeViewPortalComponentProps) {
    super(props);
    // props.nodeViewPortalContainer.setContext(this);
    this.disposeListener = this.props.nodeViewPortalContainer.on(this.onPortalChange);
  }

  private onPortalChange = (portalMap: PortalMap) => {
    const portals = Array.from(portalMap.entries());
    this.setState({ portals });
  };

  public componentDidMount() {}

  public componentWillUnmount() {
    this.disposeListener();
  }

  public render() {
    const { portals } = this.state;
    return (
      <>
        {portals.map(([container, { children, key }]) => (
          <Fragment key={key}>{createPortal(children(), container)}</Fragment>
        ))}
      </>
    );
  }
}
