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
            var fields = [];
            _(data).each(function(metric){
                fields.concat(metric.fields || []);
            });
            this.fields.reset(fields);
        },
        
        execute: function(options){
            var def = $.Deferred();
            
            options = _.defaults(options || {}, {
                period: {},
                domain: [], 
                group_by: [],
                order_by: [],
                limit: 'ALL',
                offset: 0
            });
            
            var promise = this.sync('call', { model_name: this.model_name }, {
                method: 'exec_metric',
                args: [this.pluck('id'), options.period, options.domain, options.group_by, options.order_by, options.limit, options.offset]
            });      
            
            var metrics = this;
            promise.done(function(results){
                _(results).each(function(result, metric_id){
                    var results = metrics.get(metric_id).results;
                    results.reset(results.parse(result));
                });
                def.resolve();
            });
            
            return def.promise();
        }
    });

    dashboard.collections('Metrics', Metrics);
});