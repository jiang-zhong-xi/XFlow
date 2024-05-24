import type { Disposable, IHook, IHookHub, IRuntimeHook, ScheduleOptions } from './interface'
import { ScheduleTypeEnum } from './interface'
import { ErrorUtils, HookUtils, Deferred } from './utils'

export { ScheduleTypeEnum } from './interface'
export type {
  Disposable,
  IHook,
  IHookHub,
  IRuntimeHook,
  IMainHandler,
  ScheduleOptions,
} from './interface'

export class HookHub<Args = any, Result = Args | null> implements IHookHub<Args, Result> {
  /** hooks */
  private hookMap: Map<string, IHook<Args, Result>>
  /** scheduleType */
  private scheduleType: ScheduleTypeEnum = ScheduleTypeEnum.ASYNC_SRRIES

  constructor(options?: ScheduleOptions) {
    this.hookMap = new Map()
    if (options && options.type) {
      this.scheduleType = options.type
    }
  }
  /** hasRegistered */
  hasHook = (hookName: string): boolean => {
    return this.hookMap.has(hookName)
  }
  /** getHooks */
  getHooks = (
    runtimeHooks: IRuntimeHook<Args, Result> = [],
    sort = true,
  ): IHook<Args, Result>[] => {
    /**  代码笔记
     * * 校验和合并
     */
    const hooks = HookUtils.normalize(runtimeHooks, this.hookMap)
    if (!sort) {
      return hooks
    }
    /**  代码笔记
     * * 拓扑排序
     */
    return HookUtils.sort(hooks, this.hookMap)
  }
  /** registerHook */
  registerHook = (hookMeta: IHook<Args, Result>): Disposable => {
    if (this.hookMap.has(hookMeta.name)) {
      console.error(`${hookMeta.name} is duplicated in hookmap`)
    }
    this.hookMap.set(hookMeta.name, hookMeta)
    return {
      dispose: () => {
        this.hookMap.delete(hookMeta.name)
      },
    }
  }
  /** registerHook */
  call = async (
    args: Args,
    main: (mainArgs: Args) => Promise<Result> = async mainArgs => mainArgs as unknown as Result,
    runtimeHook: IRuntimeHook<Args, Result> = [],
  ): Promise<Result | undefined> => {
    // TODO: 这里加cache
    const hooks = this.getHooks(runtimeHook, true)
    /**  代码笔记
     * * 根据实例化该类时指定的类型获取调度函数，react源码中也有scheduler，和这里一样都是调度任务用的
     * * 这里显然更简单些
     */
    const scheduler = this.schedulers[this.scheduleType]
    return scheduler(args, main, hooks)
  }
  /** 执行hook的scheduler */
  private schedulers = {
    /**  代码笔记
     * * SERIES 字面翻译是连续，连续就是一个接着一个，也就是异步任务排队，然后执行完一个再执行另一个
     * * 通过下面的逻辑可以看出钩子函数的控制权很大，除了执行自己的逻辑，还能控制触发函数（（main函数））的执行
     *
     * * 这样做的好处是比较灵活，表明上理解钩子函数应该是在触发函数执行之前或者之后执行，这里把控制前还是后执行的权力转移到了钩子函数
     * *
     */
    /** pipeline执行 */
    [ScheduleTypeEnum.ASYNC_SRRIES]: async (
      args: Args,
      main: (args: Args) => Promise<Result>,
      hooks: IHook<Args, Result>[] = [],
    ) => {
      let callback: null | ((args: Args) => Promise<Result>) = main
      /** 用 hook 加工 args  */
      for (const hook of hooks) {
        /**  代码笔记
         * * 根据钩子函数的参数个数来传参
         * * 通过钩子函数的返回值控制是否执行触发函数（main函数）
         * * 钩子函数可以在内部执行触发函数并返回一个函数作为触发函数
         */
        if ([0, 1].includes(hook.handler.length)) {
          await hook.handler.call(this, args)
          continue
        }
        if ([2].includes(hook.handler.length) && callback !== null) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const result: void | null | ((args: Args) => Promise<Result>) = await hook.handler.call(
            this,
            args,
            callback,
          )
          /** 如果返回为null，则直接中断执行 */
          if (result === null) {
            callback = null
            break
          } else if (typeof result === 'function') {
            callback = result
            continue
          }
        }
        const err = ErrorUtils.InvalidHookArguments(hook)
        throw err
      }
      /** 检查是否被替换为null */
      if (callback) {
        return await callback.call(this, args)
      }
    },
    /**  代码笔记
     * * PARALLEL 字面翻译是并行，同时发生，这里指的是并行，也就是异步任务同时执行，不排队
     * * 通过Promise.all让所有的任务并发执行
     */
    [ScheduleTypeEnum.ASYNC_PARALLEL]: async (
      args: Args,
      main: (args: Args) => Promise<Result>,
      hooks: IHook<Args, Result>[] = [],
    ) => {
      /** 同时触发 hook */
      const promises = hooks.map(hook => {
        if ([0, 1].includes(hook.handler.length)) {
          return hook.handler.call(this, args)
        }
        if ([2].includes(hook.handler.length)) {
          return hook.handler.call(this, args, main)
        }
        throw ErrorUtils.InvalidHookArguments(hook)
      })
      const defer = new Deferred()
      Promise.all(promises).then(res => defer.resolve(res))
      /** 检查是否被替换 */
      if (main) {
        return await main.call(this, defer as any as Args)
      }
    },
  } as const
}
