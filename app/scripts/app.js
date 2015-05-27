import Welcome from "./components/Welcome";
import Main from "./components/Main";
import Identifier from "./model/Identifier";
import Link from "./model/Link";

$(() => {

    $("[main]").hide();
    $("[welcome]").hide();

    var app = new App();
});


class App {
    constructor() {
        this.welcome = new Welcome();
        this.main = new Main();

        this.startup();
    }

    startup() {
        this.welcome.show();
        this.main.hide();

        $(this.welcome).on("root-identifier", (event, identifier) => {
            this.welcome.hide(() => {
                this.main.setIdentifier(identifier);
                this.main.show();
            });
        });

        $(this.main).on("clear-identifier", () => {
            Link.clear();
            Identifier.clear();
            this.main.hide(() => {
                this.welcome.show();
            })
        });
    }
}

