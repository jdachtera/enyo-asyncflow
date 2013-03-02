enyo.kind({
    name: 'enyo.AsyncFlow',
    kind: 'enyo.ProgressingAsync',
    asyncs: null,
    indexMap: null,
    counter: 0,
    published: {
        /**
            If set the requests are executed in parallel
         */
        parallel: false,
        /**
            If set the execution is stopped if a request results in an error
         */
        breakOnError: false,
        /**
            Call the requests asynchronously to allow ui updates
         */
        forceAsync: false
    },
    /**
     Bundles multiple asynchronous requests into one

     _inAsyncs_ can be either an array or an object which contains a number of
     enyo.Async objects and/or functions that take a callback as first argument.

     _inParams_ is used to specify properties of the AsyncFlow

     Example:

     new enyo.AsyncFlow({
         google: new enyo.Ajax({url: 'http://www.corsproxy.com/www.google.de'}),
         test: function(callback) {
             setTimeout(function() {
                 callback(null, {response: 'test'});
             }, 1000)
         }
     }).progress(function(inSender, inProgress) {
         console.log('Progress: ' + inProgress * 100 + '%');
     }).response(function(inSender, inResponse) {
         console.log(inResponse);
     }).go();

     @public
     */
    constructor: function(inAsyncs, inParams) {
        this.inherited(arguments);
        this.errorIndexes = [];
        if (enyo.isArray(inAsyncs)) {
            this.responseValues = [];
            this.asyncs = enyo.map(inAsyncs, this.getAsync, this);
        } else{
            this.asyncs = [];
            this.responseValues = {};
            this.indexMap = {};
            for (var id in inAsyncs) {
                if (inAsyncs.hasOwnProperty(id)) {
                    this.asyncs.push(this.getAsync(inAsyncs[id]));
                    this.indexMap[this.asyncs.length - 1] = id;
                }
            }
        }
        this.progressMap = [];
        enyo.mixin(this, inParams);
    },
    //* @protected
    getAsync: function(async) {
        if (enyo.kindof(async, 'enyo.Async')) {
            return async;
        } else {
            return new enyo.AsyncCallbackWrapper(this.context || this, async);
        }
    },
    //* @protected
    next: function() {
        if (this.failed && this.breakOnError) {
            return;
        }
        this.calculateProgress();
        if (this.counter === this.asyncs.length) {
            if (this.errorIndexes.length) {
                this.fail({
                    values: this.responseValues,
                    errorIndexes: this.errorIndexes
                });
            } else {
                this.respond({
                    values: this.responseValues
                });
            }
        }
        if (!this.parallel && this.counter < this.asyncs.length) {
            this.callAsync(this.asyncs[this.counter]);
        }
    },
    //* @protected
    respondToAsync: function(inSender, inValue) {
        var index = enyo.indexOf(inSender, this.asyncs);
        if (this.indexMap) {
            index = this.indexMap[index];
        }
        if (inSender.failed) {
            this.errorIndexes.push(index);
            if (this.breakOnError) {
                this.fail({
                    values: this.responseValues,
                    errorIndexes: this.errorIndexes
                });
            }
        }
        this.responseValues[index] = inValue;
        this.updateProgressMap(inSender, 1);
        this.counter++;
        this.next();
    },
    //* @protected
    updateProgressMap: function(inSender, inProgress) {
        var index = enyo.indexOf(inSender, this.asyncs);
        this.progressMap[index] = inProgress;
        this.calculateProgress();
    },
    //* @protected
    calculateProgress: function() {
        var progress = 0;
        for (var i = 0; i < this.asyncs.length; i++) {
            progress += this.progressMap[i] || 0;
        }
        progress /= this.asyncs.length;
        this.setCurrentProgress(progress);
    },
    //* @protected
    callAsync: function(async) {
        async.response(this, 'respondToAsync').error(this, 'respondToAsync');
        if (enyo.kindof(async, 'enyo.ProgressingAsync') || enyo.kindof(async, 'enyo.ProgressingAjax')) {
            async.progress(this, 'updateProgressMap');
        }
        if (!async.startTime) {
            if (this.forceAsync) {
                enyo.asyncMethod(async, 'go');
            } else {
                async.go();
            }
        }
    },
    //* @public
    go: function(options) {
        enyo.mixin(this, options);
        this.calculateProgress();
        if (this.parallel) {
            enyo.forEach(this.asyncs, this.callAsync, this);
        } else {
            this.next();
        }
    }
});