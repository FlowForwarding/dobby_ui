
import Component from "../Component";

class Tooltip extends Component {
    constructor(el) {
        super(el);

        this.$el.hide();

        this.$title = this.find(".title");
        this.$content = this.find(".content");

        this.$tooltip = this.$el.filter(".tooltip");
        this.$placeholder = this.$el.filter(".tooltip-placeholder");

        this.$placeholder.on("mouseenter", (event) => {
            this.$tooltip.css({
                right: "",
                left: "16px"
            });


        });

        this.$placeholder.on("mouseleave", (event) => {
            this.$tooltip.css({
                right: "16px",
                left: ""
            });
        });
    }

    show(data) {
        super.show();

        this.$title.text(data.title);
        this.$content.html(data.content);

        this.$placeholder.width(this.$tooltip.width());
        this.$placeholder.height(this.$tooltip.height());
        //this.$container.html(JSON.stringify(data));
    }
}

export default Tooltip;
