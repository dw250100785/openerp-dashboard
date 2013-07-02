openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    
    var default_sync = _super.sync;
    
    var Results = BaseCollection.extend({
        
        initialize: function(data, options){
             this.model_name = options.model_name;
             this.method = options.method;
             this.query = options.query;
             this.fields = options.fields;
             this.columns = [];
        },
        
        update: function(options){
            return this.fetch(options);
        },
        
        parse: function(data){
            var results = data.results, desc = data.columns;
            
            results = !$.isArray(results) ? [results] : results;
            
            // get column info
            var output_fields = this.fields.filterByTypes('output'),
                sorted = [], columns = [], field;
            
            _(results).each(function(result, index){
                var item = {};
        
                _(desc).each(function(column){
                    var sql_name = column.name;
                
                    if(sql_name in result){
                        if(index == 0){
                            field = output_fields.oneBySQLName(sql_name);
                            if(!field){
                                throw new Error('output field "' + sql_name + '" can not be found in metric.fields, please define a field with the correct sql_name and "output" type');    
                            }
                            columns.push(field);
                        }
                        item[sql_name] = result[sql_name];
                    }
                });
                
                sorted.push(item);
            });    
                
            this.columns = columns;
            return sorted;
        },
        
        
        // convert field reference to metric.fields.sql_name or the real field name in ORM mode
        relativeDomain: function(domain){
            var result = [];
            _(domain).each(function(criterion){
                if(criterion && criterion.length == 3){
                    var criter = criterion.slice(0);
                    var convert_field = function(fields, reference, metric_name){
                        var field = fields.oneByRef(reference), name;
                        
                        if(!field){
                            throw new Error('field with reference "' + reference + '" does not exist on metric "' + metric_name + '"');
                        }
                        
                        if(field.get('sql_name') != ''){
                            name = field.get('sql_name');    
                        }
                        else if(field.get('field_description').name){
                            name = field.get('field_description').name;    
                        }
                        else {
                            throw new Error('can not create a domain for metric: ' + metric_name)
                        }  
                        return name;  
                    };
                    
                    
                    // test if it's a date extract() case
                    var re = /extract\("[\w]+" from ([\w]+)\)/;
                    if(re.test(criter[0])){
                        var matches = criter[0].match(re),
                            ref = matches[1];
                        
                        var name = convert_field(this.fields, ref, this.get('name'));
                        criter[0] = criter[0].replace(ref, name);
                    }
                    else {
                        criter[0] = convert_field(this.fields, criter[0], this.get('name'));
                    }
                }
                result.push(criter);
            }, this);
            
            return result;
        },
        
        execute: function(options){
            return this.sync(null, null, options);
        },
        
        sync: function(method, model, options){
            
            options = _.defaults(options || {}, {
                domain: [], 
                group_by: [],
                order_by: [],
                limit: 'ALL',
                offset: 0,
                success: function(){},
                error: function(){},
                reset: true
            });
        
            var relative_domain = this.relativeDomain(options.domain.slice(0));
            
            var def = default_sync('call', { model_name: this.model_name }, {
                method: this.method,
                args: [[], this.query, relative_domain, options.group_by, options.order_by, options.limit, options.offset]
            });      
            
            def.then(options.success, options.error);
            
            return def.promise();
        }
    });

    dashboard.collections('Results', Results);
});