enyo.kind({
    name: 'enyo.ImageLoader',
    kind: 'enyo.ProgressingAsync',
    node: null,
    ajax: false,
    constructor: function(url, options) {
        this.inherited(arguments);
        enyo.mixin(this, options);
        this.url = url;
    },
    go: function() {
        if (this.ajax) {
            new enyo.ProgressingAjax({url: this.url, handleAs: 'text', cacheBust: false})
                .progress(this, 'updateProgress')
                .response(this, 'respond')
                .error(this, 'fail')
                .go();
        } else {
            this.node = document.createElement('img');
            this.node.onload = enyo.bind(this, 'respond');
            this.node.onerror = enyo.bind(this, 'fail');
            this.node.src = this.url;
        }
    },
    updateProgress: function(inSender, inProgress) {
        this.setCurrentProgress(inProgress);
    }
});