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
            
            this.hide();
            
            this.model.ready(function(){
                
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
            
                
                this.listenTo(this.models.period, 'change', this.changePeriod); 
                this.listenTo(this.models.search, 'change:period', this.doSearch);
                
                // set search attribute listened by the widget
                this.listen = this.type in this.bindSearch ? this.bindSearch[this.type] : []; 
                _(this.listen).each(function(attr){
                    this.listenTo(this.models.search, 'change:' + attr, this.doSearch);
                }, this);    
                       
            }, this);
        },
        
        resize: function(){
            this.$el.addClass('size' + this.model.get('width'));
        },
        
        doSearch: function(){
            var search = this.models.search, 
                defaults = { ids: [], domain: [], order: [], group: [] },
                args = [];
       
            //pass only search attributes than the widget is listening to     
            _(defaults).each(function(def, attr){
                if(_(this.listen).contains(attr) && $.isFunction(search[attr])){
                    args.push(search[attr].call(search));
                }
                else {
                    args.push(def);
                }
            }, this);    
        
            this.model.metrics.execute.apply(this.model.metrics, args);
        },
        
        changePeriod: function(){
            var period = [], periodField = this.model.metrics.fields.filterByTypes('period');
            if(periodField.length > 0){
                this.models.search.changePeriod(periodField.at(0), this.models.period);
            }
        },
        
        onRender: function(){
            this.model.ready(function(){
                this.status.show(this.views.status);
                this.search.show(this.views.search);
                this.display.show(this.views.display);
                
                this.changePeriod();
                this.doSearch();
                
                this.show();
                
            }, this);
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