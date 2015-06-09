
import Component from "./../Component";

const MATCH_TYPE = Symbol("Match type field"),
    FILTER_TYPE = Symbol("Filter type field"),
    TERMINAL_TYPE = Symbol("Terminal type field"),
    DEPTH_TYPE = Symbol("Depth type field");


class Field extends Component {
    constructor($container, type) {
        super($());

        this.$el = this.createEl(fieldLabelMap[type]);

        this.value = null;
        this.type = type;

        this.$el.find("button.remove-field").on("click", () => $(this).trigger("remove", this));

        $container.append(this.$el);
    }

    createEl(label) {
        return $(
            `<div class="input-group">
                <p>${label}</p>
                <input type="text"/>
                <button class="remove-field">-</buttonclass>
            </div>`
        );
    }

    setValue(val) {
        this.$el.find("input").val(val);
    }

    getValue() {
        return this.$el.find("input").val();
    }
}

class MaxDepthField extends Field {
    getValue() {
        return parseInt(super.getValue(), 10);
    }
}

class KeyValueField extends Field {
    createEl(label) {
        return $(
            `<div class="input-group">
                <p>${label}</p>
                <input class="key" type="text"/>
                <input class="value" type="text"/>
                <button class="remove-field">-</buttonclass>
            </div>`
        );
    }

    setValue({[key]: val}) {
        this.$el.find("input.key").val(key);
        this.$el.find("input.value").val(val);
    }

    getValue() {
        return {
            [this.$el.find("input.key").val()]: this.$el.find("input.value").val()
        }
    }

}

const fieldsMap = {
    [MATCH_TYPE]: KeyValueField,
    [FILTER_TYPE]: Field,
    [TERMINAL_TYPE]: KeyValueField,
    [DEPTH_TYPE]: MaxDepthField
};

const fieldLabelMap = {
    [MATCH_TYPE]: "Match Metadata",
    [FILTER_TYPE]: "Filter Metadata",
    [TERMINAL_TYPE]: "Match Terminal",
    [DEPTH_TYPE]: "Max Depth"
};

const paramsMap = {
    [MATCH_TYPE]: "match_metadata",
    [FILTER_TYPE]: "results_filter",
    [TERMINAL_TYPE]: "match_terminal",
    [DEPTH_TYPE]: "max_depth"
};

class Search extends Component {
    constructor($el) {
        super($el);
        this.fields = new Set();

        this.identifier = null;

        this.$el.find("button.submit-search").on("click", () => this.submit());
        this.$el.find("button.field-add").on("click", () => this.addField(DEPTH_TYPE));
    }

    addField(type) {
        var field = new fieldsMap[type](this.$el.find(".search-fields-container"), type);
        this.fields.add(field);

        $(field).on("remove", (event, field) => this.removeField(field));
    }

    removeField(field) {
        this.fields.delete(field);
        field.remove();
    }

    setIdentifier(i) {
        this.identifier = i;
    }

    submit() {
        var identifier = this.identifier,
            params = {};

        this.fields.forEach((field) => {
            var val = field.getValue(),
                param = paramsMap[field.type];

            params[param] = val;
        });

        $(this).trigger("search", {identifier, params});
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
}

export default Search;

//<div class="input-group match-matadata">
//    <p>Match Metadata</p>
//<input class="key" type="text"/>
//    <input class="value" type="text"/>
//    <!--<span>+</span>-->
//    </div>
//    <div class="input-group results-filter">
//    <p>Filter Metadata</p>
//<input class="value" type="text"/>
//    <!--<span>+</span>-->
//    </div>
//    <div class="input-group match-terminal">
//    <p>Match Terminal</p>
//<input class="key" type="text"/>
//    <input class="value" type="text"/>
//    <!--<span>+</span>-->
//</div>

