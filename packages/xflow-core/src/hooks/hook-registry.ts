import type { Disposable } from '../common/disposable'
import type { HookHub } from '@jiangzhongxi0322/tflow-hook'
import type { IHooks } from './interface'
import { singleton, Contribution, contrib } from 'mana-syringe'
import { DisposableCollection } from '../common/disposable'
import { IFrontendApplicationContribution } from '../xflow-main/interface'
import { initHooks, IHookService, IHookContribution } from './interface'

@singleton({ contrib: [IFrontendApplicationContribution, IHookService] })
export class HookRegistry<T extends IHooks>
  implements IFrontendApplicationContribution, IHookService<T>
{
  /** disposables */
  private toDispose = new DisposableCollection()

  /** hooks */
  hooks: T

  constructor() {
    this.hooks = initHooks() as T
  }

  /** hooks */
  hookProvider = () => this.hooks

  /** 注册hook插件 */
  registerHook = (fn: (hooks: T) => Disposable) => {
    return fn(this.hooks)
  }

  /**  代码笔记
   * * 注册hookHub，this.hooks其实命名为this.hookHubs更合适，因为this.hooks存储的键值对，每个值都是一个HookHub的实例，而每个HookHub都可以注册更多的hook
   * * hookHub和hook的区别见contributions/default.ts RuntimeContribution.registerHook
   */
  /** 注册hook  */
  registerHookHub = (hookName: string, hook: HookHub) => {
    this.hooks[hookName] = hook
    return {
      dispose: () => {
        delete this.hooks[hookName]
      },
    }
  }
  /**  代码笔记
   * * hooks扩展包括XFlowCommandContribution、RuntimeContribution、GraphEventContribution以及xflow-extension模块中的一些类
   * * XFlowCommandContribution每个命令都可以注册hook
   * * RuntimeContribution 处理config中的hook，而config中hook主要是外部注册的
   * * GraphEventContribution 内置hook
   */

  /** hook扩展 */
  @contrib(IHookContribution)
  protected readonly contributionProvider: Contribution.Provider<IHookContribution<T>>

  /** app启动时，收集hook扩展点的注册项 */
  onStart = async () => {
    /**  代码笔记
     * * contributions.default用来给开发者（使用此框架的人）添加钩子
     * * 而contributions.graph则用来添加一些内部钩子
     */
    const contributions = this.contributionProvider.getContributions()
    for (const contribution of contributions) {
      contribution.registerHookHub(this)
    }
    for (const contribution of contributions) {
      contribution.registerHook(this.hooks)
    }
  }

  /** app的停止逻辑 */
  onStop(): void {
    this.toDispose.dispose()
  }
}
