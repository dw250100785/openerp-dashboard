openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Widget = dashboard.views('Widget'),
        _super = Widget.prototype;

    var Search = Widget.extend({
        
        className:  '.board',
        
        events: {
        },
        
        initialize: function(models, options){
            _super.initialize.apply(this, arguments);  
        },
        
        bind: function(){
        },
        
        unbind: function(){
        }
    });

    dashboard.views('Search', Search);

});