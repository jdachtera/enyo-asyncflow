enyo.kind({
    name: 'enyo.FlickrRequest',
    kind: 'enyo.JsonpRequest',
    callbackName: "jsoncallback",
    url: 'http://api.flickr.com/services/rest/',
    api_key: '',
    page: 0,
    per_page: 50,
    query: '',
    go: function() {
        this.inherited(arguments, [{
            method: 'flickr.photos.search',
            format: 'json',
            api_key: this.api_key,
            page: this.page,
            per_page: this.per_page,
            text: this.query
        }]);
    }
});

enyo.kind({
	name: "App",
    kind: 'FittableRows',
	components:[
        {kind: 'onyx.Toolbar', layoutKind: 'FittableColumnsLayout', style: 'height:64px', noStretch: true, components: [
            {kind: 'onyx.Input', value: 'enyo', onchange: 'loadImages'},
            {kind: 'onyx.Button', content: 'Load Images', ontap: 'loadImages'},
            {kind: 'onyx.ProgressBar', fit: true, showing: false}
        ]},
        {kind: 'Scroller', fit:true, components: [
            {name: 'list', kind: 'FlyweightRepeater', onSetupItem: 'setupItem', components: [
                {kind: 'Image'}
            ]}
        ]}

	],
    imageUrls: [],
    loadImages: function() {
        this.$.progressBar.show();
        this.resized();
        this.imageUrls.length = 0;
        new enyo.AsyncFlow([
            new enyo.FlickrRequest({
                api_key: "2a21b46e58d207e4888e1ece0cb149a5",
                query: this.$.input.getValue()
            }).response(this, function(inSender, inResponse) {
                var photos = inResponse.photos ? inResponse.photos.photo : [];
                for (var i=0, p; (p=photos[i]); i++) {
                    var urlprefix = "http://farm" + p.farm + ".static.flickr.com/" + p.server + "/" + p.id + "_" + p.secret;
                    this.imageUrls.push(urlprefix + ".jpg");
                }
            }),
            new enyo.AsyncMap(this.imageUrls, function(item, index) {
                return new enyo.ImageLoader(item);
            }, this, {generatorCallback: true, parallel: true})
        ], {context: this})
        .response(this, function() {
            this.$.list.setCount(this.imageUrls.length);
            this.$.list.render();
            this.$.progressBar.hide();
        })
        .progress(this, function(inSender, inProgress) {
            this.$.progressBar.setProgress(inProgress * 100);
        })
        .go();

    },
    setupItem: function(inSender, inEvent) {
        this.$.image.setSrc(this.imageUrls[inEvent.index]);
    }
});