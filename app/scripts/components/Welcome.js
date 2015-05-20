
import Identifier from "../model/Identifier";
import Component from "../Component";

class Welcome extends Component {
    constructor() {
        super($("[welcome]"));
    }

    init() {
        super.init();

        this.$error = this.find("[invalid-message]");
        this.$find = this.find("form");

        this.$error.hide();
        this.$find.on("submit", (event) => {

            this.$error.hide();

            var identifierName = this.find("input").val();
            this.findIdentifier(identifierName);
            event.preventDefault();
        });
    }

    findIdentifier(name) {
        Identifier.find(name)
            .then((identifier) => {
                $(this).trigger("root-identifier", identifier);
            }, (error) => {
                this.$error.show();
                this.$error.text(error);
            });
    }
}

export default Welcome;
