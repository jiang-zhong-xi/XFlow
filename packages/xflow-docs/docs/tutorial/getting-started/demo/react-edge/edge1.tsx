import React from 'react'
import type { NsGraph } from '@jiangzhongxi0322/tflow'
import { useAppContext } from '@jiangzhongxi0322/tflow'
import { Tooltip } from 'antd'
import './edge1.less'

const Edge1: NsGraph.IEdgeRender = props => {
  const ctx = useAppContext()
  // console.log('edge useAppContext', ctx);
  // console.log('edge props:', props);
  return (
    <div className="edge1-container">
      <Tooltip
        title="这是连线上渲染的React内容"
        // defaultVisible={true}
      >
        <div>hover我</div>
      </Tooltip>
    </div>
  )
}
export default Edge1
