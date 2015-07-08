
import Metadata from "./Metadata";
import Identifier from "./Identifier"

class Link {
    constructor(source, target, metadata) {
        this.source = source;
        this.target = target;
        this.metadata = new Metadata(metadata);
    }

    identifiers() {
        return [Identifier.get(this.source), Identifier.get(this.target)];
    }
}

var linksMap = new Map(),
    linksArray = [];

function createLink(data) {
    let linkId = data.link,
        [source, target] = linkId.split("/"),
        linkIdReversed = [target, source].join("/");


    if (!linksMap.has(linkId) && !linksMap.has(linkIdReversed)) {
        let link = new Link(decodeURIComponent(source), decodeURIComponent(target), data.metadata);

        linksMap.set(linkId, link);
        linksArray.push(link);
    }

    return linksMap.get(linkId) || linksMap.get(linkIdReversed);
}

function clear() {
    linksMap = new Map();
    linksArray = [];
}

export default {
    getLinksForIdentifier(identifier) {
        return linksArray.filter((link) => {
            return link.target == identifier.name || link.source == identifier.name;
        })
    },
    createLink,
    clear
}
