openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Field = BaseModel.extend({
    });

    dashboard.models('Field', Field);
});