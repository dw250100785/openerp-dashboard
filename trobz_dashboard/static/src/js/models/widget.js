openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    

    var Metrics = dashboard.collections('Metrics');
            
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Widget = BaseModel.extend({
        
        model_name: 'dashboard.widget',
        
        initialize: function(){
            this.callbacks = {
                ready: new Backbone.Marionette.Callbacks(),
            };
            
            this.metrics = new Metrics([], {
                widget_id: this.get('id')
            });
        
            this.setup();
        },
        
        setup: function(){
            var ready = this.callbacks.ready;
            
            this.metrics.ready(function(){
                ready.run({});    
            });
            this.metrics.update();
        },
        
        ready: function(callback, context){
            this.callbacks.ready.add(callback, context);
        }        
        
    });

    dashboard.models('Widget', Widget);
});