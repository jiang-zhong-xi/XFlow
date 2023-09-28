import type React from 'react'
import type { IMenuModel, IMenuTarget } from '@wow/tflow-core'
import { renderMenuOptions } from './menu-render'
import { useModel, useXFlowApp } from '@wow/tflow-core'

interface IProps {
  onHide: () => void
  target: IMenuTarget
  menuModel: IMenuModel
}

export const XFlowMenu: React.FC<IProps> = props => {
  const { menuModel, target, onHide } = props
  const { modelService, commandService } = useXFlowApp()
  const [state] = useModel(menuModel)

  return renderMenuOptions({
    idx: -1,
    target,
    commandService,
    modelService,
    menuOptions: state as any,
    onHide,
  })
}
