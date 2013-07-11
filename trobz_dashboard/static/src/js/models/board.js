openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Widgets = dashboard.collections('Widgets');
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Board = BaseModel.extend({
        
        model_name: 'dashboard.board',
        
        initialize: function(data, options){
            this.widgets = new Widgets();
        },
        
        parse: function(data, options){
            
            var widgets = [];
            if('widgets' in data){
                widgets = data.widgets;
                delete data.widgets;
            }
            this.widgets.reset(widgets);
            
            return data;
        }
    });

    dashboard.models('Board', Board);
});