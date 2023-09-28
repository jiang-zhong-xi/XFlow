import type { NsNodeCmd, IGraphCommandService, NsGraph } from '@wow/tflow'
import { XFlowNodeCommands, uuidv4 } from '@wow/tflow'

export const addNode = (cmd: IGraphCommandService, nodeConfig: NsGraph.INodeConfig) => {
  return cmd.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
    nodeConfig: { ...nodeConfig, id: uuidv4(), width: 190, height: 32 },
  })
}
