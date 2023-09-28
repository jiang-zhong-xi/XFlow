import React from 'react'
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons'
import type { NsGraph } from '@wow/tflow'
import { useXFlowApp, XFlowGroupCommands } from '@wow/tflow'

import './index.less'

export const GroupNode: NsGraph.INodeRender = props => {
  const { cell } = props
  const app = useXFlowApp()
  const isCollapsed = props.data.isCollapsed || false
  const onExpand = e => {
    app.executeCommand(XFlowGroupCommands.COLLAPSE_GROUP.id, {
      nodeId: cell.id,
      isCollapsed: false,
    })
  }
  const onCollapse = e => {
    app.executeCommand(XFlowGroupCommands.COLLAPSE_GROUP.id, {
      nodeId: cell.id,
      isCollapsed: true,

      gap: 3,
    })
  }

  return (
    <div className="xflow-group-node">
      <div className="xflow-group-header">
        <div className="header-left">{props.data.label}</div>
        <div className="header-right">
          {isCollapsed && <PlusSquareOutlined onClick={onExpand} />}
          {!isCollapsed && <MinusSquareOutlined onClick={onCollapse} />}
        </div>
      </div>
    </div>
  )
}
