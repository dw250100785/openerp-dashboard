openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){


    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var WidgetStatus = View.extend({
        
        template: 'TrobzDashboard.widget.status',
        
        events: {
            'click .metric': 'openMetric'
        },
        
        initialize: function(options){
            this.search = options.search;
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
            var $clicked = $(e.currentTarget),
            	metric = this.collection.get($clicked.attr('metric-id')),
            	domain_orm = this.search.domain('domain_field_path');

            	domain_display = '<b>TODO: </b> I can try again later but I don t have time now, JC';
            
            dashboard.trigger('open open:list',metric.get('model_details').model,  metric.get('model_details').name, domain_orm,domain_display);
        }
    });

    dashboard.views('WidgetStatus', WidgetStatus);

});