import 'reflect-metadata'
/** Application 扩展依赖 */
import {
  ICommandHandler,
  IGraphCommandFactory,
  ICommandContextProvider,
} from '../command/interface'
import { Module } from 'mana-syringe'
import { CmdContext } from './cmd-context'
import type { IRuntimeHook } from '@jiangzhongxi0322/tflow-hook/es/interface'

/** Commands */
import type { CommandConfig } from './config'
import { registerCommandConfig } from './config'
import { registerXFlowCommandContribution } from './command-contribution'
import { GraphMappingHelper } from './mapping-service'

/** 依赖扩展模块，必须要加载 */
/**  代码笔记
 * * 把模块内的子模块绑定到mana-syringe上
 */
export const createModule = (commandConfig: CommandConfig) => {
  return Module(register => {
    /** 注册 mapping helper */
    register(GraphMappingHelper)

    /** 注册 CommandConfig */
    registerCommandConfig(register, commandConfig)

    /** 注册 Command扩展 */
    /**  代码笔记
     * * 扩展包括node、edge、graph等，这样才能通过container.get获取到某一个命令类如AddNodeCommand
     */
    registerXFlowCommandContribution(register, commandConfig)

    /** 注册 Context Clz */
    register<CmdContext>(CmdContext)

    /** ICommandHandler 工厂 */
    register<ICommandHandler>(IGraphCommandFactory, {
      useFactory: context => {
        return (commandId: string, args: any, hook: IRuntimeHook) => {
          /**  代码笔记
           * * child的目的是为了隔离性，见https://yiyan.baidu.com/share/4dm7qcKIgC
           * * 这样让每个factory都有自己的context
           */
          const child = context.container.createChild()
          /** 实例化 Context */
          const cmdContext = child.get<CmdContext>(CmdContext)
          /** 绑定 CommandContext 工厂类 */
          child.register<ICommandContextProvider>(ICommandContextProvider, {
            useDynamic: () => {
              return () => cmdContext
            },
          })
          // 绑定的过程见registerXFlowCommandContribution
          /** 实例化CommandHandler */
          const commandHandler = child.getNamed<ICommandHandler>(ICommandHandler, commandId)
          /** 设置参数 */
          cmdContext.setArgs(args, hook)
          /** 绑定关系 */
          cmdContext.handlerInstance = commandHandler
          return commandHandler
        }
      },
    })
  })
}
