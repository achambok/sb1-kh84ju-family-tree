import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Person } from '../types/family';
import { useFamilyStore } from '../store/familyStore';

interface TreeNode extends d3.HierarchyNode<Person> {
  x: number;
  y: number;
}

export const FamilyTreeView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { familyTree } = useFamilyStore();

  useEffect(() => {
    if (!svgRef.current || !familyTree.rootId) return;

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const rootPerson = familyTree.people[familyTree.rootId];
    
    const hierarchy = d3.hierarchy(rootPerson, (d) => {
      return d.childrenIds.map(id => familyTree.people[id]);
    });

    const treeLayout = d3.tree<Person>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    const tree = treeLayout(hierarchy);

    // Add links
    svg.selectAll('.link')
      .data(tree.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y))
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', '2px');

    // Add nodes
    const nodes = svg.selectAll('.node')
      .data(tree.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    // Add circles for nodes
    nodes.append('circle')
      .attr('r', 10)
      .style('fill', '#fff')
      .style('stroke', '#4299e1')
      .style('stroke-width', '2px');

    // Add labels
    nodes.append('text')
      .attr('dy', '0.31em')
      .attr('x', (d: any) => d.children ? -12 : 12)
      .style('text-anchor', (d: any) => d.children ? 'end' : 'start')
      .text((d: any) => d.data.name);

  }, [familyTree]);

  return (
    <div className="w-full h-full overflow-auto">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};