export { ManaSyringe } from '@wow/tflow-core'

/** XFlow 基础 interface */
export { NsGraph } from '@wow/tflow-core'

/*******************************************************
 * 核心组件：
 * 1. Application：XFlow
 * 2. Application Extension：XFlowAppExtensionModule
 * 3. Graph：XFlowCanvas
 *****************************************************/

export {
  // 组件
  XFlow,
  XFlowCanvas,
  XFlowAppExtensionModule,
  // app context
  XFlowAppProvider,
  XFlowAppContext,
  useXFlowApp,
  // config provider context：使用全局Config
  useXflowPrefixCls,
  XFlowConfigProviderContext,
  // extension context: 注册扩展
  ExtensionRegistryContext,
  useExtensionRegistry,
} from '@wow/tflow-core'

/** widget：extension  */
export { IExtensionModule, IModuleConfig } from '@wow/tflow-core'

/** graphProvider：注入Graph时 需要 */
export { IGraphConfig, IGraphProvider, createGraphConfig } from '@wow/tflow-core'

/** app：用于extension扩展*/
export {
  IApplication,
  IApplicationContribution,
  IAppLoad,
  IAppDestroy,
  IAppConfigReady,
} from '@wow/tflow-core'

/*******************************************************
 *  Command Service： 命令模块
 *****************************************************/

/** Command 类型 */
export type {
  IArgsBase,
  IGraphCommand,
  ICommandConfig,
  IGraphPipelineCommand,
} from '@wow/tflow-core'

/** Command Service */
export {
  ICommandHandler,
  IGraphCommandService,
  ICommandContextProvider,
  IGraphCommandContribution,
  IGraphCommandFactory,
  GraphCommandRegistry,
  commandRegistryModule,
} from '@wow/tflow-core'

/** Command 常量 */
export {
  XFlowNodeCommands,
  XFlowEdgeCommands,
  XFlowGroupCommands,
  XFlowGraphCommands,
  XFlowModelCommands,
  /** 创建 Command hook config */
  createCmdConfig,
} from '@wow/tflow-core'

export type {
  /** Command 类型*/
  NsGraphCmd,
  NsNodeCmd,
  NsEdgeCmd,
  NsGroupCmd,
  NsModelServiceCmd,
  /** command 钩子函数的类型 */
  ICmdHooks,
  /** Command扩展的类型 */
  ICommandContributionConfig,
} from '@wow/tflow-core'

/** React Node Context */
export { AppContext, useAppContext, getNodeReactComponent } from '@wow/tflow-core'

/*******************************************************
 *  XFlow Hooks： 钩子函数
 *****************************************************/

export {
  // 扩展Hooks
  IHookService,
  IRegisterHookFn,
  IRegisterHookHubFn,
  IHookContribution,
  // Graph的类型
  IEvent,
  // 内置的graph hooks
  IHooks,
  // 创建 React config hook
  createHookConfig,
} from '@wow/tflow-core'

/*******************************************************
 *  Model Service：全局状态
 *****************************************************/

export {
  MODELS,
  IUseModel,
  IModelOptions,
  IModelService,
  IModelContribution,
  IModelRegisterFunction,
  createModelServiceConfig,
} from '@wow/tflow-core'

export { RxModel, NsModel } from '@wow/tflow-core'

export { useModel, createComponentModel, useModelAsync, useIsMountedRef } from '@wow/tflow-core'

/*******************************************************
 *  Toolbar：工具栏
 *****************************************************/

/** Toolbar 配置 */
export {
  // component
  ToolbarRegistry,
  // ioc 扩展
  IToolbarService,
  IToolbarContribution,
  // model 类型
  IToolbarModel,
  // 布局
  IToolbarLayout,
  // config options
  IToolbarOptions,
  IToolbarItemOptions,
  IToolbarGroupOptions,
  IRegisterToolbarItemFunction,
} from '@wow/tflow-core'

/*******************************************************
 *  Menu：菜单
 *****************************************************/

/** Menu 配置 */
export {
  // 扩展 Service
  IMenuService,
  IMenuContribution,
  // Menu 类型定义
  IMenuId,
  IAnchor,
  IMenuTarget,
  // menu item
  MenuItemType,
  IMenuModel,
  IMenuOptions,
  IRegisterMenuFunction,
  // Component
  MenuRegistry,
} from '@wow/tflow-core'

/*******************************************************
 *  KeyBindings：快捷键
 *****************************************************/

/** KeyBindings 配置 */
export {
  KeyBindings,
  createKeybindingConfig,
  KeybindingConfig,
  IKeyBindingContribution,
} from '@wow/tflow-core'

/*******************************************************
 *  UTILS：工具方法
 *****************************************************/

/** utils：dispose */
export { Disposable, DisposableCollection } from '@wow/tflow-core'
/** utils：defer 延迟 */
export { Deferred } from '@wow/tflow-core'
/** utils：延迟 */
export { delay } from '@wow/tflow-core'
/** utils：uuid */
export { uuidv4 } from '@wow/tflow-core'
/** utils：绝对定位 */
export { IPosition, usePositionStyle } from '@wow/tflow-core'
export { Simplify } from '@wow/tflow-core'
/** utils：insertCss */
export { insertCss, isReactComponent } from '@wow/tflow-core'

/*******************************************************
 * Icon：Antd Icon
 *****************************************************/

/** ICON */
export { IconStore } from '@wow/tflow-core'

/** 全局常量 */
export { XFlowConstants } from '@wow/tflow-core'
