
const SERVER_ROOT_URL = "http://localhost:5050";
//const SERVER_ROOT_URL = "http://localhost:8080";

const SUCCESS = Symbol("success");

const NOT_FOUND = Symbol("not found");
const SERVER_ERROR = Symbol("Server Error");
const BAD_REQUEST = Symbol("Request incomplete");
const REQUEST_ERROR = Symbol("Request error");

//200	Success
//201	Successfully created resource
//204	Successfully deleted resource
//404	Not Found
//405   *Method Not Allowed
//415   *Unsupported Media Type
//422	POST request malformed/incomplete
//422   Unprocessable Entity
//500	Server Error


var codesMap = {
    200: SUCCESS,
    201: SUCCESS,
    204: SUCCESS,
    404: NOT_FOUND,
    422: BAD_REQUEST,
    500: SERVER_ERROR
};

var messagesMap = {
    [NOT_FOUND]: "Requested resource not found",
    [BAD_REQUEST]: "Request malformed/incomplete",
    [SERVER_ERROR]: "Server error",
    [REQUEST_ERROR]: "Server not available",
    [undefined]: "Unknown Error"
};

function json(response) {
    return response.json();
}

function checkStatusCodes(response) {
    var status = response.status;

    if (codesMap[status] !== SUCCESS) {
        return Promise.reject(messagesMap[codesMap[status]]);
    }

    return response;
}

function GET(url) {
    return fetch(SERVER_ROOT_URL + url, {
        method: "GET"
    })
        .then(checkStatusCodes)
        .then(json);
}

function POST(url, params) {
    //return $.ajax({
    //    method: "POST",
    //    url: SERVER_ROOT_URL + url,
    //    data: params,
    //    contentType: "application/json"
    //}).then((resp) => console.log(resp));
    return fetch(SERVER_ROOT_URL + url, {
        method: "POST",
        //body: params,
        body: JSON.stringify(params),
        //contentType: "application/json",
        headers: {
            "content-type": "application/json"
        }
    })
        .then(checkStatusCodes)
        .then(json);
}

export {
    GET,
    POST
};
