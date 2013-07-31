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
                offset: 0,
                //warning: only for testing propose, never use it for something else !
                security_test: false
            });
            
            // force security_test to false if not in debug mode !
            options.security_test = !options.debug ? false : options.security_test; 
            
            var promise = this.sync('call', { model_name: this.model_name }, {
                method: this.get('method'),
                args: [[this.get('id')], options.period, options.domain, options.group, options.order, options.limit, options.offset, options.debug, options.security_test]
            });      
            
            var metrics = this.metrics;
            promise.done(function(results){
                var debug = {};    
                    
                _(results).each(function(metric_data, widget_id){
                
                    if(options.debug && 'debug' in metric_data){
                        if('queries' in metric_data.debug){
                            console.group(metric_data.debug.message);
                            _.each(metric_data.debug.queries, function(query_info){
                                console.groupCollapsed(query_info.message);
                                console.debug(query_info.query);
                                if(query_info.warning && query_info.warning.length > 0){
                                    console.groupCollapsed('warnings');
                                    _(query_info.warning).each(function(warning){console.warn(warning);});   
                                    console.groupEnd();    
                                }
                                console.groupEnd();    
                            });
                            console.groupEnd();    
                        }
                        
                        else {
                            console.group(metric_data.debug.message);
                            console.groupEnd();    
                        }
                        debug[widget_id] = metric_data.debug; 
                        delete metric_data.debug;
                    }
                    
                    _(metric_data).each(function(result, metric_id){
                        var results = metrics.get(metric_id).results;
                        results.reset(results.parse(result));
                    });
                });
                
                metrics.trigger('results:updated', this);
                
                def.resolve(results, debug);
            });
            
            promise.fail(function(){
                def.reject.apply(def, _.toArray(arguments));
            });
            
            return def.promise();
        }        
        
    });

    dashboard.models('Widget', Widget);
});