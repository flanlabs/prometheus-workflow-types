import {
  Node,
  Edge,
  IMAGE_BLOCK,
  LM_BLOCK,
  NodeValidator,
  STRING_BLOCK,
  URL_BLOCK,
  CanvasNode,
  CODE_EXECUTION_BLOCK,
  MULTI_SEARCH_BLOCK,
} from "./types";

const hasSingleInput = (_: Node, edges: Edge[]): boolean => {
  return edges.length === 1;
};

const allFormatStringVariablesSatisfied = (
  node: CanvasNode,
  edges: Edge[]
): boolean => {
  if (
    !node?.data ||
    !("variables" in node.data) ||
    !Array.isArray(node.data.variables)
  ) {
    return false;
  }
  return node.data.variables.every((variable) =>
    edges.some((edge) => edge.targetHandle === variable)
  );
};

export const nodeValidators: {
  [key: string]: NodeValidator;
} = {
  [LM_BLOCK]: hasSingleInput,
  [STRING_BLOCK]: allFormatStringVariablesSatisfied,
  [IMAGE_BLOCK]: hasSingleInput,
  [URL_BLOCK]: hasSingleInput,
  [CODE_EXECUTION_BLOCK]: hasSingleInput,
  [MULTI_SEARCH_BLOCK]: hasSingleInput,
};
