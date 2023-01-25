import { CanvasData, Edge, WorkflowDefinition, CanvasNode } from "./types.js";
export declare const DEFAULT_SOURCE_HANDLE_ID = "output";
export declare const nodeIsValid: (node: CanvasNode, incomingEdges: Edge[]) => boolean;
export declare const generateWorkflowDefinition: (canvas: CanvasData) => WorkflowDefinition;
