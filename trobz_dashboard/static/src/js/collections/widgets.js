openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    
    var Widget = dashboard.models('Widget'),
        BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    
    //custom sync method to get both widget and board_to_widget_rel data + sort them by sequence
    var default_sync = _super.sync;    
    var sync = function(method, collection, options){
        if(method != 'read'){
            throw new Error('widgets collection does not support method: ' + method);
        }
        
        options = options || {};
        
        var success = options.success || function(){},
            error = options.error || function(){};
        
        if('success' in options ){ delete options.success; }
        if('error' in options ){ delete options.error; }
        
        var defs = [],
            deferrer = $.Deferred(),
            widgets = default_sync(method, collection, options);
        
        widgets.done(function(results){
            _(results).each(function(result){
                var def = $.Deferred();
        
                var relation = default_sync(method, {model_name : 'dashboard.board_to_widget_rel'}, {
                    type: 'first',
                    filter: [
                        ['board_id', '=', collection.board_id],
                        ['widget_id', '=', result.id]
                    ]
                });
                
                relation.done(function(rel_result){
                    _.extend(result, {
                        sequence: rel_result.sequence || 0,
                        width: rel_result.width || 10
                    });
                    def.resolve(result);
                });
                defs.push(def.promise());    
            });
                 
            $.when.apply($, defs).done(function(){
                deferrer.resolve(_(results).sortBy('sequence'));
            });
        });
        
        deferrer.then(success, error);
        return deferrer.promise();
    };

    var Widgets = BaseCollection.extend({
        
        model_name: 'dashboard.widget',
        sync: sync,
        
        model: Widget,
        
        comparator: 'sequence',
        
        initialize: function(data, options){
            this.board_id = options.board_id;
        },
        
        search: function(){
            return {
                filter: [['board_rel.board_id', '=', this.board_id]]
            }
        }
    });

    dashboard.collections('Widgets', Widgets);
});