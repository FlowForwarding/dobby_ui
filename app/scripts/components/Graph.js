import Component from "../Component";

var i = 0;

class Graph extends Component {
    constructor($el) {
        super($el);

        this.graph = {
            nodes: [],
            edges: []
        };

        this.nodesMap = new Map();
        this.edgesMap = new Map();
    }

    refreshGraphData() {
        this.graph.nodes = [...this.nodesMap.values()];
        this.graph.edges = [...this.edgesMap.values()];
    }

    addNodes(nodes) {
        for (let data of nodes) {
            if (this.nodesMap.get(data)) {continue;}
            let node = new Node(data, data.id || i++);
            this.nodesMap.set(data, node);
        }

        this.refreshGraphData();
    }

    addNode(data) {
        this.addNodes([data]);
    }

    createEdge(source, target, data) {
        let {id: sourceId} = this.nodesMap.get(source),
            {id: targetId} = this.nodesMap.get(target);

        return new Edge(sourceId, targetId, data);
    }

    addEdges(edges) {
        for (let {source, target, data} of edges) {
            if (this.edgesMap.get(data)) {continue;}

            var edge = this.createEdge(source, target, data);

            this.edgesMap.set(data, edge);
        }

        this.refreshGraphData();
    }

    addEdge(sourceNode, targetNode, data) {
        this.addEdges([{sourceNode, targetNode, data}]);
    }
}

class Node {
    constructor(data, id) {
        this.id = id;
        this.x = Math.random();
        this.y = Math.random();
        this.size = 1;
        this.color = "#FFF";
        this.data = data;
        this.radius = 50;
    }
}

class Edge {
    constructor(sourceId, targetId, data) {
        this.id = [sourceId, targetId].join("|");
        this.source = sourceId;
        this.target = targetId;
        this.weight = 1;
        this.data = data;
    }
}

export default Graph;

export {
    Node,
    Edge
}
