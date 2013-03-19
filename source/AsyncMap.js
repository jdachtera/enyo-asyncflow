enyo.kind({
    name: 'enyo.AsyncMap',
    kind: 'enyo.AsyncFlow',
    published: {
        /**
            The array to iterate over.
         */
        items: null,
        /**
            Set to true to use the the specified callback function as a generator which returns an _enyo.Async_ instance.
         */
        generatorCallback: false,
        /**
            The execution context of the callback function
         */
        context: null,
        /**
            The callback function. This can be either a normal iterator function or if _generatorCallback_ is set to _true_
            a generator function which returns an _enyo.Async_.
         */
        callback: function(item, index) {}
    },
    /**
        Properties set passed in via _inParams_ are copied to the instance
     */
    constructor: function(inParams) {
        this.inherited(arguments, [null, inParams]);
    },
    //* @public
    go: function() {
        this.asyncs = enyo.map(this.items, function(item, index) {
            return this.getAsync(this.generatorCallback ? this.callback(item, index) : enyo.bind(this, 'callback', [item, index]));
        }, this);
        this.inherited(arguments);
    }
});