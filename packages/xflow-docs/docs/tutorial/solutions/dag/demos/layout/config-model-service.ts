import type { IModelService } from '@jiangzhongxi0322/tflow'
import { createModelServiceConfig } from '@jiangzhongxi0322/tflow'

export namespace NS_LOADING_STATE {
  export const id = 'test'
  export interface IState {
    loading: boolean
  }
}

export const useModelServiceConfig = createModelServiceConfig(config => {
  config.registerModel(registry => {
    return registry.registerModel({
      id: NS_LOADING_STATE.id,
      getInitialValue: () => {
        loading: true
      },
    })
  })
})

export const useLoadingState = async (contextService: IModelService) => {
  const ctx = await contextService.awaitModel<NS_LOADING_STATE.IState>(NS_LOADING_STATE.id)
  return ctx.getValidValue()
}
