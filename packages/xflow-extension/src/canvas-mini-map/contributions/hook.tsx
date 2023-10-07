import type { ICmdHooks } from '@jiangzhongxi0322/tflow-core'
import { DisposableCollection, Disposable } from '@jiangzhongxi0322/tflow-core'
import { IHookContribution, ManaSyringe } from '@jiangzhongxi0322/tflow-core'
import { IMinimapConfigProvider } from '../interface'

/**
 * 内置的hook contribution
 * 处理 config上的runtime的注册项
 */
@ManaSyringe.singleton({ contrib: IHookContribution })
export class HookContribution implements IHookContribution<ICmdHooks> {
  toDispose = new DisposableCollection()

  @ManaSyringe.inject(IMinimapConfigProvider)
  private minimapConfig: IMinimapConfigProvider

  registerHookHub = async () => {
    return Disposable.create(() => {})
  }

  registerHook = async (hooks: ICmdHooks) => {
    const toDispose = new DisposableCollection()
    const disposables = [
      hooks.graphOptions.registerHook({
        name: 'add minimap options',
        handler: async args => {
          // 对齐线配置，辅助移动节点排版（详细文档：https://X6.antv.vision/zh/docs/tutorial/basic/snapline）
          const minimapOptions = await this.minimapConfig.getConfig()
          args.minimap = {
            ...minimapOptions,
          }
        },
      }),
    ]
    toDispose.pushAll(disposables)
    return Disposable.create(() => {})
  }
}
