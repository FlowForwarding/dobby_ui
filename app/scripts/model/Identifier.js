
import Metadata from "./Metadata";

import Link from "./Link";

import {
    GET,
    POST
} from "../network";

var {createLink} = Link;

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

    search({max_depth=1, traversal="depth", match_metadata=null, results_filter=null, match_terminal=null}) {
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

        var params = {
            max_depth,
            traversal
        };

        if (match_metadata) {params.match_metadata = match_metadata}
        if (results_filter) {params.results_filter = results_filter}
        if (match_terminal) {params.results_filter = match_terminal}

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
        identifiers.set(key, new Identifier(key, identifier.metadata));
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
    get,
    clear() {
        identifiers = new Map();
    }
}
