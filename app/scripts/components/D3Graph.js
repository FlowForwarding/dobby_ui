
import Graph from "./Graph";
import {Edge} from "./Graph";


class D3Graph extends Graph {
    constructor($el) {
        super($el);

        d3.select(this.$el.get(0))
            .selectAll("svg")
            .remove();

        this.d3El = d3.select(this.$el.get(0))
                .append("svg");


        this.d3El.append("g")
            .classed("scene", true)
            .append("g")
            .classed("scale", true)
            .append("g")
            .classed("container", true);

        //selection.on("click", function(d) {
        //    if (d3.event.defaultPrevented) return; // ignore drag
        //    otherwiseDoAwesomeThing();
        //});

        this.force = d3.layout.force()
            .linkStrength(1)
            .friction(0.9)
            .linkDistance(150)
            .charge(-30)
            .gravity(0)
            .theta(0.8)
            .alpha(0.1);
    }

    createEdge(source, target, data) {
        let sourceIndex = this.nodesMap.get(source).index,
            targetIndex = this.nodesMap.get(target).index;

        return new Edge(sourceIndex, targetIndex, data);
    }

    refreshGraphData() {

        super.refreshGraphData();

        let {width, height} = this.d3El.node().getBoundingClientRect(),
            {nodes, edges: links} = this.graph,
            sceneEl = this.d3El.select(".scene"),
            containerEl = this.d3El.select(".container"),
            scaleEl = this.d3El.select(".scale"),
            force = this.force,
            d3El = this.d3El;

        var isDrag = false;

        function tick() {

            node
                .each(collide(.5))
                .attr("transform", function(d) { return `translate(${d.x}, ${d.y})`;});

            containerEl.selectAll(".link").attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            if (!isDrag) {
                var minX, maxX = minX = nodes[0].x,
                    minY, maxY = minY = nodes[0].y;

                node
                    .each(function(d) {
                        maxX = Math.max(maxX, d.x); minX = Math.min(minX, d.x);
                        maxY = Math.max(maxY, d.y); minY = Math.min(minY, d.y);
                    });

                const marginX = 50,
                    marginY = 25,
                    ellipseRX = 50,
                    ellipseRY = 25;

                minX = minX - ellipseRX - marginX;
                minY = minY - ellipseRY - marginY;

                let boundWidth = maxX - minX + ellipseRX + marginX,
                    boundHeight = maxY - minY + ellipseRY + marginY,

                    centerX = (width)/2,
                    centerY = (height)/2,

                    boundCenterX = minX + boundWidth/2,
                    boundCenterY = minY + boundHeight/2,

                    scaleX = Math.min(Math.max((width)/boundWidth, 0.1), 1),
                    scaleY = Math.min(Math.max((height)/boundHeight, 0.1), 1),

                    scale = Math.min(scaleX, scaleY) || 1,

                    offsetX = centerX - boundCenterX*scale,
                    offsetY = centerY - boundCenterY*scale;

                sceneEl
                    .attr("transform", `translate(${offsetX}, ${offsetY})`);

                scaleEl
                    .attr("transform", `scale(${scale})`);
            }
        }

        force
            .nodes(nodes)
            .links(links)
            //.size([width, height])
            .on("tick", tick)
            .start();

        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes),
                maxRadius = 50,
                clusterPadding = 0,
                padding = 5;

            return function(d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }


        var node = containerEl.selectAll(".node")
                .data(nodes, (node) => node.id),
            link = containerEl.selectAll(".link")
                .data(links, (d) => d.id);

        function createNode(selection) {
            selection
                .append("ellipse")
                .attr("fill", "#FFF")
                .attr("rx", 50)
                .attr("ry", 25);

            selection.append("text")
                .attr("x", -45)
                .attr("y", 6)
                .style("font-size", 16)
                .text((d) => d.data.name);
        }

        var node_drag = d3.behavior.drag()
            .on("dragstart", dragstart)
            .on("drag", dragmove)
            .on("dragend", dragend);

        function dragstart(d, i) {
            isDrag = true;
            force.stop(); // stops the force auto positioning before you start dragging
        }

        function dragmove(d, i) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            tick(); // this is the key to make it work together with updating both px,py,x,y on d !
        }

        function dragend(d, i) {
            isDrag = false;
            d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
            tick();
            force.start();
        }

        node.exit().remove();

        node.enter()
            .append("g")
            .call(createNode)
            .classed("node", () => true)
            .call(node_drag)
            .on("mouseover", (d) => {
                $(this).trigger("overNode", d.data);
            })
            .on("mouseout", (d) => {
                $(this).trigger("outNode", d.data);
            })
            .on("dblclick", (d) => {
                $(this).trigger("doubleClickNode", d.data);
            });

        link.exit().remove();

        link.enter().insert("line", ":first-child")
            .classed("link", true)
            .on("mouseover", (d) => {
                $(this).trigger("overEdge", d.data);
            })
            .on("mouseout", (d) => {
                $(this).trigger("outEdge", d.data);
            })
            .attr("stroke", "#FFF");

        console.log(width, height);

        // refresh force
    }

    showMetadata() {

    }

    show(cb=() => {}) {
        super.show(() => {
            setTimeout(() => this.refreshGraphData(), 1);
            cb();
        });

    }

}

export default D3Graph;