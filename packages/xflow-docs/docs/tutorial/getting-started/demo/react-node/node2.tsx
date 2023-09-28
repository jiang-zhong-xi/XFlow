import type { NsGraph } from '@wow/tflow'
import React from 'react'
import { useAppContext } from '@wow/tflow'
import './node2.less'

const Node2: NsGraph.INodeRender = props => {
  const ctx = useAppContext()

  return (
    <div className="node2-container">
      <div>{'React节点2'}</div>
    </div>
  )
}
export default Node2
