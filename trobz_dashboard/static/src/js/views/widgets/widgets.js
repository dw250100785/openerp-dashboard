openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){
 
    var Widget = dashboard.views('Widget'),
        View = Marionette.CollectionView,
        _super = View.prototype;

    var WidgetsView = View.extend({
        
        itemView: Widget,
        
        itemViewOptions: function(model, index) {
            return {
                period: this.period,
                debug: this.debug,
                global_search: this.global_search
            };
        },
        
        initialize: function(options){
            this.period = options.period;
            this.debug = options.debug;
            this.global_search = options.global_search;
        },
        
        mode: function(type){
            console.log('switch mode', type);
        }
    });

    dashboard.views('Widgets', WidgetsView);

});