openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Fields = dashboard.collections('Fields'),
        Metric = dashboard.models('Metric');
        
    var BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    var Metrics = BaseCollection.extend({
        model_name: 'dashboard.metric',
        
        model: Metric,
        
        initialize: function(data, options){
            this.widget_id = options.widget_id;
        
            this.fields = new Fields();
            
            this.callbacks = {
                ready: new Backbone.Marionette.Callbacks() 
            };
        },
        
        execute: function(ids, domain, order, group){
            var defs = [], 
                self = this;
            
            this.each(function(metric){
                var def = metric.execute(ids, domain, order, group);
                defs.push(def);
            });
            
            var finished = $.when.apply($, defs);
            
            finished.done($.proxy(function(){
                this.trigger('results:updated', this);
            }, this));
        },
        
        ids: function(){
            var ids = [];
            this.each(function(metric){
                ids.push(metric.get('id'));
            });    
            return ids;
        },
        
        search: function(){
            return {
                filter: [['widget_id', '=', this.widget_id]]
            }
        },
        
        ready: function(callback, context){
            this.callbacks.ready.add(callback, context);
        },
        
        loadFields: function(){
            var defs = [], def, first = true;
            
            this.each(function(metric){
                def = metric.fields.update();
                def.done($.proxy(function(){
                    if(first){
                        this.fields.add(metric.fields.models);
                        first = false;
                    }
                    // if fields from the first metric are added, only remove fields without the same reference for other field results 
                    else {
                        var toRemove = [];
                        this.fields.each(function(field){
                            if(metric.fields.where({reference: field.get('reference')}).length <= 0){
                                toRemove.push(field);                         
                            }
                        }, this);
                        this.fields.remove(toRemove);
                    }
                }, this));
                defs.push(def);
            }, this);
            return $.when.apply($, defs);
        },
        
        update: function(){
            return _super.update.apply(this, arguments).done($.proxy(function(){
                this.loadFields().done($.proxy(function(){
                    this.callbacks.ready.run({}, this);
                }, this));
            }, this));
        }
    });

    dashboard.collections('Metrics', Metrics);
});