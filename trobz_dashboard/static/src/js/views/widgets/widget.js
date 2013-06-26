openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var SearchModel = dashboard.models('Search');

    var SearchView = dashboard.views('WidgetSearch'),
        Status = dashboard.views('WidgetStatus'),
        Display = dashboard.views('WidgetDisplay');

    var Layout = Marionette.Layout,
        _super = Layout.prototype;

    var Widget = Layout.extend({
        template: 'TrobzDashboard.widget',
        
        events: {
            'click .toggle_search': 'toggleSearch'
        },
        
        regions: {
            search: '.search',
            display: '.display',
            status: '.status'
        },
        
        initialize: function(options){
            
            this.model.ready(function(){
                
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
                        type: this.model.get('type')
                    
                    })
                };
                
                this.listenTo(this.models.period, 'change', this.changePeriod); 
                this.listenTo(this.models.search, 'change', this.doSearch); 
            }, this);
        },
        
        doSearch: function(){
            var search = this.models.search;
            this.model.metrics.execute([], search.domain(), search.order(), search.group());
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
                this.doSearch();
            }, this);
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