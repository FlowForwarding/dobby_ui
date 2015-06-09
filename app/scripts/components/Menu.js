
import Component from "../Component";

class Menu extends Component {
    constructor(el) {
        super(el);

        this.$el.hide();
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
}

export default Menu;
