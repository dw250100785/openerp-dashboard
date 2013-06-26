openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Board = BaseModel.extend({
        model_name: 'dashboard.board'
    });

    dashboard.models('Board', Board);
});