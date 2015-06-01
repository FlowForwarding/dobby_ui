
import Component from "../Component";

class Menu extends Component {
    constructor(el) {
        super(el);

        this.$el.hide();
    }

    showAt({x: left, y: top}) {
        this.$el.offset({top, left});
        this.show();
    }
}

export default Menu;
