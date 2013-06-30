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
            var data = [];
            
            this.collection.each(function(metric){
                var results = metric.results, 
                    name, value, options = metric.get('options');
                
                if(results && results.length > 0){
                    var result = results.at(0);
                    for(name in result.attributes){
                        value = result.get(name);
                        data.push({
                            label: results.getColumn(name).get('name'),
                            value: this.getValue(value, options),
                            className: this.getClassName(value, options)
                        });    
                    }
                }
            }, this);
            
            return {
              "results": data
            };
        }
    });

    dashboard.views('DisplayNumeric', DisplayNumeric);
});