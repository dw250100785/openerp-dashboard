openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    var Results = BaseCollection.extend({
        
        initialize: function(data, options){
            this.columns = [];
            this.fields = options.fields;
        },
        
        parse: function(response){
            
            //FIXME: No solution to fetch data in the correct order on server side:
            // - psycopg2 dictfetchall() return unsorted result
            // - sorting on server side with a collections.OrderedDict is not correctly retrieved by JSON-RPC...
            // finally, only sorting on client side, based on cursor.description, is possible but quiet dangerous depending of the amount of data...
              
            var results = response.results, desc = response.columns;
            
            // get column info
            var output_fields = this.fields.types('output'),
                sorted = [], columns = [], field;
            
            _(results).each(function(result, index){
                var item = {};
        
                _(desc).each(function(column){
                    var ref_name = column.name;
                
                    if(ref_name in result){
                        if(index == 0){
                            field = output_fields.oneByRef(ref_name);
                            if(!field){
                                throw new Error('output field "' + ref_name + '" can not be found in metric.fields, please define a field with the correct reference name and "output" type');    
                            }
                            columns.push(field);
                        }
                        item[ref_name] = result[ref_name];
                    }
                });
                sorted.push(item);
            });    
                
            this.columns = columns;
            return sorted;
        }
    });

    dashboard.collections('Results', Results);
});