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
  MULTI_SUMMARIZATION_BLOCK,
  MULTI_SEARCH_BLOCK,
  SWITCH_BLOCK,
} from "./types.js";

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

const MAX_SWITCH_BLOCK_REGEX_PATTERNS = 4;

const hasWellFormedRegexValues = (node: CanvasNode, _: Edge[]): boolean => {
  if (node.type !== SWITCH_BLOCK || !node?.data || !("regexPatterns" in node.data)) {
    return false;
  }
  const regexPatterns = node.data.regexPatterns;
  if (Object.keys(regexPatterns).length > MAX_SWITCH_BLOCK_REGEX_PATTERNS) {
    return false;
  }
  try {
    // if any of the regex patterns are invalid, the RegExp constructor will throw an Error
    Object.keys(regexPatterns).forEach((key) => new RegExp(regexPatterns[key]))
  } catch {
    return false;
  }
  return true;
}

const composeValidators = (...validators: NodeValidator[]): NodeValidator => (
  (node: CanvasNode, edges: Edge[]) => validators.every((validator) => validator(node, edges))
);

export const nodeValidators: {
  [key: string]: NodeValidator;
} = {
  [LM_BLOCK]: hasSingleInput,
  [STRING_BLOCK]: allFormatStringVariablesSatisfied,
  [IMAGE_BLOCK]: hasSingleInput,
  [URL_BLOCK]: hasSingleInput,
  [CODE_EXECUTION_BLOCK]: hasSingleInput,
  [MULTI_SUMMARIZATION_BLOCK]: hasSingleInput,
  [MULTI_SEARCH_BLOCK]: hasSingleInput,
  [SWITCH_BLOCK]: composeValidators(hasSingleInput, hasWellFormedRegexValues),
};
