import { Input } from 'antd'
import React, { useRef, useEffect } from 'react'
/** 交互组件 */
import {
  /** XFlow核心组件 */
  XFlow,
  /** 流程图画布组件 */
  FlowchartCanvas,
  /** 流程图配置扩展 */
  FlowchartExtension,
  /** 流程图节点组件 */
  FlowchartNodePanel,
  /** 流程图表单组件 */
  FlowchartFormPanel,
  FlowchartFormWrapper,
  /** 通用组件：快捷键 */
  KeyBindings,
  /** 通用组件：画布缩放 */
  CanvasScaleToolbar,
  /** 通用组件：右键菜单 */
  CanvasContextMenu,
  /** 通用组件：工具栏 */
  CanvasToolbar,
  /** 通用组件：对齐线 */
  CanvasSnapline,
  /** 通用组件：节点连接桩 */
  CanvasNodePortTooltip,
} from '@jiangzhongxi0322/tflow'
// import type { Graph } from '@antv/x6'
/** 配置Command*/
import { useCmdConfig } from './config-cmd'
/** 配置Menu */
import { useMenuConfig } from './config-menu'
/** 配置Toolbar */
import { useToolbarConfig } from './config-toolbar'
/** 配置快捷键 */
import { useKeybindingConfig } from './config-keybinding'
/** 配置Dnd组件面板 */
import { DndNode } from './react-node/dnd-node'
import '@jiangzhongxi0322/tflow/dist/index.css'

import './index.less'

const InputComponent = props => {
  const { plugin = {} } = props
  const { updateNode } = plugin
  const onLabelChange = e => {
    updateNode({
      label: e.target.value,
    })
  }
  return <Input value={'label'} onChange={onLabelChange} />
}

const RenameService = props => {
  return (
    <FlowchartFormWrapper {...props}>
      {(config, plugin) => <InputComponent {...props} plugin={plugin} config={config} />}
    </FlowchartFormWrapper>
  )
}

export const controlMapService = controlMap => {
  controlMap.set('rename-service', RenameService)
  return controlMap
}

const Demo = props => {
  const { meta } = props
  const toolbarConfig = useToolbarConfig()
  const menuConfig = useMenuConfig()
  const keybindingConfig = useKeybindingConfig()
  // const graphRef = useRef<Graph>()
  const graphRef = useRef()
  const commandConfig = useCmdConfig()
  /**
   * @param app 当前XFlow工作空间
   * @param extensionRegistry 当前XFlow配置项
   */
  const onLoad = async app => {
    graphRef.current = await app.getGraphInstance()
  }

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.on('node:click', (...arg) => {
        console.log(arg)
      })
    }
  }, [graphRef])

  return (
    <XFlow
      className="flow-user-custom-clz"
      commandConfig={commandConfig}
      onLoad={onLoad}
      meta={meta}
    >
      <FlowchartExtension />
      <FlowchartNodePanel
        registerNode={{
          title: '自定义节点',
          nodes: [
            {
              component: DndNode,
              popover: () => <div>自定义节点</div>,
              name: 'custom-node-indicator',
              width: 210,
              height: 130,
              label: '自定义节点',
            },
          ],
        }}
        position={{ width: 162, top: 40, bottom: 0, left: 0 }}
      />
      <CanvasToolbar
        className="xflow-workspace-toolbar-top"
        layout="horizontal"
        config={toolbarConfig}
        position={{ top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <FlowchartCanvas position={{ top: 40, left: 0, right: 0, bottom: 0 }}>
        <CanvasScaleToolbar
          layout="horizontal"
          position={{ top: -40, right: 0 }}
          style={{
            width: 150,
            left: 'auto',
            height: 39,
          }}
        />
        <CanvasContextMenu config={menuConfig} />
        <CanvasSnapline color="#faad14" />
        <CanvasNodePortTooltip />
      </FlowchartCanvas>
      <FlowchartFormPanel
        show={true}
        position={{ width: 200, top: 40, bottom: 0, right: 0 }}
        formSchemaService={() => {
          return {
            tabs: [
              {
                name: '数据',
                groups: [
                  {
                    name: 'basic',
                    controls: [
                      {
                        label: 'Description',
                        name: 'description',
                        shape: 'rename-service',
                      },
                    ],
                  },
                  {
                    name: 'config',
                    controls: [
                      {
                        label: 'Forward Propagation',
                        name: 'Forward Propagation',
                        shape: 'Checkbox',
                      },
                    ],
                  },
                ],
              },
            ],
          }
        }}
        controlMapService={controlMapService}
      />
      <KeyBindings config={keybindingConfig} />
    </XFlow>
  )
}

export default Demo
