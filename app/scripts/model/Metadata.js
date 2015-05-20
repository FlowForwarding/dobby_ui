
class Metadata {
    constructor(metadata) {
        this.map = new Map();
        for (let key of Object.keys(metadata)) {
            this.map.set(key, metadata[key]);
        }
    }

    get(key) {
        return this.map.get(key);
    }

    display() {
        var result = [];

        for (let [key, value] of this.map) {
            result.push(`${key}: ${value.value}`);
        }


        return result.join("</br>");
    }
}

export default Metadata;
