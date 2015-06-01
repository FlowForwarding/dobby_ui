import Component from "../Component";
import Identifier from "../model/Identifier";
import Tooltip from "./Tooltip";
import Graph from "./D3Graph";
import Menu from "./Menu";

class Main extends Component {
    constructor(identifier) {
        super($("[main]"));

        this.$name = this.find(".identifier-name");
        this.$clearIdentifier = this.find(".clear-identifier");

        this.$clearIdentifier.on("click", () => {
            $(this).trigger("clear-identifier");
        });

        this.tooltip = new Tooltip(this.find("[tooltip]"));

        this.menu = new Menu(this.find("[menu]"));
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
        })
        .on("contextmenu", (event, identifier) => this.showContextMenu(event, identifier));

        $(this.graph.$el).on("click", () => {
            this.hideTooltip();
            this.hideContextMenu();
        });

        this.graph.show();
    }

    showContextMenu(event, identifier) {

        identifier.search({max_depth: 10})
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

        //var position = {
        //    x: window.event.x,
        //    y: window.event.y
        //};
        //
        //this.menu.showAt(position);

    }

    hideContextMenu() {
        this.menu.hide();
    }
}

export default Main;
