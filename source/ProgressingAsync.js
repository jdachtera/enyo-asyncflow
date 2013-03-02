enyo.kind({
    name: 'enyo.ProgressingAsync',
    kind: 'enyo.Async',
    published: {
        currentProgress: null
    },
    constructor: function() {
        this.inherited(arguments);
        this.progressHandlers = [];
    },
    progress: function(/* [inContext], inResponder */) {
        this.accumulate(this.progressHandlers, arguments);
        return this;
    },
    currentProgressChanged: function(progress) {
        enyo.forEach(this.progressHandlers, function(handler) {
            enyo.call(this.context || this, handler, [this, this.currentProgress]);
        }, this);
    },
    respond: function() {
        this.setCurrentProgress(1);
        this.inherited(arguments);
    },
    fail: function() {
        this.setCurrentProgress(1);
        this.inherited(arguments);
    }
});