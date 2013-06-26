openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Field = dashboard.models('Field'),
        BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    var Fields = BaseCollection.extend({
        model_name: 'dashboard.field',
        model: Field,
        
        initialize: function(data, options){
            this.field_ids = options ? options.field_ids : null;
            
            this.callbacks = {
                ready: new Backbone.Marionette.Callbacks() 
            };
        },
        
        oneByRef: function(reference){
            return this.findWhere({'reference': reference});
        },
        
        oneBySQLName: function(sql_name){
            return this.findWhere({'sql_name': sql_name});
        },
        
        filterByTypes: function(){
            var types = _.toArray(arguments), Constructor = this.constructor;
            var result = this.filter(function(field){
                return _.intersection(types, field.get('type_names')).length > 0;
            });
            return new Constructor(result);
        },
        
        search: function(){
            return {
                filter: [['id', 'in', this.field_ids]]
            }
        },
        
        ready: function(callback, context){
            this.callbacks.ready.add(callback, context);
        },
        
        update: function(){
            var self = this;
            return _super.update.apply(this, arguments).done(function(){
                self.callbacks.ready.run(self);
            });
        }
    });

    dashboard.collections('Fields', Fields);
});