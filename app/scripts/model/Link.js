
import Metadata from "./Metadata";
import Identifier from "./Identifier"

class Link {
    constructor(source, target, metadata) {
        this.source = source;
        this.target = target;
        this.metadata = new Metadata(metadata);
    }
}

var linksMap = new Map(),
    linksArray = [];

function createLink(data) {
    let linkId = data.link;

    if (!linksMap.has(linkId)) {
        let [source, target] = linkId.split("/"),
            link = new Link(decodeURIComponent(source), decodeURIComponent(target), data.metadata);

        linksMap.set(linkId, link);
        linksArray.push(link);
    }

    return linksMap.get(linkId);
}

function clear() {
    linksMap = new Map();
    linksArray = [];
}

export default {
    getConnections(identifier) {
        return linksArray.filter((link) => {
            return link.target == identifier.name || link.source == identifier.name;
        })
    },
    createLink,
    clear
}
