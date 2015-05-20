
import Metadata from "./Metadata";
import createLink from "./Link";
import {
    GET,
    POST
} from "../network";

class Identifier {
    constructor(name, metadata) {
        this.name = name;
        this.metadata = new Metadata(metadata);
    }

    neighbours() {
        return this.search({
            max_depth: 1
        })
    }

    search(params = {max_depth: 1, traversal: "depth"}) {
        //params = {
        //    "max_depth":1,
        //    "traversal":"depth",
        //    //"max_size":100,
        //    //"match_metadata":{
        //    //    "type":"IPV4"
        //    //},
        //    //"match_links":{
        //    //    "type":"IP-MAC"
        //    //},
        //    //"results_filter":["capabilities"],
        //    //"match_terminal":{
        //    //    "type":"device"
        //    //}
        //};

        return POST(`/identifier/${encodeURIComponent(this.name)}/search`, params)
            .then((res) => {console.log(res); return res;})
            .then((res) => {
                return {
                    links: res.links.map(createLink),
                    identifiers: res.identifiers.map(createIdentifier)
                }
            });
    }
}

var identifiers = new Map();

function get(name) {
    return identifiers.get(name);
}

function createIdentifier(identifier) {
    var key = decodeURIComponent(identifier.identifier);

    if (!identifiers.has(key)) {
        // FIXME: change metdaata to metadata, when back-end is ready.
        identifiers.set(key, new Identifier(key, identifier.metdaata));
    }
    return identifiers.get(key);
}

function handleError(error) {
    return Promise.reject(`Unable to find Identifier: ${error}`);
}

function find(name) {
    return GET("/identifier/" + name)
        .then(createIdentifier, handleError);
}

export default {
    createIdentifier,
    find,
    get
}
