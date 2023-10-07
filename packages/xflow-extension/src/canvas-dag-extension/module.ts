import 'reflect-metadata'
/** Application 扩展依赖 */
import type { IExtensionModule } from '@jiangzhongxi0322/tflow-core'
import { ManaSyringe } from '@jiangzhongxi0322/tflow-core'
import { DagHooksContribution } from './contributions/dag'
import { QueryGraphStatusCommand } from './contributions/command'
export * from './x6-extension/edge'
export * from './x6-extension/node'
import type { IProps } from './interface'
import { IComponentConfig } from './interface'

/** 依赖扩展模块，必须要加载 */
const createDagExtensionModule: IExtensionModule<IProps>['createModule'] = config => {
  return ManaSyringe.Module(register => {
    /** 扩展 runtime hook */
    register(DagHooksContribution)
    register(QueryGraphStatusCommand)
    register<IComponentConfig>(IComponentConfig, {
      useValue: config,
    })
  })
}

export { createDagExtensionModule }
