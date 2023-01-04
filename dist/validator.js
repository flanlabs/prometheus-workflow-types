"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeValidators = void 0;
const types_1 = require("./types");
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
exports.nodeValidators = {
    [types_1.LM_BLOCK]: hasSingleInput,
    [types_1.STRING_BLOCK]: allFormatStringVariablesSatisfied,
    [types_1.IMAGE_BLOCK]: hasSingleInput,
    [types_1.URL_BLOCK]: hasSingleInput,
    [types_1.CODE_EXECUTION_BLOCK]: hasSingleInput,
    [types_1.MULTI_SUMMARIZATION_BLOCK]: hasSingleInput,
};
//# sourceMappingURL=validator.js.map