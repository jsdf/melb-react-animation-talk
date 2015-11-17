import React, { Component } from 'react';
import d3 from 'd3';
import cloneDeep from 'lodash/lang/cloneDeep';
import each from 'lodash/collection/each';

export default class D3Force extends Component {
  constructor(props) {
    super(props);

    var {width, height, charge, linkDistance, linkStrength, alpha} = props;
    var nodes = cloneDeep(props.nodes);
    var links = cloneDeep(props.links);

    var force = d3.layout.force()
      .size([width, height])
      .charge(charge)
      .linkStrength(linkStrength)
      .linkDistance(linkDistance)
      .alpha(alpha)
      .on("tick", this.tick);

    // todo
    var drag = force.drag()
      .on("dragstart", this.dragstart);

    this.state = {
      force,
      drag,
      nodes,
      links,
    };

    if (nodes) force.nodes(nodes);
    if (links) force.links(links);
    force.start();
  }

  componentDidUpdate() {
    each(this.state.nodes || [], (node, i) => {
      Object.assign(node, this.props.nodesProperties[i]);
    });
  }

  tick = (e) => {
    if (this.props.onTick) this.props.onTick(e, this.state.nodes);
    this.forceUpdate();
  }

  dblclick = (d) => {
    console.log(d)
  }

  dragstart = (d) => {
    console.log(d)
  }

  render() {
    const {nodes, links} = this.state;
    return this.props.children({nodes, links});
  }
}

D3Force.defaultProps = {
  width: 960,
  height: 500,
  charge: -400,
  linkDistance: 40,
  linkStrength: 1,
  alpha: 1,
}
