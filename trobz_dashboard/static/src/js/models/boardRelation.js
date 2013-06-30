openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var BoardRelation = BaseModel.extend({
        model_name: 'dashboard.board_to_widget_rel',
        
        constructor: function(data, options){
            BaseModel.apply(this, arguments);
        
            this.board_id = options.board_id;
            this.widget_id = options.widget_id;
        },
        
        update: function(){
            return this.fetch(this.search());
        },
        
        search: function(){
            return {
                type: 'first',
                filter: [
                    ['board_id', '=', this.board_id],
                    ['widget_id', '=', this.widget_id]
                ]
            };
        }
        
        
    });

    dashboard.models('BoardRelation', BoardRelation);
});