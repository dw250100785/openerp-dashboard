openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Operator = dashboard.models('Operator'),
        _super = Backbone.Collection.prototype;
    
    var Operators = Backbone.Collection.extend({
        
        model: Operator,
        
        byName: function(name){
            return _(this.models).findWhere({ name: name });
        },
    
        initialize: function(){
            this.add([
                 // general
                new Operator('not', this.t('not'), '!'),
                new Operator('|', this.t('or'), '|'),
                new Operator('&', this.t('and'), '&'),
                new Operator('(', '('),
                new Operator(')', ')'),
        
                // numeric
                new Operator('e', this.t('is equal to'), '=' ),
                new Operator('ne', this.t('is not equal to'), '!=' ),
                new Operator('gt', this.t('is higher than'), '>' ),
                new Operator('gte', this.t('is higher or equal to'), '>=' ),
                new Operator('lt', this.t('is lower than'), '<' ),
                new Operator('lte', this.t('is lower or equal to'), '<=' ),
                
                // string
                new Operator('contains', this.t('contains'), 'like'),
                new Operator('n_contains', this.t('doesn\'t contains'), 'like', { 
                    not: true 
                }),
                
                // date
                new Operator('day', this.t('of day'), '=', {
                    string: function(val){ return moment().lang()._weekdays[val] },
                    field: function(field){ return 'extract("dow" from ' + field + ')'; } 
                }),
                new Operator('month', this.t('of month'), '=', {
                    string: function(val){ return moment().lang()._months[val] },
                    field: function(field){ return 'extract("month" from ' + field + ')'; } 
                }),
                new Operator('year', this.t('of year'), '=', {
                    field: function(field){ return 'extract("year" from ' + field + ')'; } 
                }),
                new Operator('quarter', this.t('of quarter'), '=', {
                    string: function(val){ return numeral(val).format('0o'); },
                    field: function(field){ return 'extract("quarter" from ' + field + ')'; } 
                })
            ]);                 
            
        }
    });
    
    dashboard.collections('Operators', Operators);
});