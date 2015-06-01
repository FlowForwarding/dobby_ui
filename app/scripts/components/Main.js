import Component from "../Component";
import Identifier from "../model/Identifier";
import Tooltip from "./Tooltip";
import Graph from "./D3Graph";

class Main extends Component {
    constructor(identifier) {
        super($("[main]"));

        this.$name = this.find(".identifier-name");
        this.$clearIdentifier = this.find(".clear-identifier");

        this.$clearIdentifier.on("click", () => {
            $(this).trigger("clear-identifier");
        });

        this.tooltip = new Tooltip(this.find("[tooltip]"));
    }

    hideTooltip() {
        this.tooltip.hide();
    }

    showTooltip(isIdentifier, event, data) {
        this.tooltip.show({
            title: isIdentifier ? `Identifier: ${data.name}` : `Link: ${data.source} -> ${data.target}`,
            content: data.metadata.display()
        });
    }

    setIdentifier(identifier) {
        this.$name.text(identifier.name);

        this.graph = new Graph(this.find(".graph-container"));
        this.graph.addNode(identifier);

        $(this.graph).on("overEdge", this.showTooltip.bind(this, false));
        //$(this.graph).on("outEdge", this.hideTooltip.bind(this));
        $(this.graph).on("overNode", this.showTooltip.bind(this, true));
        //$(this.graph).on("outNode", this.hideTooltip.bind(this));

        $(this.graph).on("doubleClickNode", (event, identifier) => {
            identifier.search()
                .then(({links, identifiers}) => {

                    this.graph.addNodes(identifiers);
                    this.graph.addEdges(links.map((l) => {
                        return {
                            target: Identifier.get(l.target),
                            source: Identifier.get(l.source),
                            data: l
                        }
                    }));

                }, function(error) {
                    alert("Unable to search for neighbors:" + error);
                });
        });

        $(this.graph.$el).on("click", this.hideTooltip.bind(this));

        this.graph.show();
    }
}

export default Main;
