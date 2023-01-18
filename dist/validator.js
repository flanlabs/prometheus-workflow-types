import { IMAGE_BLOCK, LM_BLOCK, STRING_BLOCK, URL_BLOCK, CODE_EXECUTION_BLOCK, MULTI_SUMMARIZATION_BLOCK, MULTI_SEARCH_BLOCK, } from "./types.js";
const hasSingleInput = (_, edges) => {
    return edges.length === 1;
};
const allFormatStringVariablesSatisfied = (node, edges) => {
    if (!(node === null || node === void 0 ? void 0 : node.data) ||
        !("variables" in node.data) ||
        !Array.isArray(node.data.variables)) {
        return false;
    }
    return node.data.variables.every((variable) => edges.some((edge) => edge.targetHandle === variable));
};
export const nodeValidators = {
    [LM_BLOCK]: hasSingleInput,
    [STRING_BLOCK]: allFormatStringVariablesSatisfied,
    [IMAGE_BLOCK]: hasSingleInput,
    [URL_BLOCK]: hasSingleInput,
    [CODE_EXECUTION_BLOCK]: hasSingleInput,
    [MULTI_SUMMARIZATION_BLOCK]: hasSingleInput,
    [MULTI_SEARCH_BLOCK]: hasSingleInput,
};
//# sourceMappingURL=validator.js.map