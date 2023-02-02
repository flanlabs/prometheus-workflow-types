import { BlockDisplayName, PDF_READER_BLOCK, } from "./types.js";
import { nodeValidators } from "./validator.js";
export const DEFAULT_SOURCE_HANDLE_ID = "output";
export const nodeIsValid = (node, incomingEdges) => {
    const validator = nodeValidators[node.type];
    return validator ? validator(node, incomingEdges) : true;
};
export const checkIsInput = (node, hasIncomingEdges) => {
    var _a;
    if (hasIncomingEdges) {
        return false;
    }
    if (node.type === "STRING_BLOCK") {
        return true;
    }
    if (node.type === PDF_READER_BLOCK && ((_a = node.data.config) === null || _a === void 0 ? void 0 : _a.mode) === "WORKFLOW_INPUT") {
        return true;
    }
    return false;
};
const comparePosition = (positionA, positionB) => {
    if (positionA.x < positionB.x) {
        return -1;
    }
    else if (positionB.x < positionA.x) {
        return 1;
    }
    else if (positionA.y < positionB.y) {
        return -1;
    }
    else if (positionB.y < positionA.y) {
        return 1;
    }
    else {
        return 0;
    }
};
const getAllDescendantsOfNode = (nodeId, outgoingEdgesByNode) => {
    const descendants = new Set([nodeId]);
    const edgesToVisit = outgoingEdgesByNode[nodeId] || [];
    while (edgesToVisit.length > 0) {
        const currEdge = edgesToVisit.shift();
        if (currEdge && !descendants.has(currEdge.target)) {
            descendants.add(currEdge.target);
            edgesToVisit.push(...(outgoingEdgesByNode[currEdge.target] || []));
        }
    }
    return Array.from(descendants);
};
const getValidCanvas = (nodes, edges) => {
    const nodesById = {};
    const incomingEdgesByNode = {};
    const outgoingEdgesByNode = {};
    edges.forEach((edge) => {
        const incomingNodes = incomingEdgesByNode[edge.target] || [];
        incomingEdgesByNode[edge.target] = [...incomingNodes, edge];
        const outgoingNodes = outgoingEdgesByNode[edge.source] || [];
        outgoingEdgesByNode[edge.source] = [...outgoingNodes, edge];
    });
    const sourceNodes = [];
    nodes.forEach((node) => {
        nodesById[node.id] = node;
        const incomingEdges = incomingEdgesByNode[node.id];
        if (!incomingEdges) {
            sourceNodes.push(node.id);
        }
    });
    const excludedNodes = new Set();
    const nodesToVisit = [...sourceNodes];
    while (nodesToVisit.length > 0) {
        const currNodeId = nodesToVisit.shift();
        if (!currNodeId) {
            continue;
        }
        const currNode = nodesById[currNodeId];
        if (!currNode || excludedNodes.has(currNode.id)) {
            continue;
        }
        const isValid = nodeIsValid(currNode, incomingEdgesByNode[currNode.id] || []);
        if (isValid) {
            nodesToVisit.push(...(outgoingEdgesByNode[currNode.id] || []).map((edge) => edge.target));
        }
        else {
            getAllDescendantsOfNode(currNode.id, outgoingEdgesByNode).forEach((nodeId) => excludedNodes.add(nodeId));
        }
    }
    const validNodes = nodes.filter((node) => !excludedNodes.has(node.id));
    const inputNodes = [];
    const outputNodes = [];
    validNodes.forEach((node) => {
        nodesById[node.id] = node;
        const nodeHasIncomingEdges = node.id in incomingEdgesByNode;
        if (checkIsInput(node, nodeHasIncomingEdges)) {
            inputNodes.push(node.id);
        }
        const nodeHasOutgoingEdges = node.id in outgoingEdgesByNode;
        if (!nodeHasOutgoingEdges) {
            outputNodes.push(node.id);
        }
    });
    inputNodes.sort((leftNodeId, rightNodeId) => {
        const leftNode = nodesById[leftNodeId];
        const rightNode = nodesById[rightNodeId];
        return comparePosition(leftNode.position, rightNode.position);
    });
    outputNodes.sort((leftNodeId, rightNodeId) => {
        const leftNode = nodesById[leftNodeId];
        const rightNode = nodesById[rightNodeId];
        return comparePosition(leftNode.position, rightNode.position);
    });
    const parameters = inputNodes.map((nodeId) => {
        const node = nodesById[nodeId];
        return {
            blockType: BlockDisplayName[nodesById[nodeId].type],
            type: "string",
            name: "inputTitle" in node.data ? node.data.inputTitle : undefined,
            nodeId: node.id,
        };
    });
    const outputs = outputNodes.map((nodeId) => {
        const node = nodesById[nodeId];
        return {
            blockType: BlockDisplayName[nodesById[nodeId].type],
            type: "string",
            name: "outputTitle" in node.data ? node.data["outputTitle"] : undefined,
            nodeId: node.id,
        };
    });
    return {
        nodes: nodes.filter((node) => !excludedNodes.has(node.id)),
        edges: edges.filter((edge) => !excludedNodes.has(edge.source) && !excludedNodes.has(edge.target)),
        parameters,
        inputNodes,
        outputs,
        outputNodes,
    };
};
export const generateWorkflowDefinition = (canvas) => {
    const { nodes: validNodes, edges: validEdges, parameters, inputNodes, outputs, outputNodes, } = getValidCanvas(canvas.nodes, canvas.edges);
    return {
        nodes: validNodes,
        edges: validEdges,
        parameters,
        inputNodes,
        outputs,
        outputNodes,
    };
};
//# sourceMappingURL=workflow.js.map