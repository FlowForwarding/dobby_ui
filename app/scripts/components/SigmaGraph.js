
import Graph from "./Graph";

var forceAtlasConfig = {
    barnesHutTheta: 0.5,
    gravity: 0.3,
    strongGravityMode: true,
    adjustSizes: true,
    edgeWeightInfluence: 0.2,
    slowDown: 10,
    outboundAttractionDistribution: false
};

class SigmaGraph extends Graph {
    constructor(el) {
        super(el);

        this.sigma = new sigma({
            graph: this.graph,
            renderer: {
                // IMPORTANT:
                // This works only with the canvas renderer, so the
                // renderer type set as "canvas" is necessary here.
                container: this.$el.get(0),
                type: 'canvas'
            },
            settings: {
                minNodeSize: 1,
                maxNodeSize: 5,
                doubleClickEnabled: false,
                clone: false,
                drawLabels: true
                //defaultNodeColor: "white"
            }
        });

        this.sigma.startForceAtlas2(forceAtlasConfig);

        this.sigma.bind("doubleClickNode", (event) => {
            $(this).trigger("doubleClickNode", event.data.node.data);
        });
    }

    refreshGraphData() {
        this.sigma.killForceAtlas2();

        super.refreshGraphData();

        this.sigma.graph.clear();
        this.sigma.graph.read(this.graph);

        this.sigma.startForceAtlas2(forceAtlasConfig);
    }

    show(cb) {
        setTimeout(() => this.sigma.renderers[0].resize(), 0);
        setTimeout(() => this.sigma.refresh(), 1);
        super.show(cb);
    }

}

export default SigmaGraph;

