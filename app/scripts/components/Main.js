import Component from "../Component";
import Identifier from "../model/Identifier";
import Tooltip from "./Tooltip";
import Graph from "./D3Graph";
import Menu from "./Menu";
import Search from "./Search";

class Main extends Component {
    constructor(identifier) {
        super($("[main]"));

        this.$name = this.find(".identifier-name");
        this.$clearIdentifier = this.find(".clear-identifier");
        this.$clearIdentifier.on("click", () => $(this).trigger("clear-identifier"));

        this.tooltip = new Tooltip(this.find("[tooltip]"));

        this.searchComponent = new Search(this.find("[search]"));
        this.menu = new Menu(this.find("[menu]"));
        $(this.searchComponent).on("search", (event, {identifier, params}) => this.search(identifier, params));
    }

    hideTooltip() {
        this.tooltip.hide();
    }

    showTooltip(isIdentifier, data) {
        this.tooltip.show({
            title: isIdentifier ? `Identifier: ${data.name}` : `Link: ${data.source} -> ${data.target}`,
            content: data.metadata.display()
        });
    }

    setIdentifier(identifier) {
        this.$name.text(identifier.name);

        this.graph = new Graph(this.find(".graph-container"));
        this.graph.addNode(identifier);

        $(this.graph).on("overEdge", (event, link) => {
            this.showTooltip(false, link);
            this.graph.highlight({
                nodes: [Identifier.get(link.source), Identifier.get(link.target)],
                edges: [link]
            });
        });
        //$(this.graph).on("outEdge", this.hideTooltip.bind(this));
        $(this.graph).on("overNode", (event, identifier) => {
            var identifiers = identifier.neighbours();

            identifiers.push(identifier);

            this.showTooltip(true, identifier);
            this.graph.highlight({
                mainNode: identifier,
                nodes: identifiers,
                edges: identifier.links()
            });
        });

        $(this.graph)
            .on("doubleClickNode", (event, identifier) => this.search(identifier, {max_depth: 1}))
            .on("contextmenu", (event, identifier) => this.showContextMenu(event, identifier));

        $(this.graph.$el).on("click", () => {
            this.hideTooltip();
            this.hideContext();
        });

        this.graph.show();
    }

    search(identifier, params) {

        this.hideContext();

        identifier.search(params)
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
    }

    showContextMenu(event, identifier) {

        var position = {
            x: window.event.x,
            y: window.event.y
        };

        this.searchComponent.setIdentifier(identifier);
        this.menu.showAt(position);
    }

    hideContext() {
        this.menu.hide();
        this.graph.highlight({
            nodes: [],
            edges: []
        });
    }
}

export default Main;
