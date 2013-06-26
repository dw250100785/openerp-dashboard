openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var DisplayNumeric = View.extend({
    
        className: 'numeric', 
    
        template: 'TrobzDashboard.widget.display.numeric',

        getField: function(sql_name, fields){
            var field = fields.oneBySQLName(sql_name);
            if(!field){
                throw new Error('output field with sql_name: ' + sql_name + ' can not be found.');
            }
            return field;
        },
        
        getValue: function(value, options){
            options = options || {};
            return numeral(parseInt(value)).format(options.format || '0');
        },
        
        getClassName: function(value, options){
            options = options || {};
            value = parseInt(value);
            var classname = null, condition;
            
            if(options.thresholders){
                for(condition in options.thresholders){
                    if(eval(value + condition)){
                        classname = options.thresholders[condition];
                    }
                }
            }
            
            return classname;
        },
        
        serializeData: function(){
            var results = [];
            
            this.collection.each(function(metric){
                var outputFields = metric.fields.filterByTypes('output'),
                    result = metric.get('result'), 
                    name, value;
                
                if(result && result.length > 0){
                    for(name in result[0]){
                        value = result[0][name];
                        
                        results.push({
                            label: this.getField(name, outputFields).get('name'),
                            value: this.getValue(value, metric.get('options')),
                            className: this.getClassName(value, metric.get('options'))
                        });    
                    }    
                }
            }, this);
            
            return {
              "results": results
            };
        }
    });

    dashboard.views('DisplayNumeric', DisplayNumeric);
});