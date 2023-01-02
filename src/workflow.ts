import {
  BlockDisplayName,
  BlockType,
  CanvasData,
  Node,
  Edge,
  WorkflowDefinition,
  WorkflowOutput,
  WorkflowParameter,
  XYPosition,
  CanvasNode,
  STRING_BLOCK,
} from "./types";
import { nodeValidators } from "./validator";

export const nodeIsValid = (
  node: CanvasNode,
  incomingEdges: Edge[]
): boolean => {
  const validator = nodeValidators[node.type];
  // If we have a validator, run it. Otherwise, assume the node is valid
  return validator ? validator(node, incomingEdges) : true;
};

const comparePosition = (
  positionA: XYPosition,
  positionB: XYPosition
): number => {
  if (positionA.x < positionB.x) {
    // positionA is further left on canvas, sorts first
    return -1;
  } else if (positionB.x < positionA.x) {
    // positionB is further left on canvas, sorts first
    return 1;
  } else if (positionA.y < positionB.y) {
    // positionA is in the same column but further up on canvas, sorts first
    return -1;
  } else if (positionB.y < positionA.y) {
    // positionA is in the same column but further up on canvas, sorts first
    return 1;
  } else {
    // positions are equal
    return 0;
  }
};

const getAllDescendantsOfNode = (
  nodeId: string,
  outgoingEdgesByNode: Record<string, Edge[]>
): string[] => {
  const descendants = new Set([nodeId]);
  const edgesToVisit = outgoingEdgesByNode[nodeId] || [];
  while (edgesToVisit.length > 0) {
    const currEdge = edgesToVisit.shift();
    if (currEdge && !descendants.has(currEdge.target)) {
      descendants.add(currEdge.target);
      edgesToVisit.push(...(outgoingEdgesByNode[currEdge.target] || []));
    }
  }
  return Array.from(descendants);
};

const getValidCanvas = (
  nodes: CanvasNode[],
  edges: Edge[]
): {
  nodes: CanvasNode[];
  edges: Edge[];
  parameters: WorkflowParameter[];
  inputNodes: string[];
  outputs: WorkflowOutput[];
  outputNodes: string[];
} => {
  // START Build edge mappings
  const nodesById: Record<string, CanvasNode> = {};
  // incomingEdgesByNode[a] = [B] means node 'a' has an incoming edge 'B'
  const incomingEdgesByNode: Record<string, Edge[]> = {};
  // outgoingEdgesByNode[b] = [A] means 'b' has an outgoing edge 'A'
  const outgoingEdgesByNode: Record<string, Edge[]> = {};
  edges.forEach((edge) => {
    const incomingNodes = incomingEdgesByNode[edge.target] || [];
    incomingEdgesByNode[edge.target] = [...incomingNodes, edge];
    const outgoingNodes = outgoingEdgesByNode[edge.source] || [];
    outgoingEdgesByNode[edge.source] = [...outgoingNodes, edge];
  });
  // determine source nodes with no incoming edges, build full nodesById mapping
  const sourceNodes: string[] = [];
  nodes.forEach((node) => {
    nodesById[node.id] = node;
    const incomingEdges = incomingEdgesByNode[node.id];
    if (!incomingEdges) {
      sourceNodes.push(node.id);
    }
  });
  // END

  // START Build 'excludedNodes', containing all invalid nodes and all their descendants
  const excludedNodes: Set<string> = new Set();
  const nodesToVisit = [...sourceNodes];
  while (nodesToVisit.length > 0) {
    const currNodeId = nodesToVisit.shift();
    if (!currNodeId) {
      continue;
    }
    const currNode = nodesById[currNodeId];
    if (!currNode || excludedNodes.has(currNode.id)) {
      continue;
    }
    const isValid = nodeIsValid(
      currNode,
      incomingEdgesByNode[currNode.id] || []
    );
    if (isValid) {
      nodesToVisit.push(
        ...(outgoingEdgesByNode[currNode.id] || []).map((edge) => edge.target)
      );
    } else {
      getAllDescendantsOfNode(currNode.id, outgoingEdgesByNode).forEach(
        (nodeId) => excludedNodes.add(nodeId)
      );
    }
  }
  // END

  // START Build input/output nodes, parameters and outputs
  const validNodes = nodes.filter((node) => !excludedNodes.has(node.id));
  const inputNodes: string[] = [];
  const outputNodes: string[] = [];
  validNodes.forEach((node) => {
    nodesById[node.id] = node;
    if (!(node.id in incomingEdgesByNode) && node.type === STRING_BLOCK) {
      // This node has no incoming edges and is therefore an input node
      inputNodes.push(node.id);
    }
    if (!(node.id in outgoingEdgesByNode)) {
      // This node has no outgoing edges and is therefore an output node
      outputNodes.push(node.id);
    }
  });
  // sort input and output nodes visually
  // NOTE: this MUST match the sorting done on the client-side
  inputNodes.sort((leftNodeId: string, rightNodeId: string) => {
    const leftNode = nodesById[leftNodeId];
    const rightNode = nodesById[rightNodeId];
    return comparePosition(leftNode.position, rightNode.position);
  });
  outputNodes.sort((leftNodeId: string, rightNodeId: string) => {
    const leftNode = nodesById[leftNodeId];
    const rightNode = nodesById[rightNodeId];
    return comparePosition(leftNode.position, rightNode.position);
  });
  // all inputs and outputs are currently strings
  const parameters: WorkflowParameter[] = inputNodes.map((nodeId) => {
    const node = nodesById[nodeId];
    return {
      blockType: BlockDisplayName[nodesById[nodeId].type as BlockType],
      type: "string",
      name: "inputTitle" in node.data ? node.data.inputTitle : undefined,
      nodeId: node.id,
    };
  });
  const outputs: WorkflowOutput[] = outputNodes.map((nodeId) => {
    const node = nodesById[nodeId];
    return {
      blockType: BlockDisplayName[nodesById[nodeId].type as BlockType],
      type: "string",
      name: "outputTitle" in node.data ? node.data["outputTitle"] : undefined,
      nodeId: node.id,
    };
  });
  // END

  return {
    nodes: nodes.filter((node) => !excludedNodes.has(node.id)),
    edges: edges.filter(
      (edge) =>
        !excludedNodes.has(edge.source) && !excludedNodes.has(edge.target)
    ),
    parameters,
    inputNodes,
    outputs,
    outputNodes,
  };
};

export const generateWorkflowDefinition = (
  canvas: CanvasData
): WorkflowDefinition => {
  const {
    nodes: validNodes,
    edges: validEdges,
    parameters,
    inputNodes,
    outputs,
    outputNodes,
  } = getValidCanvas(canvas.nodes, canvas.edges);

  return {
    nodes: validNodes,
    edges: validEdges,
    parameters,
    inputNodes,
    outputs,
    outputNodes,
  };
};
