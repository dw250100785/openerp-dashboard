openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    

    var Metrics = dashboard.collections('Metrics');
            
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Widget = BaseModel.extend({
        
        model_name: 'dashboard.widget',
        
        initialize: function(data, options){
            
            this.metrics = new Metrics();
            
            var metrics = [];
            if('metrics' in data){
                metrics = data.metrics;
                delete data.metrics;
            }
         
            this.metrics.reset(metrics);
            
            return data;
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
                method: this.get('method'),
                args: [[this.get('id')], options.period, options.domain, options.group, options.order, options.limit, options.offset]
            });      
            
            var metrics = this.metrics;
            promise.done(function(results){
                _(results).each(function(metric_data, widget_id){
                    _(metric_data).each(function(result, metric_id){
                        var results = metrics.get(metric_id).results;
                        results.reset(results.parse(result));
                    });
                });
                
                metrics.trigger('results:updated', this);
                
                def.resolve();
            });
            
            return def.promise();
        }        
        
    });

    dashboard.models('Widget', Widget);
});