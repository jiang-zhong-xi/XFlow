/* eslint-disable @typescript-eslint/no-redeclare */
import 'reflect-metadata'

/** Application */
import { FrontendApplication, IFrontendApplicationContribution } from './application'

/** Command 模块 */
import { commandRegistryModule } from '../command/module'
import { modelServiceModule } from '../model-service/module'

/** Extension 注册中心 */
import { ExtensionRegistry } from './components/extension-registry'

/** 类型定义 */
import { Contribution, Container, Module } from 'mana-syringe'

export { ExtensionRegistry }

export type ICreateApp = (registry: ExtensionRegistry) => FrontendApplication

/** application */
const appMainModule = Module(register => {
  /** 声明IFrontendApplicationContribution扩展点*/
  Contribution.register(register, IFrontendApplicationContribution)
  /** 声明 FrontendApplication */
  register(FrontendApplication)
})

export const initApp: ICreateApp = (moduleRegistry: ExtensionRegistry) => {
  const extensions = moduleRegistry.getAllExtensions()
  const container = new Container()

  /** command */
  /** react renderer */
  /** 批量创建 extension module */
  /**  代码笔记
   * * 顶层组件首次渲染完毕后，把moduleRegistry中的模块中的子模块通过createModule函数完成“绑定”
   */
  const modules = extensions.map(module => {
    const { createModule, config } = module
    return createModule(config)
  })

  /**  代码笔记
   * * container.load(appMainModule)执行appMainModule.registry(container.register, { container: container})
   * * 执行appMainModule是mana-syring中SyringeModule的实例所以上面是调用SyringeModule的实例（appMainModule）的registry
   * * SyringeModule把实例化时（见appMainModule对象的生成）的函数参数A保存为baseRegistry
   * * SyringeModule的registy中把container.register传入函数参数A中
   * * 简言之container.load(appMainModule)的上帝视角就是(函数参数A)(container.register)，Module函数的执行并不是真的“绑定”更像是声明模块有哪些要“绑定”
   *
   * * 这么绕的实现了高内聚低耦合，initApp中的container.load的执行是真正对mana-syring模块的“绑定”，这是高内聚，而模块声明自己要“绑定”哪些东西 放在模块内部，这也是高内聚，而两者是低耦合的
   * * 这样模块添加自己要声明的东西不用修改initApp
   *
   * * 如果我们要封装一个独立的注册模块，就可以用上面的模式，注册模块提供两个函数，一个用来让待注册模块声明自己要“声明”哪些东西，另一个有个中心模块，把待注册模块声明的哪些东西真正的注册到注册模块
   */
  /** 单独加载 appMainModule */
  container.load(appMainModule)
  /** 单独加载 commandRegistryModule */
  container.load(commandRegistryModule)
  // /** 单独加载 modelServiceModule */
  container.load(modelServiceModule)

  /**
   * 批量加载 extension module
   * 包括：menu/toolbar/keybinding/graph
   */
  modules.forEach(module => {
    container.load(module)
  })

  /**  代码笔记
   * * mana-syring通过container.get获取绑定的对象
   * * 一个对象要想能获取到需要经过 声明、绑定两个过程
   * * 获取FrontendApplication对象后会引发一系列的实例化和赋值，最主要的是实例上的contributions的赋值
   */
  const app = container.get(FrontendApplication)
  return app
}
