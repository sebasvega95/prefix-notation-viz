import React from 'react';
import * as d3 from 'd3';

import * as ast2hierarchy from '../services/ast2hierarchy';

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 400;
const MARGIN = 50;
const RADIUS = 30;

function displayOp(op) {
  switch (op) {
    case '+':
      return '+';
    case '-':
      return '–';
    case '*':
      return '×';
    case '/':
      return '÷';
    default:
      return op;
  }
}

class DrawAst extends React.Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.svg.select('.graph').remove();
    this.draw();
  }

  draw() {
    const { astString } = this.props;
    const ast = JSON.parse(astString);
    const data = ast2hierarchy.convertAst(ast);
    const root = d3.hierarchy(data);

    const treeLayout = d3
      .tree()
      .size([SVG_WIDTH - 2 * MARGIN, SVG_HEIGHT - 2 * MARGIN]);
    treeLayout(root);

    const graph = this.svg
      .append('g')
      .classed('graph', true)
      .attr('transform', `translate(${MARGIN}, ${MARGIN})`);

    graph
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .style('stroke', '#bbb')
      .style('stroke-width', '2px')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    const nodesSelection = graph
      .selectAll('.node')
      .data(root.descendants())
      .enter();
    nodesSelection
      .append('circle')
      .classed('node', true)
      .style('fill', 'SteelBlue')
      .style('stroke', 'none')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', RADIUS);
    nodesSelection
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .style('font-size', '3em')
      .style('fill', '#eee')
      .style('stroke', '#666')
      .style('stroke-width', '1px')
      .text(d => displayOp(d.data.name));
  }

  render() {
    return (
      <svg
        ref={svg => (this.svg = d3.select(svg))}
        width="100%"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      />
    );
  }
}

export default DrawAst;
