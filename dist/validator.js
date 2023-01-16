import { IMAGE_BLOCK, LM_BLOCK, STRING_BLOCK, URL_BLOCK, CODE_EXECUTION_BLOCK, MULTI_SUMMARIZATION_BLOCK, MULTI_SEARCH_BLOCK, SWITCH_BLOCK, } from "./types.js";
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
const MAX_SWITCH_BLOCK_REGEX_PATTERNS = 4;
const hasWellFormedRegexValues = (node, _) => {
    if (node.type !== SWITCH_BLOCK || !(node === null || node === void 0 ? void 0 : node.data) || !("regexPatterns" in node.data)) {
        return false;
    }
    const regexPatterns = node.data.regexPatterns;
    if (Object.keys(regexPatterns).length > MAX_SWITCH_BLOCK_REGEX_PATTERNS) {
        return false;
    }
    try {
        Object.keys(regexPatterns).forEach((key) => new RegExp(regexPatterns[key]));
    }
    catch (_a) {
        return false;
    }
    return true;
};
const composeValidators = (...validators) => ((node, edges) => validators.every((validator) => validator(node, edges)));
export const nodeValidators = {
    [LM_BLOCK]: hasSingleInput,
    [STRING_BLOCK]: allFormatStringVariablesSatisfied,
    [IMAGE_BLOCK]: hasSingleInput,
    [URL_BLOCK]: hasSingleInput,
    [CODE_EXECUTION_BLOCK]: hasSingleInput,
    [MULTI_SUMMARIZATION_BLOCK]: hasSingleInput,
    [MULTI_SEARCH_BLOCK]: hasSingleInput,
    [SWITCH_BLOCK]: composeValidators(hasSingleInput, hasWellFormedRegexValues),
};
//# sourceMappingURL=validator.js.map