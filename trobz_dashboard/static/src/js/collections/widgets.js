openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Widget = dashboard.models('Widget'),
        BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    
    
    var Widgets = BaseCollection.extend({
        model_name: 'dashboard.widget',
        model: Widget,
        
        initialize: function(data, options){
            this.board_id = options.board_id;
        },
        
        search: function(){
            return {
                filter: [['board_rel.board_id', '=', this.board_id]]
            }
        },
    });

    dashboard.collections('Widgets', Widgets);
});