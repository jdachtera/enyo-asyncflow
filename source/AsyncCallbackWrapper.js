enyo.kind({
    name: 'enyo.AsyncCallbackWrapper',
    kind: 'enyo.ProgressingAsync',
    asyncMethod: null,
    constructor: function(/* inContext, inCallback, [inArgs] */) {
        this.inherited(arguments);
        this.asyncMethod = enyo.bind.apply(this, arguments);
    },
    go: function() {
        this.setCurrentProgress(0);
        this.asyncMethod(enyo.bind(this, function(inError, inValue) {
            this.setCurrentProgress(1);
            if (inError) {
                this.fail(inError);
            } else {
                this.respond(inValue);
            }
        }));
    }
});