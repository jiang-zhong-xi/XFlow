import type { NsGraph } from '@jiangzhongxi0322/tflow';
import React from 'react';
import { useAppContext } from '@jiangzhongxi0322/tflow';
import './node2.less';

const Node2: NsGraph.INodeRender = (props) => {
  const ctx = useAppContext();

  return (
    <div className="node2-container">
      <div>{'React节点2'}</div>
    </div>
  );
};
export default Node2;
