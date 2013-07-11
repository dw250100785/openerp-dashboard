openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var SearchModel = dashboard.models('Search');

    var SearchView = dashboard.views('WidgetSearch'),
        Status = dashboard.views('WidgetStatus'),
        Display = dashboard.views('WidgetDisplay');

    var Layout = Marionette.Layout,
        _super = Layout.prototype;

    var Widget = Layout.extend({
        
        className: 'widget',
        
        template: 'TrobzDashboard.widget',
        
        events: {
            'click .toggle_search': 'toggleSearch'
        },
        
        regions: {
            search: '.search',
            display: '.display',
            status: '.status',
            pager: '.pager'
        },
        
        bindSearch: {
            'numeric': ['domain'],
            'list':    ['domain', 'order'],
            'graph':   ['domain', 'order', 'group']
        },
        
        initialize: function(options){
            
            this.resize();
            
            this.type = this.model.get('type');
            
            this.models = {
                period: options.period,
                search: new SearchModel({}, {
                    fields: this.model.metrics.fields
                })
            };
            
            this.views = {
                status: new Status({
                    collection: this.model.metrics,
                    search: this.models.search
                }),
                search: new SearchView({
                    collection: this.model.metrics.fields,
                    type: this.model.get('type'),
                    search: this.models.search
                }),
                display: new Display({
                    collection: this.model.metrics,
                    type: this.model.get('type'),
                    search: this.models.search
                })
            };
        
            
            this.listenTo(this.models.search, 'change:period', this.doSearch);
            
            // set search attribute listened by the widget
            this.listen = this.type in this.bindSearch ? this.bindSearch[this.type] : []; 
            _(this.listen).each(function(attr){
                this.listenTo(this.models.search, 'change:' + attr, this.doSearch);
            }, this);    
        },
        
        resize: function(){
            this.$el.addClass('size' + this.model.get('width'));
        },
        
        doSearch: function(){
            var search = this.models.search, 
                options = { period: this.models.period.values(), domain: [], order: [], group: [] };
       
            //pass only search attributes that the widget is listening to     
            _(options).each(function(def, attr){
                if(_(this.listen).contains(attr) && $.isFunction(search[attr])){
                    options[attr] = search[attr].call(search);
                }
            }, this);    
        
            return this.model.metrics.execute(options);
        },
        
        
        onRender: function(){
            this.status.show(this.views.status);
            this.search.show(this.views.search);
            this.display.show(this.views.display);
            
            this.doSearch();
        },
        
        hide: function(){
            this.$el.hide();
        },
        
        show: function(){
            this.$el.show();
        },
        
        /*
         * UI Events
         */
        
        toggleSearch: function(e){
            e.preventDefault();
            
            if(this.search.$el.hasClass('hidden')){
                this.search.$el.removeClass('hidden');
            }
            else {
                this.search.$el.addClass('hidden');
            }
        },
        
        serializeData: function(){
            return {
              "name": this.model.get('name'),
            }
        }
    });

    dashboard.views('Widget', Widget);

});