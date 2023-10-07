import type { NsJsonSchemaForm } from '@jiangzhongxi0322/tflow'
import { EditorShape } from './custom-editor'
import { LinkShape } from './link'

/** 自定义form控件 */
export enum ControlShapeEnum {
  'EDITOR' = 'EDITOR',
  'LINKSHAPE' = 'LINKSHAPE',
}

export const controlMapService: NsJsonSchemaForm.IControlMapService = controlMap => {
  controlMap.set(ControlShapeEnum.EDITOR, EditorShape)
  controlMap.set(ControlShapeEnum.LINKSHAPE, LinkShape)
  return controlMap
}
