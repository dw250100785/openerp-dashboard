openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var PagerResults = dashboard.collections('PagerResults'),
        Results = dashboard.collections('Results');
    
    var Fields = dashboard.collections('Fields');
            
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Metric = BaseModel.extend({
        model_name: 'dashboard.metric',
        
        initialize: function(data, options){
            this.fields = new Fields([], {
               field_ids: this.get('field_ids') 
            });    
            
            var Collection = this.getResultCollection();
            this.results = new Collection([], _.extend(this.get('options'), {
                model_name: this.get('model_details').model,
                method: this.get('method'),
                query: this.get('query_name'),
                fields: this.fields
            }));
            
            this.listenTo(this.results, 'reset', this.resultChanged);
        },
        
        getResultCollection: function(){
            return this.get('type') == 'list' ? PagerResults : Results; 
        },
        
        execute: function(ids, domain, order_by, group_by){
            //fields have to be loaded before the metric execution...
            var def = $.Deferred();
            this.fields.ready(function(){
                
                var rdef, options = {
                    domain: domain,
                    group_by: group_by,
                    order_by: order_by
                };
                
                //pager has to be re initialized first
                if(this.results instanceof PagerResults){
                    rdef = this.results.load(options);    
                }
                else {
                    rdef = this.results.update(options);
                }
                
                rdef.done(function(){
                    def.resolve();
                });
            }, this);
            
            return def.promise();
        },
        
        resultChanged: function(){
            //something has changed on the result = metric has changed 
            this.collection.trigger('reset', this, this.results);
        }
    
    });

    dashboard.models('Metric', Metric);
});