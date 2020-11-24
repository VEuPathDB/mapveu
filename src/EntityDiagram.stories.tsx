import React from 'react';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import {LinkHorizontalLine} from '@visx/shape';

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

function CustomNode({node}: {node: HierarchyNode}) {
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
    />
     <text
         fontSize={9}
         textAnchor="middle"
     >
       {node.data.name}
     </text>
   </Group>
 )
}

export const VISX_Example = () => {
  const data = hierarchy(rawTree);
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
          size={[300, 300]}
        >
          {tree => (
              <Group left={50}>
                {tree.links().map((link, i)=> (
                  <LinkHorizontalLine
                    data={link}
                    stroke={"black"}
                    strokeWidth={1}
                    fill={"none"}
                    markerEnd="url(#arrow)"
                    key={`link-${i}`}
                  />
                ))}
                {tree.descendants().map((node, i) => (
                  <CustomNode node={node} key={`node-${i}`}/>
                ))}
              </Group>
          )}
        </Tree>
      </svg>
  )
}