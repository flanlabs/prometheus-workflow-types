import { CanvasData, Edge, WorkflowDefinition, CanvasNode } from "./types";
export declare const nodeIsValid: (node: CanvasNode, incomingEdges: Edge[]) => boolean;
export declare const generateWorkflowDefinition: (canvas: CanvasData) => WorkflowDefinition;
