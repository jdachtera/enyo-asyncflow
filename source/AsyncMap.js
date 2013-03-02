enyo.kind({
    name: 'enyo.AsyncMap',
    kind: 'enyo.AsyncFlow',
    items: null,
    generatorCallback: false,
    constructor: function(items, inCallback, inContext, options) {
        this.items = items;
        this.callback = enyo.bind(inContext, inCallback);
        this.inherited(arguments, [null, options]);
    },
    go: function() {
        this.asyncs = enyo.map(this.items, function(item, index) {
            return this.getAsync(this.generatorCallback ? this.callback(item, index) : enyo.bind(this, 'callback', [item, index]));
        }, this);
        this.inherited(arguments);
    }
});