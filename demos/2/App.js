import React, { Component } from 'react';
import each from 'lodash/collection/each';
import map from 'lodash/collection/map';
import cloneDeep from 'lodash/lang/cloneDeep';

import D3Force from './D3Force';
import graph from './graph';

export class App extends Component {
  constructor(props) {
    super(props);

    this.nodes = cloneDeep(graph.nodes);
    this.links = cloneDeep(graph.links);
  }

  handleTick = (e, nodes) => {
    // Push different nodes in different directions for clustering.
    var k = 6 * e.alpha;
    nodes.forEach(function(o, i) {
      o.y += i & 1 ? k : -k;
      o.x += i & 2 ? k : -k;
    });
  }

  handleClick = (e) => {
    var index = parseInt(e.target.getAttribute('data-index'), 10);
    var node = this.nodes[index];

    node.fixed  = !node.fixed;
    this.forceUpdate();
  }

  render() {
    return (
      <D3Force
        ref="force"
        nodes={this.nodes}
        // links={this.links}
        charge={-40}
        alpha={1}
        linkStrength={0.2}
        onTick={this.handleTick}
      >
        {
          updatedGraph =>
            <svg
              viewBox='0 0 1024 1024'
              width='100%'
              height='100%'
              fill='currentcolor'
            >
              {
                // updatedGraph.links.map((d, i) =>
                //   <line
                //     key={i}
                //     x1={d.source.x}
                //     y1={d.source.y}
                //     x2={d.target.x}
                //     y2={d.target.y}
                //     stroke="black" 
                //     strokeWidth="2"
                //   />
                // )
              }
              {
                updatedGraph.nodes.map((d, i) =>
                  <circle
                    style={{cursor: 'pointer'}}
                    data-index={i}
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={10}
                    fill={d.fixed ? 'red' : 'currentcolor'}
                    onClick={this.handleClick}
                  />
                )
              }
            </svg>
        }
      </D3Force>
    );
  }
}
