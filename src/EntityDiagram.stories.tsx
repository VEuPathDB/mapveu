import React, {useState} from 'react';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import {LinkHorizontalLine} from '@visx/shape';
import { Text } from '@visx/text';
import { LinearGradient } from '@visx/gradient';

export default {
  title: 'Entity Diagram',
};


interface TreeNode {
  name: string;
  children?: this[];
}

type HierarchyNode = HierarchyPointNode<TreeNode>;

const rawTree: TreeNode ={
  name: 'C',
  children: [
    { name: 'S',
      children: [{ name: 'G' }, { name: 'IR' }, { name: 'P' }, { name: 'BM' }],
    },
    {
      name: 'AS'
    },
  ],
};

// function CustomNode({node}: {node: HierarchyNode}) {
function CustomNode({node, setHoveredNode, hoveredNode}) {
  const width = 30;
  const height = 20;

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={-height / 2}
        x={-width / 2}
        fill={"white"}
        stroke={"black"}
        onMouseOver={() => setHoveredNode(node.data.name)}
        onMouseLeave={() => setHoveredNode(null)}
        style={hoveredNode == node.data.name ? { 'cursor': 'pointer', 'outline': 'yellow 3px solid' } : {} }
      />
       <text
         fontSize={12}
         textAnchor="middle"
         style={hoveredNode == node.data.name ? {'cursor': 'pointer'} : {'cursor': 'default'}}
         onMouseOver={() => setHoveredNode(node.data.name)}
         dy=".33em"
       >
         {node.data.name}
       </text>
     </Group>
 )
}

export const VISX_Example = () => {
  const data = hierarchy(rawTree);
  const [hoveredNode, setHoveredNode] = useState(null)

  return (
      <svg width="1000px" height="1000px">
        <defs>
          <marker
              id="arrow"
              viewBox="0 -5 10 10"
              refX="21"
              markerWidth="15"
              markerHeight="15"
              orient="auto"
              fill="black"
          >
            <path d="M0,-5L10,0L0,5" />
          </marker>
        </defs>
        <Tree
          root={data}
          size={[150, 200]}
        >
          {tree => (
              <Group left={50}>
                {tree.links().map((link, i)=> (
                  <LinkHorizontalLine
                    data={link}
                    stroke={"black"}
                    strokeWidth={1}
                    markerEnd="url(#arrow)"
                    key={`link-${i}`}
                  />
                ))}
                {tree.descendants().map((node, i) => (
                  <CustomNode node={node} setHoveredNode={setHoveredNode} hoveredNode={hoveredNode} key={`node-${i}`}/>
                ))}
              </Group>
          )}
        </Tree>
      </svg>
  )
}

/** EXPANDED **/

// There must be a smarter way to do this but for example purposes it works.
function CalculateDYSize(nodeLength) {
  switch (nodeLength) {
    case 1:
      return '.33em'
    case 2:
      return '.80em'
    case 3:
      return '1.35em'
    case 4:
      return '1.8em'
    case 5:
      return '1.8em'
  }
}

const rawTreeExpanded: TreeNode ={
  name: 'Collection',
  children: [
    { name: 'Sample',
      children: [{ name: 'Genotype' }, { name: 'Insecticide Resistance Assay' }, { name: 'Pathogen Detection Assay Result' }, { name: 'Blood Meal Host Identification Result' }],
    },
    {
      name: 'Abundance Sample'
    },
  ],
};

export const VISX_Example_Expanded = () => {
  const data = hierarchy(rawTreeExpanded);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const width = 120;
  const height = 70;

  return (
      <svg width="1000px" height="1000px">
        <defs>
          <marker
              id="arrow"
              viewBox="0 -5 10 10"
              refX="30"
              markerWidth="30"
              markerHeight="30"
              orient="auto"
              fill="black"
          >
            <path d="M0,-5L10,0L0,5" />
          </marker>
        </defs>
        <LinearGradient vertical={false} x1={0} x2={.5} fromOffset={1} id="rect-gradient" from="#e4c8c8" to="white" />
        <Tree
            root={data}
            size={[500, 500]}
        >
          {tree => (
              <Group left={80}>
                {tree.links().map((link, i)=> (
                    <LinkHorizontalLine
                        data={link}
                        stroke={"black"}
                        strokeWidth={1}
                        markerEnd="url(#arrow)"
                        key={`link-${i}`}
                    />
                ))}
                {tree.descendants().map((node, i) => {
                  const nodeName = node.data.name;
                  return (
                    <Group top={node.x} left={node.y}>
                      <rect
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          fill="url('#rect-gradient')"
                          stroke={"black"}
                          onMouseOver={() => setHoveredNode(nodeName)}
                          onMouseLeave={() => setHoveredNode(null)}
                          style={hoveredNode == node.data.name ? {'cursor': 'pointer', 'outline': 'yellow 3px solid' } : {'overflowWrap': 'normal'} }
                      />
                      <Text
                          fontSize={12}
                          textAnchor="middle"
                          style={hoveredNode == node.data.name ? {'cursor': 'pointer'} : {'cursor': 'default'}}
                          onMouseOver={() => setHoveredNode(nodeName)}
                          dy={CalculateDYSize(node.data.name.split(' ').length)}
                          width={100}
                      >
                        {node.data.name}
                      </Text>
                    </Group>)
                    // <CustomNodeExpanded node={node} setHoveredNode={setHoveredNode} hoveredNode={hoveredNode} key={`node-${i}`}/>
                })}
              </Group>
          )}
        </Tree>
      </svg>
  )
}