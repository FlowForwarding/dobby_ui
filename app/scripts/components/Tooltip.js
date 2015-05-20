
import Component from "../Component";

class Tooltip extends Component {
    constructor(el) {
        super(el);

        this.$el.hide();

        this.$title = this.find(".title");
        this.$content = this.find(".content");
    }

    show(data) {
        super.show();

        this.$title.text(data.title);
        this.$content.html(data.content);
        //this.$container.html(JSON.stringify(data));
    }
}

export default Tooltip;
