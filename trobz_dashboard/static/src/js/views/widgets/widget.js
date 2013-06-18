openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var BaseView = base.views('Base'),
        _super = BaseView.prototype;

    var Widget = BaseView.extend({
        
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

    dashboard.views('Widget', Widget);

});