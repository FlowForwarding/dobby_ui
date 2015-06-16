
class Metadata {
    constructor(metadata) {
        this.map = metadata;
    }

    display() {
        var result = [];

        function displayObject(obj) {
            var res = ['<ul>'];
            for (let [key, value] of Object.entries(obj)) {
                var val = value;
                if (typeof val === 'object') {
                    val = displayObject(val);
                }
                res.push(`<li>${key}: ${val}</li>`);
            }
            res.push('</ul>');
            return res.join("");
        }

        result.push(displayObject(this.map));

        return result.join("</br>");
    }
}

export default Metadata;
