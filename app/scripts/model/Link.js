
import Metadata from "./Metadata";
import Identifier from "./Identifier"

class Link {
    constructor(source, target, metadata) {
        this.source = source;
        this.target = target;
        this.metadata = new Metadata(metadata);
    }
}

var links = new Map();

function createLink(data) {
    let linkId = data.link;

    if (!links.has(linkId)) {
        let [source, target] = linkId.split("/"),
            link = new Link(decodeURIComponent(source), decodeURIComponent(target), data.metadata);

        links.set(linkId, link);
    }

    return links.get(linkId);
}

function clear() {
    links = new Map();
}

export default {
    createLink,
    clear
}
