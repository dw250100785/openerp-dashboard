var debug;

openerp.trobz.module('trobz_dashboard').ready(function(instance, dashboard, _, Backbone, base){
    
    var _t = instance.web._t,
        _lt = instance.web._lt;
    
    var //collections
        WidgetsCollection = dashboard.collections('Widgets'),
        
        //models
        State = dashboard.models('State'),
        Board = dashboard.models('Board'),
        
        //views
        WidgetsView = dashboard.views('Widgets'),
        ToolBar = dashboard.views('ToolBar'),
        
        //layout
        PanelLayout = dashboard.views('PanelLayout');
    
   
    instance.web.views.add('dashboard', 'instance.trobz_dashboard.DashboardView');
    instance.trobz_dashboard.DashboardView = instance.web.View.extend({
        
        display_name: _lt('Dashboard'),
        template: "TrobzDashboard",
        view_type: 'form',
        
        options: {
            'action_buttons': false,
            'search_view': false,
        },
        
   
        init: function(parent, dataset, view_id, options) {
            this.view_loaded = $.Deferred();
            this.board_id = dataset.ids[0] || null;
            this._super(parent, dataset, view_id, options);
        },
   
        start: function(){
   
            if(!this.board_id){
                throw new Error("Dashboard view can not be initialized with a 'res_id' configured in the action.");
            }    
   
            
            
            var debug = board = new Board({
                id: this.board_id
            });
            
            var self = this;
            board.update().done(function(){
   
                var state = new State();
                
                var views = {
                    panel: new PanelLayout(),
                    
                    toolbar: new ToolBar({
                        model: board.period
                    }),
                         
                    widgets: new WidgetsView({
                        collection: board.widgets,
                        period: board.period,
                        debug: self.session.debug
                    })    
                };
                
                
                //bind special event 
                self.bind(state, views.toolbar);
                
                //setup the state 
                state.set($.bbq.getState());
                state.push();
       
                var region = self.region = new Marionette.Region({
                    el: '#trobz_board'
                });
                
                $.when(state.process(), this.view_loaded).done(function(){
                    state.bind();
                    region.show(views.panel);
                    views.panel.toolbar.show(views.toolbar);
                    views.panel.widgets.show(views.widgets);
                });
            });
            return this._super();
        },
             
        bind: function(state, toolbar){
            
            
            toolbar.on('fullscreen', this.fullscreen, this);
            toolbar.on('mode', this.switchMode, this);
            
            //bind the state changes with the URL
            state.on('change', this.stateChanged, this);
        },
        
        
        switchMode: function(type){
            this.region.currentView.widgets.currentView.mode(type);
        },
        
        fullscreen: function(enter){
            if(enter){
                this.enterFullscreen();
            }
            else {
                this.exitFullscreen();
            }
        },
        
        enterFullscreen: function(){
            var element = this.$el.parent().get(0);

            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
            
            this.$el.addClass('fullscreen');
        },
        
        exitFullscreen: function(){
            if(document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }  
  
            this.$el.removeClass('fullscreen');
        },
        
        stateChanged: function(state){
            this.do_push_state(state.attributes);
        },
        
        view_loading: function(data){
            this.view_loaded.resolve();
            return this._super(data);
        },
        
        destroy: function() {
            this.region.close();
            this._super();
        }
    });     

});