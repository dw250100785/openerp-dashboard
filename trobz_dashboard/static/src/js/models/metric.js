openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Fields = dashboard.collections('Fields');
            
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Metric = BaseModel.extend({
        model_name: 'dashboard.metric',
        
        constructor: function(data, options){
            BaseModel.apply(this, arguments);
        
            this.fields = new Fields([], {
               field_ids: this.get('field_ids') 
            });    
        },
        
        // convert field reference to metric.fields.sql_name or the real field name in ORM mode
        metricDomain: function(domain){
            var result = [];
            _(domain).each(function(criterion){
                var criter = criterion.slice(0);
                if(criter.length == 3){
                    var field = this.fields.oneByRef(criter[0]);
                    
                    if(!field){
                        throw new Error('field with reference "' + criter[0] + '" does not exist on metric "' + this.get('name') + '"');
                    }
                    
                    if(field.get('sql_name') != ''){
                        criter[0] = field.get('sql_name');    
                    }
                    else if(field.get('field_description').name){
                        criter[0] = field.get('field_description').name;    
                    }
                    else {
                        throw new Error('can not create a domain for metric: ' + this.get('name'))
                    }
                }
                result.push(criter);
            }, this);
            
            return result;
        },
        
        execute: function(ids, domain, group_by, order_by, limit, offset){
            
            group_by = group_by || [];
            order_by = order_by || [];
            limit = limit || 'ALL';
            offset = offset || 0;
            
            var metric_domain = this.metricDomain(domain.slice(0));
            
            return this.sync('call', { model_name: this.get('model_details').model }, {
                method: this.get('method'),
                args: [ids, this.get('query_name'), metric_domain, group_by, order_by, limit, offset]
            });        
        }
    });

    dashboard.models('Metric', Metric);
});