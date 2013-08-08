openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Fields = dashboard.collections('Fields'),
        Metric = dashboard.models('Metric');
        
    var BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    
    var Metrics = BaseCollection.extend({
        model_name: 'dashboard.metric',
        
        model: Metric,

        initialize: function(data, options){

            this.on('reset', this.setup);
            this.fields = new Fields();
        },
        
        setup: function(){
            var fields = this.fields;
            this.each(function(metric){
                fields.add(metric.fields.models);
            });
        },

        comparator: function (item) {
            console.log(item.get('name'), item.get('position'))
            return item.get('position');
        }
    });

    dashboard.collections('Metrics', Metrics);
});