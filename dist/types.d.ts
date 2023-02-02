import { Timestamp } from "@google-cloud/firestore";
import { CreateCompletionRequest } from "openai";
export declare const WORKFLOWS_COLLECTION = "workflows";
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
export type GPT3Config = Omit<CreateCompletionRequest, "model" | "prompt" | "user">;
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
export declare const EXECUTABLE_CODING_LANGUAGES: readonly ["javascript"];
export type ExecutableCodingLanguages = typeof EXECUTABLE_CODING_LANGUAGES[number];
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
export type PDFReaderConfig = {
    pdfType?: string;
    pdfBinary?: string;
    pdfName?: string;
    pdfStoragePath?: string;
    pdfURL?: string;
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
export declare const SWITCH_OUTPUT_HANDLE_ID_BASE = "switch-output";
export declare const DEFAULT_SWITCH_OUTPUT_HANDLE_ID: string;
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
export type CanvasNode = StringNode | LMNode | ImageNode | URLNode | CodeExecutionNode | PDFReaderBlockType | PromptSearchBlockType | ImagePromptSearchBlockType | MultiSummarizationBlockType | MultiSearchBlockType | MultiDocumentQABlockType | SwitchBlockType | RecursiveCanvasBlockType;
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
export declare const LM_BLOCK = "AGIBLOCK";
export declare const STRING_BLOCK = "STRING_BLOCK";
export declare const IMAGE_BLOCK = "IMAGE_BLOCK";
export declare const URL_BLOCK = "URL_BLOCK";
export declare const CODE_EXECUTION_BLOCK = "CODE_EXECUTION_BLOCK";
export declare const PROMPT_SEARCH_BLOCK = "PROMPT_SEARCH_BLOCK";
export declare const IMAGE_PROMPT_SEARCH_BLOCK = "IMAGE_PROMPT_SEARCH_BLOCK";
export declare const PDF_READER_BLOCK = "PDF_READER_BLOCK";
export declare const MULTI_SUMMARIZATION_BLOCK = "MULTI_SUMMARIZATION_BLOCK";
export declare const MULTI_SEARCH_BLOCK = "MULTI_SEARCH_BLOCK";
export declare const MULTI_DOCUMENT_QA_BLOCK = "MULTI_DOCUMENT_QA_BLOCK";
export declare const RECURSIVE_CANVAS_BLOCK = "RECURSIVE_CANVAS_BLOCK";
export declare const SWITCH_BLOCK = "SWITCH_BLOCK";
export declare const INPUT_BLOCKS: string[];
export type BlockType = typeof LM_BLOCK | typeof STRING_BLOCK | typeof IMAGE_BLOCK | typeof URL_BLOCK | typeof CODE_EXECUTION_BLOCK | typeof PROMPT_SEARCH_BLOCK | typeof IMAGE_PROMPT_SEARCH_BLOCK | typeof PDF_READER_BLOCK | typeof MULTI_SUMMARIZATION_BLOCK | typeof MULTI_SEARCH_BLOCK | typeof MULTI_DOCUMENT_QA_BLOCK | typeof SWITCH_BLOCK | typeof RECURSIVE_CANVAS_BLOCK;
export declare const BlockDisplayName: {
    [key in BlockType]: string;
};
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
export type NodeValidator<BlockType extends CanvasNode = CanvasNode> = (block: BlockType, incomingEdges: Edge[]) => boolean;
