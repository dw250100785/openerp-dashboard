var debug;

openerp.trobz.module('trobz_dashboard').ready(function(instance, dashboard, _, Backbone, base){
    
    var _t = instance.web._t,
        _lt = instance.web._lt;
    
    var Renderer = Marionette.Renderer,
    
        //collections
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
   
            
            
            var debug = board = this.board = new Board({
                id: this.board_id
            });
            
            var self = this;
            board.fetch().done(function(){
   
                var state = self.state = new State();
                
                var views = self.views = {
                    panel: new PanelLayout(),
                    
                    toolbar: new ToolBar({
                        model: board
                    }),
                         
                    widgets: new WidgetsView({
                        collection: board.widgets,
                        period: board.period,
                        global_search: board.global.search,
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
            dashboard.on('fullscreen', this.fullscreen, this);
            dashboard.on('mode', this.switchMode, this);
            
            //bind the state changes with the URL
            this.state.on('change', this.stateChanged, this);
        },
        
        unbind: function(){
            dashboard.off();
            if(this.views && this.views.toolbar){
                this.views.toolbar.off();
            }
            if(this.state){
                this.state.off();
            }
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
        
        openList: function(metric, search){
        	
        	var domain = search.get('domain'),
        	    has_domain = domain.length > 0,
            	groups = _(domain).groupBy(function(criterion){ 
                    return criterion.field.get('reference'); 
                }),
                period = this.board.period,
                period_field = metric.fields.types('period').at(0),
                period_path = period_field.get('domain_field_path'),
                orm_domain = search.domain('domain_field_path');
        	
        	var show = this.$el.show;
        	this.$el.show = function(){
        		$('.search.outside').remove();
        		show.apply(this, arguments);
        	};
        	
        	
        	// add period to the domain
            if(period_path){
               orm_domain = orm_domain.concat([[period_path, '>=', period.start('s')] , [period_path, '<', period.end('s')]])
            }
            else {
                console.warn('period', period_field, 'does not have a', 'domain_field_path', 'attribute, the period will not be used in metric list view...');
            }
            
        	
        	// We use this new ergonomy with a top bar instead of passing the domain in the context 
        	// because we allow the search on fields which are not directly on the main model
        	// For instance: order_id.partner_id.country_id.name
        	$('.oe_view_manager').before(
        		$('<div class="search outside">').html(
        		    Renderer.render('TrobzDashboard.metric_info', {
                        operators: search.operators,
                        group_size: _(groups).size(),
                        groups: groups,
                        has_domain: has_domain,
                        period: period.values('LL'),
                        period_field: period_field,
                        has_period: !!period_path
                    })
        		)
        	)
        	
        	
            this.do_action({
                type: 'ir.actions.act_window',
                res_model: metric.get('model_details').model,  
                domain: orm_domain,
                name: metric.get('model_details').name,
                flags : {
                	new_window : true,
                	search_view: true,
                	display_title: true,
                	pager: true,
                	list: {selectable: true}
                },
                target: 'current',
                view_mode: 'list,form',
                views: [[false /*view id, false if none*/,'list'/*view type*/], [false, 'form']],
                context: this.context.eval(),
            });
        },
        on_show: function(){
        	$('.search.outside').remove();
        },
        destroy: function() {
            if(this.region){
                this.region.close();
            }
            this.unbind();
            $('.search.outside').remove();
            this._super();
        }
    });     

});