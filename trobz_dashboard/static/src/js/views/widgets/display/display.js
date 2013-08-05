openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var DisplayNumeric = dashboard.views('DisplayNumeric'),
        DisplayGraph = dashboard.views('DisplayGraph'),
        DisplayList = dashboard.views('DisplayList');

    var Collection = Marionette.CollectionView,
        _super = Collection.prototype;

    var WidgetDisplay = Collection.extend({
        
        className: 'displayer',
        
        views: {
            'numeric': DisplayNumeric,
            'graph': DisplayGraph,
            'list': DisplayList,
        },
        
        
        _initialEvents: function() {
            _super._initialEvents.apply(this, arguments);
            
            //custom listener for metric.results update
            if (this.collection) {
                this.listenTo(this.collection, "results:updated", this.render, this);
            }
        },
        
        initialize: function(options){
            this.is_printable = options.printable;
            this.search = options.search;
        },
        
        printable: function(state){
            this.is_printable = state;
            this.children.each(function(child){
                if(child.printable){
                    child.printable(state);    
                }
            });
        },
        
        getItemView: function(model){
            var type = model.get('type');
            if(!(type in this.views)){
                throw new Error('metic type ' + type + ' is not yet supported.');
            }       
            return this.views[type];
        },
        
        itemViewOptions: function(model, index){
            return {
                search: this.search,
                collectionView: this,
                printable: this.is_printable
            };
        }
    });


    dashboard.views('WidgetDisplay', WidgetDisplay);

});