import React from 'react'
import { ExtensionRegistry } from './extension-registry'

/** 通过context收集extension的配置 */
/**  代码笔记
 * * 这里的extension包括但不限于ModelServiceRegistry、CommandsRegistry、HookRegistry、ToolbarRegistry、MenuRegistry
 * * 把ExtensionRegistry通过ReactContext的方式暴露出去，而使用者通过useExtensionRegistry获取到ExtensionRegistry实例，这样通过跨组件通信传递ExtensionRegistry
 * * 顶层组件首次渲染时通过useExtensionRegistry完成模块的收集任务
 */
export const ExtensionRegistryContext = React.createContext<ExtensionRegistry>(
  {} as ExtensionRegistry,
)

export const useExtensionRegistry = () => {
  return React.useContext(ExtensionRegistryContext)
}

export { ExtensionRegistry }
