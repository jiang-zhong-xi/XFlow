import 'reflect-metadata'
/** Application 扩展依赖 */
import { HookContribution } from './contributions/hook'
import { IMinimapConfigProvider } from './interface'
import { ManaSyringe } from '@jiangzhongxi0322/tflow-core'
import type { IModuleConfig } from '@jiangzhongxi0322/tflow-core'
import type { IMinimapOptions } from './interface'

/** 依赖扩展模块，必须要加载 */
const createModule = (config: IModuleConfig<IMinimapOptions>) => {
  return ManaSyringe.Module(register => {
    register<IMinimapConfigProvider>(IMinimapConfigProvider, { useDynamic: () => config })
    /** 扩展 runtime hook */
    register(HookContribution)
  })
}

export { createModule }
