openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){
 
    var Widget = dashboard.views('Widget'),
        View = Marionette.CollectionView,
        _super = View.prototype;

    var WidgetsView = View.extend({
        
        itemView: Widget,
        
        itemViewOptions: function(model, index) {
            return {
                period: this.period,
                debug: this.debug
            };
        },
        
        initialize: function(options){
            this.period = options.period;
            this.debug = options.debug;
        },
        
        mode: function(type){
            console.log('switch mode', type);
        }
    });

    dashboard.views('Widgets', WidgetsView);

});