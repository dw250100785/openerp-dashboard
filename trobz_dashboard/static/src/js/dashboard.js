openerp.trobz.module('trobz_dashboard').ready(function(instance, dashboard, _, Backbone, base){
    
    var _t = instance.web._t,
        _lt = instance.web._lt,
        QWeb = instance.web.qweb;
    
    var Board = dashboard.views('Board');
    
    instance.web.views.add('dashboard', 'instance.trobz_dashboard.DashboardView');
    instance.trobz_dashboard.DashboardView = instance.web.View.extend({
        
        display_name: _lt('dashboard'),
        template: "TrobzDashboard",
        view_type: 'form',
        
        options: {
            'action_buttons': false,
            'search_view': false,
        },
        
        init: function(parent, dataset, view_id, options) {
    
            this._super(parent, dataset, view_id, options);
    
            var //views
                board = new Board({
                    ref: {
                        display: QWeb
                    }
                });
                    
            this.views = { board: board };
            this.collections = { };
            this.models = { };
        },
        
        
        view_loading: function(data){
            this.fields_view = data;
            this.views.board.resetElement(this.$el);
            this._super(data);
        },
        
        /**
         * destroy all, rather twice than once...
         */
        destroy: function() {
            
            _(this.views).each(function(view){
                view.off();
                view.destroy();
            });
            _(this.models).each(function(model){
                model.off();
            });
            _(this.collections).each(function(collection){
                collection.off();
                collection.unbind();
            });
            _(this.collections).each(function(collection){
                collection.reset();
            });
            
            var name = null;
            for(name in this.views){
                this.views[name] = null;
            }
            for(name in this.collections){
                this.collections[name] = null;
            }
            for(name in this.models){
                this.models[name] = null;
            }
                
            this._super();
        }
        
    });     

});