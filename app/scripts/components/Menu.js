
import Component from "../Component";

class Menu extends Component {
    constructor(el) {
        super(el);

        this.$el.hide();

        this.identifier = null;

        this.$search = this.$el.find("button");
        this.$search.on("click", () => this.onSubmit())
    }

    onSubmit() {
        var identifier = this.identifier,
            max_depth = parseInt(this.$el.find(".input-group.max-depth input").val(), 10);

        $(this).trigger("submit", {
            identifier,
            params: {
                max_depth
            }
        });

    }

    showAt({x, y}) {
        var height = this.$el.height(),
            width = this.$el.width(),
            maxHeight = $(window).height(),
            maxWidth = $(window).width(),
            top = (y + height > maxHeight) ? maxHeight - height - 50 : y - 50,
            left = (x + width > maxWidth) ? maxWidth - width - 50 : x - 50;

        this.$el.offset({top, left});
        this.show();
    }

    setIdentifier(identifier) {
        this.identifier = identifier;
    }
}

export default Menu;
