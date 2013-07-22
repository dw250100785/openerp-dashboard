openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){
 
    var TimeBar = dashboard.views('TimeBar'),
        SearchView = dashboard.views('Search');
 
    var Layout = Marionette.Layout,
        _super = Layout.prototype;

    var ToolBar = Layout.extend({
        
        regions: {
            timebar: '#timebar',
            searchbar: '#searchbar'
        },
        
        template: 'TrobzDashboard.toolbar',
        
        events: {
            'click .board_action .fullscreen_action': 'switchFullscreen',
            'click .board_action .sliding_action': 'slidingMode',
            'click .board_action .list_action': 'listMode',
            'click .board_action .search_action': 'toggleSearch',
        },
        
        ui: { 
            mode: '.mode'
        }, 
        
        onRender: function(){
            this.views = {
                timebar: new TimeBar({
                    model: this.model.period
                }),
                searchbar: new SearchView({
                    collection: this.model.global.fields,
                    search: this.model.global.search,
                    type: 'global',
                    enabled: ['domain']
                })
            };
              
            this.timebar.show(this.views.timebar);
            
            this.views.searchbar.hide();
            this.searchbar.show(this.views.searchbar);
        },
        
        toggleSearch: function(e){
            e.preventDefault();
            this.views.searchbar.toggle();
        },
        
        switchFullscreen: function(e){
            e.preventDefault();
            var $icon = $(e.currentTarget).find('i');
        
            this.fullscreen = !this.fullscreen;
            dashboard.trigger('fullscreen', this.fullscreen);        
            $icon.attr('class', this.fullscreen ? 'icon-resize-small' : 'icon-resize-full');
        },
        
        slidingMode: function(e){
            e.preventDefault();
            this.trigger('mode', 'sliding');        
            var html = Marionette.Renderer.render('TrobzDashboard.toolbar.sliding');
            this.ui.mode.empty().html(html);
        },
        
        listMode: function(e){
            e.preventDefault();
            this.trigger('mode', 'list');        
            var html = Marionette.Renderer.render('TrobzDashboard.toolbar.list');
            this.ui.mode.empty().html(html);
        },
        
    });

    dashboard.views('ToolBar', ToolBar);

});