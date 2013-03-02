enyo.kind({
    name: 'enyo.ProgressingAjax',
    kind: 'enyo.Ajax',
    published: {
        currentProgress: null
    },
    constructor: function() {
        this.inherited(arguments);
        this.progressHandlers = [];
        this.xhrFields = this.xhrFields || {};
        enyo.mixin(this.xhrFields, {onprogress: enyo.bind(this, this.updateProgress)});
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
    updateProgress: function(event) {
        if (event.total) {
            this.setCurrentProgress(event.loaded / event.total);
        }
    },
    go: function() {
        this.setCurrentProgress(0);
        this.inherited(arguments);
    }
});