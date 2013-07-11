openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    

    var Metrics = dashboard.collections('Metrics');
            
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Widget = BaseModel.extend({
        
        model_name: 'dashboard.widget',
        
        initialize: function(data, options){
            
            var metrics = [];
            if('metrics' in data){
                metrics = data.metrics;
                delete data.metrics;
            }
         
            this.metrics = new Metrics(metrics);
            
            return data;
        }        
        
    });

    dashboard.models('Widget', Widget);
});