import { DisposableCollection, Disposable } from '../../common/disposable'
import { HookConfig } from '../config'
import type { IHookService } from '../index'
import { singleton, inject } from 'mana-syringe'
import type { IHooks } from '../interface'
import { IHookContribution } from '../interface'
export namespace NsGraphEventPlugin {
  export const pluginId = 'GraphEventPlugin'
}

/**
 * 内置的hook contribution
 * 处理 config上的runtime的注册项
 */
@singleton({ contrib: IHookContribution })
export class RuntimeContribution implements IHookContribution<IHooks> {
  toDispose = new DisposableCollection()

  /** 通过optionProvider获取配置 */
  @inject(HookConfig) hookConfig: HookConfig

  /**  代码笔记
   * * hook和hookHub的区别
   * * 字面意思上hookHub多个Hub，Hub这里的意思是hook管理中心或者平台，
   * * 应该是一个触发事件是一个hookHub例如x6Events（见../interface.ts initHooks）就是一个hookHub的实例，
   * * 该实例可以注册很多hook即钩子函数(见./graph.ts registerHook)
   *
   * * 所以hook和hookHub的区别就是hookHub是hook的管理中心，每个hookHub拥有多个hook
   */
  registerHook = async hooks => {
    const { hookRegisterFn } = await this.hookConfig.getConfig()
    const d = hookRegisterFn(hooks)
    return Disposable.create(() => {
      d.dispose()
    })
  }

  registerHookHub = async (registry: IHookService<IHooks>) => {
    const { hookhubRegisterFn } = await this.hookConfig.getConfig()
    const d = hookhubRegisterFn(registry)
    return Disposable.create(() => {
      d.dispose()
    })
  }
}
