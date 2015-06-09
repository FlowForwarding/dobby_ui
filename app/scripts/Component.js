
class Component {
    constructor($el) {
        this.$el = $el;
        this.init();
    }

    init() {}

    find(selector) {
        return this.$el.find(selector);
    }

    show(callback=(()=>{})) {
        this.$el.stop();
        this.$el.fadeIn(500, callback);
    }

    hide(callback=(()=>{})) {
        this.$el.stop();
        this.$el.fadeOut(500, callback);
    }

    remove() {
        this.$el.remove();
    }
}


export default Component;
