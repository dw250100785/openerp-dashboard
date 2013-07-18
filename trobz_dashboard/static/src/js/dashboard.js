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
        
       
   
        init: function(parent, dataset, view_id, options) {
            this.view_loaded = $.Deferred();
            this.board_id = dataset.ids[0] || null;
            this._super(parent, dataset, view_id, options);
            this.context = dataset.get_context();
        },
   
        start: function(){
   
            if(!this.board_id){
                throw new Error("Dashboard view can not be initialized with a 'res_id' configured in the action.");
            }    
   
            
            
            var debug = board = new Board({
                id: this.board_id
            });
            
            var self = this;
            board.fetch().done(function(){
   
                var state = self.state = new State();
                
                var views = self.views = {
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
                self.bind();
                
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
             
        bind: function(){
            dashboard.on('open:list',this.openList,this);
            this.views.toolbar.on('fullscreen', this.fullscreen, this);
            this.views.toolbar.on('mode', this.switchMode, this);
            
            //bind the state changes with the URL
            this.state.on('change', this.stateChanged, this);
        },
        
        unbind: function(){
            dashboard.off();
            this.views.toolbar.off();
            this.state.off();
        	
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
            
            this.$el.parent().addClass('fullscreen');
        },
        
        exitFullscreen: function(){
            if(document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }  
  
            this.$el.parent().removeClass('fullscreen');
        },
        
        stateChanged: function(state){
            this.do_push_state(state.attributes);
        },
        
        view_loading: function(data){
            this.view_loaded.resolve();
            return this._super(data);
        },
        
        openList: function(model_model,model_name, domain_orm,domain_display){
        	
        	var show = this.$el.show;
        	
        	this.$el.show = function(){
        		$('.domain_search').remove();
        		show.apply(this, arguments);
        	};
        	
        	// We use this new ergonomy with a top bar instead of passing the domain in the context 
        	// because we allow the search on fields which are not directly on the main model
        	// For instance: order_id.partner_id.country_id.name
        	$('.oe_view_manager').before(
        		$('<div class="domain_search">').text(domain_display)
        	)
        	
            this.do_action({
                type: 'ir.actions.act_window',
                res_model: model_model,
                domain: domain_orm,
                name:model_name,
                flags : {
                	new_window : true,
                	search_view: true,
                	display_title: true,
                	pager: true,
                	list: {selectable: true}
                },
                target: 'current',
                view_mode: 'list,form',
                views: [[false,'list', 'form']],
                context: this.context.eval(),
            });
        },
        on_show: function(){
        	$('.domain_search').remove();
        },
        destroy: function() {
            this.region.close();
            this.unbind();
            $('.domain_search').remove();
            this._super();
        }
    });     

});