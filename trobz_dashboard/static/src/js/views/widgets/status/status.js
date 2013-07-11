openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){


    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var WidgetStatus = View.extend({
        
        template: 'TrobzDashboard.widget.status',
        
        events: {
            'click .metric': 'openMetric'
        },
        
        render: function(){
            var html = Renderer.render(this.template, {
                metrics: this.collection.toArray()
            });
            
            this.$el.empty();
            this.$el.html(html);    
        },
        
        // UI Events
        
        openMetric: function(e){
            e.preventDefault();
        }
    });

    dashboard.views('WidgetStatus', WidgetStatus);

});