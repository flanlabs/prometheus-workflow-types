export const WORKFLOWS_COLLECTION = "workflows";
export const EXECUTABLE_CODING_LANGUAGES = ["javascript"];
export const SWITCH_OUTPUT_HANDLE_ID_BASE = "switch-output";
export const DEFAULT_SWITCH_OUTPUT_HANDLE_ID = `${SWITCH_OUTPUT_HANDLE_ID_BASE}-default`;
export const LM_BLOCK = "AGIBLOCK";
export const STRING_BLOCK = "STRING_BLOCK";
export const IMAGE_BLOCK = "IMAGE_BLOCK";
export const URL_BLOCK = "URL_BLOCK";
export const CODE_EXECUTION_BLOCK = "CODE_EXECUTION_BLOCK";
export const PROMPT_SEARCH_BLOCK = "PROMPT_SEARCH_BLOCK";
export const IMAGE_PROMPT_SEARCH_BLOCK = "IMAGE_PROMPT_SEARCH_BLOCK";
export const PDF_READER_BLOCK = "PDF_READER_BLOCK";
export const MULTI_SUMMARIZATION_BLOCK = "MULTI_SUMMARIZATION_BLOCK";
export const MULTI_SEARCH_BLOCK = "MULTI_SEARCH_BLOCK";
export const MULTI_DOCUMENT_QA_BLOCK = "MULTI_DOCUMENT_QA_BLOCK";
export const RECURSIVE_CANVAS_BLOCK = "RECURSIVE_CANVAS_BLOCK";
export const SWITCH_BLOCK = "SWITCH_BLOCK";
export const INPUT_BLOCKS = [STRING_BLOCK, PDF_READER_BLOCK];
export const BlockDisplayName = {
    [LM_BLOCK]: "AI Text",
    [STRING_BLOCK]: "Text",
    [IMAGE_BLOCK]: "AI Image",
    [URL_BLOCK]: "URL Text",
    [CODE_EXECUTION_BLOCK]: "Code Execution",
    [PROMPT_SEARCH_BLOCK]: "AI Text",
    [IMAGE_PROMPT_SEARCH_BLOCK]: "AI Text",
    [PDF_READER_BLOCK]: "PDF Reader",
    [MULTI_SUMMARIZATION_BLOCK]: "Multi Summarization",
    [MULTI_SEARCH_BLOCK]: "Multi Search",
    [MULTI_DOCUMENT_QA_BLOCK]: "Multi Document Q&A",
    [SWITCH_BLOCK]: "Switch",
    [RECURSIVE_CANVAS_BLOCK]: "Recursive Canvas Block",
};
//# sourceMappingURL=types.js.map