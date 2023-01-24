import { Timestamp } from "@google-cloud/firestore";
import { CreateCompletionRequest } from "openai";

export const WORKFLOWS_COLLECTION = "workflows";

export interface TemplateData {
  templateName: string;
  description: string;
  author: string;
  tags: string[];
  runs?: number;
  staleRuns?: boolean;
  createdAt: Timestamp;
}

export interface XYPosition {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: string;
  position: XYPosition;
}

export type GPT3Config = Omit<
  CreateCompletionRequest,
  "model" | "prompt" | "user"
>;

export interface StringNode extends Node {
  type: typeof STRING_BLOCK;
  data: {
    templateString: string;
    variables: string[];
    output?: string;
    outputTitle?: string;
    inputTitle?: string;
  };
}

export interface LMNode extends Node {
  type: typeof LM_BLOCK;
  data: {
    output?: string;
    outputTitle?: string;
    config?: GPT3Config;
  };
}

export interface ImageNode extends Node {
  type: typeof IMAGE_BLOCK;
  data: {
    output?: string;
    outputTitle?: string;
  };
}

export interface URLNode extends Node {
  type: typeof URL_BLOCK;
  data: {
    output?: string;
    outputTitle?: string;
  };
}

export const EXECUTABLE_CODING_LANGUAGES = ["javascript"] as const;
export type ExecutableCodingLanguages =
  typeof EXECUTABLE_CODING_LANGUAGES[number];

export interface CodeExecutionNode extends Node {
  type: typeof CODE_EXECUTION_BLOCK;
  data: {
    language: ExecutableCodingLanguages;
    script: string;
    inputKey: string;
    output?: string;
    outputTitle?: string;
    error?: string;
  };
}

export type PDFReaderMode = "UPLOAD" | "URL";

export type PDFReaderURLMode = "MANUAL_ENTRY" | "BLOCK_INPUT";

/**
 * Note that in this config EITHER the pdfBinary and pdfName should be set OR
 * the pdfURL should be set.
 */
export type PDFReaderConfig = {
  pdfType?: string; // file type. Want "application/pdf"

  pdfBinary?: string; // base64-encoded string of the uploaded PDF
  pdfName?: string; // Title of the uploaded PDF file

  pdfURL?: string; // URL of the PDF

  mode: PDFReaderMode;
  urlInputMode?: PDFReaderURLMode;
};

export interface PDFReaderBlockType extends Node {
  type: typeof PDF_READER_BLOCK;
  data: PDFReaderBlockDataType;
}

export interface PDFReaderBlockDataType {
  output?: string;
  outputTitle?: string;
  error?: string;
  config?: PDFReaderConfig;
}

export interface PromptSearchBlockType extends Node {
  type: typeof PROMPT_SEARCH_BLOCK;
  data: PromptSearchDataType;
}

export interface PromptSearchDataType {
  output?: string;
  error?: string;
}

export interface ImagePromptSearchBlockType extends Node {
  type: typeof IMAGE_PROMPT_SEARCH_BLOCK;
  data: ImagePromptSearchDataType;
}

export interface ImagePromptSearchDataType {
  output?: string;
  error?: string;
}
export interface MultiSummarizationBlockType extends Node {
  type: typeof MULTI_SUMMARIZATION_BLOCK;
  data: MultiSummarizationBlockDataType;
}

export interface MultiSummarizationBlockDataType {
  output?: string;
  outputTitle?: string;
  error?: string;
}

export interface MultiSearchBlockType extends Node {
  type: typeof MULTI_SEARCH_BLOCK;
  data: MultiSearchBlockDataType;
}

export interface MultiSearchBlockDataType {
  output?: string;
  outputTitle?: string;
  error?: string;
}

export interface MultiDocumentQABlockDataType {
  output?: string;
  outputTitle?: string;
  error?: string;
}
export interface MultiDocumentQABlockType extends Node {
  type: typeof MULTI_DOCUMENT_QA_BLOCK;
  data: MultiDocumentQABlockDataType;
}

export interface SwitchBlockDataType {
  output?: Record<string, string>;
  outputTitle?: string;
  regexPatterns: string[];
  error?: string;
}

export interface SwitchBlockType extends Node {
  type: typeof SWITCH_BLOCK;
  data: SwitchBlockDataType;
}

export type CanvasNode =
  | StringNode
  | LMNode
  | ImageNode
  | URLNode
  | CodeExecutionNode
  | PDFReaderBlockType
  | PromptSearchBlockType
  | ImagePromptSearchBlockType
  | MultiSummarizationBlockType
  | MultiSearchBlockType
  | MultiDocumentQABlockType
  | SwitchBlockType;

export interface Edge {
  id: string;
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
}

export interface CanvasData {
  username: string;
  uid: string;
  canvasName: string;
  nodes: CanvasNode[];
  edges: Edge[];
  parent?: string;
  runs?: number;
  createdAt: Timestamp;
}

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

export const SWITCH_BLOCK = "SWITCH_BLOCK";

export type BlockType =
  | typeof LM_BLOCK
  | typeof STRING_BLOCK
  | typeof IMAGE_BLOCK
  | typeof URL_BLOCK
  | typeof CODE_EXECUTION_BLOCK
  | typeof PROMPT_SEARCH_BLOCK
  | typeof IMAGE_PROMPT_SEARCH_BLOCK
  | typeof PDF_READER_BLOCK
  | typeof MULTI_SUMMARIZATION_BLOCK
  | typeof MULTI_SEARCH_BLOCK
  | typeof MULTI_DOCUMENT_QA_BLOCK
  | typeof SWITCH_BLOCK;

export const BlockDisplayName: { [key in BlockType]: string } = {
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
  [SWITCH_BLOCK]: "Switch"
};

// Right now only inputs/outputs are strings
//   Input:
//     - text block
//   Output:
//     - GPT-3 text
//     - SD b64/bucket path
//     - URL content text
export type WorkflowDataType = "string";

export interface WorkflowOutput {
  name?: string;
  blockType?: string;
  type: WorkflowDataType;
}

export interface WorkflowParameter {
  name?: string;
  blockType?: string;
  type: WorkflowDataType;
  optional?: boolean;
}

export interface WorkflowDefinition {
  nodes: CanvasNode[];
  edges: Edge[];
  parameters: WorkflowParameter[];
  inputNodes: string[];
  outputs: WorkflowOutput[];
  outputNodes: string[];
}

export type NodeValidator<BlockType extends CanvasNode = CanvasNode> = (
  block: BlockType,
  incomingEdges: Edge[]
) => boolean;
