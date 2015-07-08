
var Metadata = React.createClass({
    render () {
        return (
            <div className={"column-metadata"}
                 dangerouslySetInnerHTML={{__html: this.props.item ? this.props.item.metadata.display() : "Not selected"}}>
            </div>
        )
    }
});

var List = React.createClass({

    getInitialState() {
        return {
            scrollTop: 0
        }
    },

    setScrollPosition({scrollTop}) {
        this.setState({
            scrollTop
        });
    },

    shouldComponentUpdate(_, newState) {
        if (this.state.scrollTop !== newState.scrollTop) {
            this.getDOMNode().scrollTop = newState.scrollTop;

            return false;
        }
        return true;
    },

    render() {

        return (
            <div className={"column-list-wrapper"} scrollTop={this.state.scrollTop} onScroll={this.props.onScroll}>
                <ul className={"column-list"}>
                    {this.props.items.map((item, index) => {
                        var classes = [];

                        if (this.props.hovered === index) {
                            classes.push("hovered");
                        }

                        if (this.props.selected === index) {
                            classes.push("selected");
                        }

                        return <li key={index} className={classes.join(" ")}
                                   onClick={() => this.props.onSelect(index)}
                                   onMouseEnter={() => this.props.onHover(index)}
                                   onMouseLeave={() => this.props.onHover(ROW_NOT_EXIST)}
                                >{this.props.renderItem(item)}</li>
                    }, this)}
                </ul>
            </div>
        )
    }
});

const ROW_NOT_EXIST = -1;

var Column = React.createClass({

    getDefaultProps() {
        return {
            items: [],
            renderItem: (item) => item
        }
    },

    getInitialState() {
        return {
            selectedRowIndex: ROW_NOT_EXIST,
            hoveredRowIndex: ROW_NOT_EXIST
        }
    },

    setHoveredRow(index=ROW_NOT_EXIST) {
        this.setState({
            hoveredRowIndex: index
        })
    },

    setSelectedRow(index=ROW_NOT_EXIST) {
        this.setState({
            selectedRowIndex: index
        })
    },

    setScrollPosition({scrollTop}) {
        this.refs.list.setScrollPosition({scrollTop});
    },

    _getMetadataIndex() {
        return this.state.hoveredRowIndex !== ROW_NOT_EXIST ? this.state.hoveredRowIndex : this.state.selectedRowIndex;
    },

    render() {
        return (
            <div className={["column-wrapper", this.props.className].join(" ")}>
                <Metadata
                    item={this.props.items[this._getMetadataIndex()]}
                    />
                <List
                    ref="list"
                    onScroll={this.props.onScroll}
                    items={this.props.items}
                    selected={this.state.selectedRowIndex}
                    hovered={this.state.hoveredRowIndex}
                    onHover={this.props.onHover}
                    onSelect={this.props.onSelect}
                    renderItem={this.props.renderItem}
                />
            </div>
        )
    }
});

var ColumnPairView = React.createClass({

    _onSelect(index) {
        this.refs.identifiers.setSelectedRow(index);
        this.refs.links.setSelectedRow(index);

        this.props.onSelect(index);
    },

    _onHover(index) {
        this.refs.identifiers.setHoveredRow(index);
        this.refs.links.setHoveredRow(index);
    },

    _onScroll(event) {
        var scrollTop = event.target.scrollTop;
        this.refs.identifiers.setScrollPosition({scrollTop});
        this.refs.links.setScrollPosition({scrollTop});
    },

    render() {
        return (
            <div className={this.props.className} style={{display: "flex"}}>
                <Column
                    ref="links"
                    onScroll={(e) => this._onScroll(e)}
                    items={this.props.links}
                    onSelect={(index) => this._onSelect(index)}
                    onHover={(index) => this._onHover(index)}
                    renderItem={(item) => item.metadata.get("type")}
                    />
                <Column
                    ref="identifiers"
                    className="column-identifiers"
                    onScroll={(e) => this._onScroll(e)}
                    items={this.props.identifiers}
                    onSelect={(index) => this._onSelect(index)}
                    onHover={(index) => this._onHover(index)}
                    renderItem={(item) => item.name}
                />
            </div>
        )
    }
});

var BreadCrumbs = React.createClass({
    render() {
        return (
            <div className={"list-view-breadcrumbs"}>
                {this.props.items.map((item) => <div> | {item}</div>)}
            </div>
        )
    }
});

var ColumnView = React.createClass({

    getInitialState() {
        return {
            items: []
        }
    },

    getDefaultProps() {
        return {
            onAppend: () => {}
        }
    },

    _sortResults({identifier, identifiers, links}) {
        identifiers = identifiers.sort((i1, i2) => i1.name.localeCompare(i2.name));
        links = links.sort((i1, i2) => {
            var name = identifier.name;
            // TODO: rewrite in elegant and robust way
            if (name === i1.target && name === i2.target) {
                return i1.source.localeCompare(i2.source);
            } else if (name === i1.source && name === i2.source) {
                return i1.target.localeCompare(i2.target);
            } else if (name === i1.source && name === i2.target) {
                return i1.target.localeCompare(i2.source);
            } else if (name === i1.target && name === i2.source) {
                return i1.source.localeCompare(i2.target);
            }

        });

        return {identifier, identifiers, links}
    },

    _removeIdentifierFromResult(identifier) {
        return ({identifiers, links}) => {
            var identifiersSet = new Set(identifiers);
            identifiersSet.delete(identifier);
            return {identifiers: Array.from(identifiersSet), links}
        }
    },

    _rootColumnSelect() {
        this.refs.rootIdentifier.setSelectedRow(0);
        this.search(this.props.identifier)
            .then((result) => {
                this.setState({items: [result]});
            });
    },

    componentDidMount() {
        this._rootColumnSelect();
    },

    search(identifier) {
        return identifier.search({})
            .then(this._removeIdentifierFromResult(identifier))
            .then(({identifiers, links}) => {return {identifier, identifiers, links}})
            .then(this._sortResults);
    },

    _handleIdentifierSelect(itemIndex, identifierIndex) {
        var items = this.state.items,
            identifier = items[itemIndex].identifiers[identifierIndex],
            newItems = items.slice(0, itemIndex + 1);

        this.search(identifier)
            .then((result) => {
                newItems.push(result);
                this.setState({
                    items: newItems
                });
                this.props.onAppend();
            });

    },

    render() {
        return (
            <div className={"column-view-wrapper"}>
                <div className={"column-view" + (this.state.items.length === 1 ? " last-column" : "")}>
                    <Column
                        ref="rootIdentifier"
                        className="column-identifiers root-identifier"
                        items={[this.props.identifier]}
                        onSelect={() => this._rootColumnSelect()}
                        onHover={() => {}}
                        renderItem={(item) => item.name}
                    />
                    {this.state.items.map(({identifier, identifiers, links}, index, items) => {
                        return <ColumnPairView
                            className={index === items.length - 2 ? "last-column" : ""}
                            key={identifier.name + index}
                            identifiers={identifiers}
                            links={links}
                            onSelect={(identifierIndex) =>
                                this._handleIdentifierSelect(index, identifierIndex)}
                        />
                    })}
                </div>
            </div>
        )
    }
});

export default ColumnView;
