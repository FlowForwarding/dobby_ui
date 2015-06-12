
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
    createEl(label) {
        return $(
            `<div class="input-group">
                <input type="text" value="1"/>
            </div>`
        );
    }

    getValue() {
        return parseInt(super.getValue(), 10);
    }
}

class KeyValueField extends Field {
    createEl(label) {
        return $(
            `<div class="input-group">
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
        return [this.$el.find("input.key").val(), this.$el.find("input.value").val()];
    }

}

class FieldGroup extends Component {
    constructor($container, type) {
        var $el = $(
            `<div class="field-group">
                <p>
                    <span>${fieldLabelMap[type]}</span>
                    <button class="field-add">+</button>
                </p>
                <div class="fields-container"></div>
            </div>`
        );
        $container.append($el);
        super($el);
        this.fields = new Set();
        this.type = type;
        this.$el.find("button.field-add").on("click", () => this.addField());
    }

    addField() {
        var field = new fieldsMap[this.type](this.$el.find(".fields-container"), this.type);
        this.fields.add(field);

        $(field).on("remove", (event, field) => this.removeField(field));
    }

    removeField(field) {
        this.fields.delete(field);
        field.remove();
    }

    val() {
        return "";
    }
}

class KVFieldGroup extends FieldGroup {
    val() {
        if (this.fields.size == 0) {return null;}

        var val = {};
        this.fields.forEach((field) => {
            var [key, value] = field.getValue();
            val[key] = value;
        });

        return val;
    }
}

class ArrayFieldGroup extends FieldGroup {
    val() {

        if (this.fields.size == 0) {return null;}

        var val = [];
        this.fields.forEach((field) => {
            var value = field.getValue();
            val.push(value);
        });

        return val;
    }
}

class ValueFieldGroup extends FieldGroup {
    constructor($el, type) {
        super(...arguments);

        this.addField();
        this.$el.find("button.field-add").hide();
    }

    val() {
        var val = 1;
        this.fields.forEach((field) => {
            val = field.getValue();
        });

        return val;
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
        this.identifier = null;

        this.$el.find("button.submit-search").on("click", () => this.submit());
        this.fieldGroups = [
            new ValueFieldGroup(this.$el.find(".field-group-container"), DEPTH_TYPE),
            new KVFieldGroup(this.$el.find(".field-group-container"), MATCH_TYPE),
            new ArrayFieldGroup(this.$el.find(".field-group-container"), FILTER_TYPE),
            new KVFieldGroup(this.$el.find(".field-group-container"), TERMINAL_TYPE)
        ];
    }

    setIdentifier(i) {
        this.identifier = i;
    }

    submit() {
        var identifier = this.identifier,
            params = {};

        this.fieldGroups.forEach((fieldGroup) => {
            var val = fieldGroup.val(),
                param = paramsMap[fieldGroup.type];

            params[param] = val;
        });

        $(this).trigger("search", {identifier, params});
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

