import React from 'react'
import { useExtensionRegistry } from '../../xflow-main/components/extension-context'
import { createModule } from '../module'
import { CommandConfig } from '../config'

export interface IProps {
  config?: CommandConfig
}

export const CommandsRegistry: React.FC<IProps> = props => {
  /** 生成配置中心 */
  const extensionRegistry = useExtensionRegistry()

  /** 获取ContextMenu的配置 */
  const config = React.useMemo<CommandConfig>(
    () => (props.config ? props.config : new CommandConfig()),
    /* eslint-disable-next-line  */
    [],
  )

  React.useEffect(() => {
    /**  代码笔记
     * * 注册模块（插件）
     */
    extensionRegistry.addCoreModule({
      config: config,
      createModule,
    })
    /* eslint-disable-next-line  */
  }, [])

  return null
}

// 缓存props
interface IValueProxy<T> {
  getValue: () => T
}
/**  代码笔记
 * * 这是暴露给开发人员（框架使用者）调用的API，要求开发人员传入一个回调函数A
 * * 这个API会创建CommandConfig的实例C
 * * 通过A(C)的调用开发人员把自定义的部分赋值到实例C上
 * * 把经过自定义的实例C传给Xflow属性，然后在command-contributions的模块绑定过程中把从Xflow属性获取的C实例绑定到mana-syringe上
 * * command-contributions初始化的时候，获取实例C上的自定义部分，注册到GraphCommandRegistry
 */
export const createCmdConfig =
  <T extends unknown = any>(
    addOptions: (config: CommandConfig, container: IValueProxy<T>) => void,
  ) =>
  /**  代码笔记
   * * 注意createCmdConfig返回的是一个函数，函数允许传递参数a，该参数是一个自定义react hooks B
   * * 参数a最终也会传入回调函数A
   */
  (value?: T) => {
    /**  代码笔记
     * * 分开的目的是为了规避ts提示，因为如果写在一起，ts会要求在依赖数组中加上value
     * * 通过React.useMemo是为了第一次的value再后续B的调用都能访问到
     */
    /** bridge config and value */
    const valueContainer = React.useMemo(() => ({ getValue: () => ({} as T) }), [])
    valueContainer.getValue = () => value

    const hookConfig = React.useMemo(() => {
      const config = new CommandConfig()
      /**  代码笔记
       * * 把commandConfig的实例对象交给开发人员也就是回调函数A去修改去自定义
       */
      addOptions(config, valueContainer)
      return config
    }, [valueContainer])

    return hookConfig
  }
