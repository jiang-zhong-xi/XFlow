/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-classes-per-file */
import { inject, singleton, contrib, Contribution } from 'mana-syringe'
import type { Registry } from '@antv/x6'
import { Node as X6Node, Edge as X6Edge } from '@antv/x6'
import type { IGraphPipelineCommand } from '../command/interface'
import type { MaybePromise } from '../common/types'
import type { IRuntimeHook } from '@jiangzhongxi0322/tflow-hook/es/interface'
import { IGraphProvider } from '../xflow-main/graph/graph-provider'
import { IGraphCommandService } from '../command/interface'
import { IModelService } from '../model-service'
import { IFrontendApplicationContribution } from './interface'
import { cellsToJson } from '../common/graph-utils'

export { IFrontendApplicationContribution } from './interface'

const TIMER_WARNING_THRESHOLD = 100
/**  代码笔记
 * * singleton声明FrontendApplication（FA）是单例的
 * * FA是“门户”，开发者通过useXFlowApp或者API回调参数都可以获取FA的实例
 */
@singleton()
export class FrontendApplication {
  /**  代码笔记
   * * contrib不同于inject，contrib注入的是一个集合，inject注入的是一个对象
   * * contrib使用的过程如下：
   * * 1. mana-syringe暴露了一个函数Contrition
   * * 2. 通过Contribution.register(register, IFrontendApplicationContribution)绑定了一个token（IFrontendApplicationContribution）和一个useDynamic，useDynamic是一个函数，函数范围一个类（A）的实例
   * * 3. 在FA中通过下面的代码获取到IFrontendApplicationContribution这个token对应的对象~类A的实例a
   * * 4. 其它的类，想加入这个集合通过类似contrib: [IFrontendApplicationContribution, IGraphCommandService]的方式“声明”，包括GraphCommandRegistry、HookRegistry、KeyBindingRegistry、MenuRegistry、ModelRegistry、ToolbarRegistry
   * * 5. 通过a.getContributions方式获取所有token为IFrontendApplicationContribution的对象的集合
   *
   * * contribution翻译时同样是贡献，但这里翻译为插件可能更合适，某个类通过插件的方式增强了自己的作用，这也是一种高内聚低耦合的方式，类只负责获取和使用插件对象，而具体的绑定由插件类自己完成
   *
   * * 加入类中由很多成员对象都有一个过程，比如初始化，那么就可以通过contribution的方式，让有共同过程的对象很容易的实现
   */
  /** app的扩展 */
  @contrib(IFrontendApplicationContribution)
  protected readonly contributions!: Contribution.Provider<IFrontendApplicationContribution>

  /** graphProvider */
  @inject(IGraphProvider)
  public readonly graphProvider!: IGraphProvider

  /** commandService */
  @inject(IGraphCommandService)
  public readonly commandService!: IGraphCommandService

  /** modelService */
  @inject(IModelService)
  public readonly modelService!: IModelService

  /** 启动app */
  public async start(): Promise<void> {
    await this.startContributions()
    this.registerEventListeners()
  }

  /** 获取画布实例 */
  public getGraphInstance = () => {
    return this.graphProvider.getGraphInstance()
  }

  /** 获取画布配置项 */
  public getGraphConfig = () => {
    return this.graphProvider.getGraphOptions()
  }

  /** 获取画布配置项 */
  public getGraphData = async () => {
    const graph = await this.graphProvider.getGraphInstance()
    const cells = graph.getCells()
    return cellsToJson(cells)
  }

  /** 获取画布所有节点 */
  public getAllNodes = async () => {
    const graph = await this.graphProvider.getGraphInstance()
    return graph.getNodes()
  }

  /** 获取画布节点 */
  public getNodeById = async (nodeId: string) => {
    const graph = await this.graphProvider.getGraphInstance()
    return graph.getCellById(nodeId) as X6Node
  }

  /** 获取画布所有连线 */
  public getAllEdges = async () => {
    const graph = await this.graphProvider.getGraphInstance()
    return graph.getEdges()
  }

  /** 获取画布连线 */
  public getEdgeById = async (edgeId: string) => {
    const graph = await this.graphProvider.getGraphInstance()
    return graph.getCellById(edgeId) as X6Edge
  }

  /** 更新节点样式 */
  public updateNodeAttrs = async (node: string | X6Node, attrs: Registry.Attr.CellAttrs) => {
    if (node instanceof X6Node) {
      node.setAttrs(attrs)
    } else {
      const x6Node = await this.getNodeById(node)
      x6Node.setAttrs(attrs)
    }
  }

  /** 更新连线样式 */
  public updateEdgeAttrs = async (edge: string | X6Edge, attrs: Registry.Attr.CellAttrs) => {
    if (edge instanceof X6Edge) {
      edge.setAttrs(attrs)
    } else {
      const x6Edge = await this.getEdgeById(edge)
      x6Edge.setAttrs(attrs)
    }
  }

  /** 平移画布 */
  public translateGraph = async (tx: number, ty: number) => {
    const graph = await this.graphProvider.getGraphInstance()
    const currentTranslate = graph.translate()
    graph.translate(currentTranslate.tx + tx, currentTranslate.ty + ty)
  }

  /** 暴露命令的执行接口 */
  public executeCommand<Args = any, Result = any>(
    commandId: string,
    cmdArgs: Args,
    hook: IRuntimeHook<Args, Result> = [],
  ) {
    return this.commandService.executeCommand<Args, Result>(commandId, cmdArgs, hook)
  }

  /** 暴露命令的批量执行接口 */
  public executeCommandPipeline(cmdOptions: IGraphPipelineCommand[]) {
    return this.commandService.executeCommandPipeline(cmdOptions)
  }

  /**
   * Register global event listeners.
   */
  protected registerEventListeners(): void {
    /** 触发app的卸载逻辑 */
    window.addEventListener('unload', () => {
      this.stopContributions()
    })
  }

  /**
   * Initialize and start the frontend application contributions.
   */
  protected async startContributions(): Promise<void> {
    console.log(this.contributions.getContributions())
    for (const contribution of this.contributions.getContributions()) {
      if (contribution.onStart) {
        try {
          await this.measure(`${contribution.constructor.name}.onStart`, () =>
            contribution.onStart!(this),
          )
        } catch (error) {
          console.error('Could not start contribution', error)
        }
      }
    }
  }

  /**
   * Stop the frontend application contributions. This is called when the window is unloaded.
   */
  protected stopContributions(): void {
    console.info('>>> Stopping frontend contributions...')
    for (const contribution of this.contributions.getContributions()) {
      if (contribution.onStop) {
        try {
          contribution.onStop(this)
        } catch (error) {
          console.error('Could not stop contribution', error)
        }
      }
    }
    console.info('<<< All frontend contributions have been stopped.')
  }

  protected async measure<T>(name: string, fn: () => MaybePromise<T>): Promise<T> {
    const startMark = `${name}-start`
    const endMark = `${name}-end`
    performance.mark(startMark)
    const result = await fn()
    performance.mark(endMark)
    performance.measure(name, startMark, endMark)
    for (const item of performance.getEntriesByName(name)) {
      const contribution = `Frontend ${item.name}`
      if (item.duration > TIMER_WARNING_THRESHOLD) {
        console.warn(`${contribution} is slow, took: ${item.duration.toFixed(1)} ms`)
      } else {
        console.debug(`${contribution} took: ${item.duration.toFixed(1)} ms`)
      }
    }
    performance.clearMeasures(name)
    return result
  }
}
