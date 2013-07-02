openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Operators = dashboard.collections('Operators');
    
    var Model = Backbone.Model,
        _super = Model.prototype;
   
    var Search = Model.extend({
        
        initialize: function(){
            
            this.set({
                domain: [],
                order: [],
                group: [],
                period: []
            }, {silent: true});
        
            this.operators = new Operators();
        },
        
        /*
         * Period manipulation
         */
        
        changePeriod: function(field, period, options){
            this.set('period', [
                [field.get('reference'), this.operators.byName('gte').domain, period.start().format('YYYY-MM-DD')],
                [field.get('reference'), this.operators.byName('lt').domain, period.end().format('YYYY-MM-DD')],
            ], options);
        },
        
        /*
         * Domain manipulation
         */
        
        addDomain: function(field, operator, value){
            if(this.getCriterion(field, operator, value) == null && (value || _(['true', 'false']).contains(operator))){
                var domain = this.get('domain').slice(0);    
                domain.push({
                    field: field, 
                    operator: operator, 
                    value: value
                });
                this.set('domain', domain);
            }
        },
        
        removeDomain: function(field, operator, value){
            var index = this.getCriterion(field, operator, value);
            if(index != null){
                var domain = this.get('domain').slice(0);    
                domain.splice(index, 1);
                this.set('domain', domain);
            }
        },
        
        getCriterion: function(field, operator, value){
            var domain = this.get('domain');
            for(var i=0 ; i< domain.length ; i++){
                if(
                    _.size(domain[i]) == 3
                    && domain[i].field.get('reference') == field.get('reference') 
                    && domain[i].operator == operator
                    && domain[i].value == value  
                )
                {
                    return i;
                }
            }
            return null;
        },
        
        domain: function(){
            var domain = this.get('domain'),
                object = [];
        
            var gdomain = _(domain).groupBy(function(criterion){return criterion.field.get('reference'); });
            
            _(gdomain).each(function(criteria, group){
                
                _(criteria).each(function(criterion, i){
                    var operator = this.operators.byName(criterion.operator);
                
                    if((criteria.length - i) >= 2){
                        object.push(this.operators.byName('|').domain);
                    }
                    if(operator.not){
                        object.push(this.operators.byName('not').domain);
                    }
                    object.push([
                        operator.field(criterion.field.get('reference')),
                        operator.domain,
                        operator.value(criterion.value)
                    ]);
                      
                }, this);
                
            }, this);
        
            // add the period    
            object = object.concat(this.get('period'));
            return object;
        },
        
        
        /*
         * Order manipulation
         */
        
        addOrder: function(field, type){
            if(type != 'ASC' && type != 'DESC'){
                throw new Error('order type has to be ASC or DESC');
            }
            this.set('order', [[field, type]]);    
        },
        
        removeOrder: function(field, type){
            var order = this.get('order').slice(0),
                index = this.getOrderIndex(field, type);
            
            if(index != null){
                order.splice(index, 1);
                this.set('order', order);
            }
        },
        
        getOrderIndex: function(field){
            var index = null;
            _(this.get('order')).each(function(val, i){
                if(val.length == 2 && val[0].get('reference') == field.get('reference')){
                    index = i;
                } 
            });
            return index;
        },
        
        order: function(){
            var order = [];
            _(this.get('order')).each(function(val){
                order.push(val[0].get('sql_name') + ' ' + val[1]);
            });
            return order;
        },
        
        /*
         * Group manipulation
         */
        
        addGroup: function(field){
            this.set('group', [field]);    
        },
        
        removeGroup: function(field){
            var group = this.get('group').slice(0),
                index = this.getGroupIndex(field);
            
            if(index != null){
                group.splice(index, 1);
                this.set('group', group);
            }
        },
        
        getGroupIndex: function(field){
            var index = null;
            _(this.get('group')).each(function(gfield, gindex){
                if(field && field.get('reference') == gfield.get('reference')){
                    index = gindex;
                } 
            });
            return index;
        },
        
        group: function(){
            var group = [];
            _(this.get('group')).each(function(field){
                group.push(field.get('sql_name'));
            });
            return group;
        }
    });

    dashboard.models('Search', Search);
});