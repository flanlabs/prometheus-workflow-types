import { Timestamp } from "@google-cloud/firestore";
import { CreateCompletionRequest } from "openai";

export const WORKFLOWS_COLLECTION = "workflows";

export type NodeOutputType = Record<string, string>;

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

export interface NodeData {
  output?: NodeOutputType;
  outputTitle?: string;
  inputTitle?: string;
  error?: string;
  didNotExecute?: boolean;
}

export type GPT3Config = Omit<
  CreateCompletionRequest,
  "model" | "prompt" | "user"
>;

export interface StringNode extends Node {
  type: typeof STRING_BLOCK;
  data: StringNodeData;
}

export interface StringNodeData extends NodeData {
  templateString: string;
  variables: string[];
}

export interface LMNode extends Node {
  type: typeof LM_BLOCK;
  data: LMNodeData;
}

export interface LMNodeData extends NodeData {
  config?: GPT3Config;
}

export interface ImageNode extends Node {
  type: typeof IMAGE_BLOCK;
  data: NodeData;
}

export interface URLNode extends Node {
  type: typeof URL_BLOCK;
  data: NodeData;
}

export const EXECUTABLE_CODING_LANGUAGES = ["javascript"] as const;
export type ExecutableCodingLanguages =
  typeof EXECUTABLE_CODING_LANGUAGES[number];

export interface CodeExecutionNode extends Node {
  type: typeof CODE_EXECUTION_BLOCK;
  data: CodeExecutionNodeData;
}

export interface CodeExecutionNodeData extends NodeData {
  language: ExecutableCodingLanguages;
  script: string;
  inputKey: string;
}

export type PDFReaderMode = "UPLOAD" | "URL" | "WORKFLOW_INPUT";

export type PDFReaderURLMode = "MANUAL_ENTRY" | "BLOCK_INPUT";

/**
 * Note that in this config EITHER the pdfBinary and pdfName should be set OR
 * the pdfURL should be set.
 */
export type PDFReaderConfig = {
  pdfType?: string; // file type. Want "application/pdf"

  pdfBinary?: string; // base64-encoded string of the uploaded PDF
  pdfName?: string; // Title of the uploaded PDF file
  pdfStoragePath?: string; // GCS path of uploaded PDF
  pdfURL?: string; // URL of the PDF

  mode: PDFReaderMode;
  urlInputMode?: PDFReaderURLMode;
};

export interface PDFReaderBlockType extends Node {
  type: typeof PDF_READER_BLOCK;
  data: PDFReaderBlockDataType;
}

export interface PDFReaderBlockDataType extends NodeData {
  config?: PDFReaderConfig;
}

export interface PromptSearchBlockType extends Node {
  type: typeof PROMPT_SEARCH_BLOCK;
  data: NodeData;
}

export interface ImagePromptSearchBlockType extends Node {
  type: typeof IMAGE_PROMPT_SEARCH_BLOCK;
  data: NodeData;
}

export interface MultiSummarizationBlockType extends Node {
  type: typeof MULTI_SUMMARIZATION_BLOCK;
  data: NodeData;
}

export interface MultiSearchBlockType extends Node {
  type: typeof MULTI_SEARCH_BLOCK;
  data: NodeData;
}

export interface MultiDocumentQABlockType extends Node {
  type: typeof MULTI_DOCUMENT_QA_BLOCK;
  data: NodeData;
}

export interface SwitchBlockDataType extends NodeData {
  regexPatterns: string[];
}

export interface SwitchBlockType extends Node {
  type: typeof SWITCH_BLOCK;
  data: SwitchBlockDataType;
}

export const SWITCH_OUTPUT_HANDLE_ID_BASE = "switch-output";
export const DEFAULT_SWITCH_OUTPUT_HANDLE_ID = `${SWITCH_OUTPUT_HANDLE_ID_BASE}-default`;

export interface RecursiveCanvasBlockData extends NodeData {
  id: string;
  uid: string;
  parentCanvasId: string;
  canvasName: string;
  inputKeys: string[];
  outputKeys: string[];
}

export interface RecursiveCanvasBlockType extends Node {
  type: typeof RECURSIVE_CANVAS_BLOCK;
  data: RecursiveCanvasBlockData;
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
  | SwitchBlockType
  | RecursiveCanvasBlockType;

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
export const RECURSIVE_CANVAS_BLOCK = "RECURSIVE_CANVAS_BLOCK";

export const SWITCH_BLOCK = "SWITCH_BLOCK";

export const INPUT_BLOCKS = [STRING_BLOCK, PDF_READER_BLOCK];

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
  | typeof SWITCH_BLOCK
  | typeof RECURSIVE_CANVAS_BLOCK;

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
  [SWITCH_BLOCK]: "Switch",
  [RECURSIVE_CANVAS_BLOCK]: "Recursive Canvas Block",
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
