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
        
        execute: function(options){
            var def = $.Deferred();
            
            options = _.defaults(options || {}, {
                period: {},
                domain: [], 
                group: [],
                order: [],
                limit: 'ALL',
                offset: 0
            });
            
            var promise = this.sync('call', { model_name: this.model_name }, {
                method: 'exec_metric',
                args: [this.pluck('id'), options.period, options.domain, options.group, options.order, options.limit, options.offset]
            });      
            
            var metrics = this;
            promise.done(function(results){
                _(results).each(function(result, metric_id){
                    var results = metrics.get(metric_id).results;
                    results.reset(results.parse(result));
                });
                metrics.trigger('results:updated', this);
                def.resolve();
            });
            
            return def.promise();
        }
    });

    dashboard.collections('Metrics', Metrics);
});