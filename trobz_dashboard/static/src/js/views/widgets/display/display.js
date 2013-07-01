openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var DisplayNumeric = dashboard.views('DisplayNumeric'),
        DisplayGraph = dashboard.views('DisplayGraph'),
        DisplayList = dashboard.views('DisplayList');

    var Collection = Marionette.CollectionView,
        _super = Collection.prototype;

    var WidgetDisplay = Collection.extend({
        
        views: {
            'number': DisplayNumeric,
            'graph': DisplayGraph,
            'list': DisplayList,
        },
        
        initialize: function(options){
            this.search = options.search;
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
                search: this.search 
            };
        }
    });


    dashboard.views('WidgetDisplay', WidgetDisplay);

});