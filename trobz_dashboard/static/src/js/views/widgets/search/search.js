openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Domain = dashboard.views('SearchDomain'),
        Order = dashboard.views('SearchOrder'),
        Group = dashboard.views('SearchGroup');
    
    var Layout = Marionette.Layout,
        _super = Layout.prototype;

    var WidgetSearch = Layout.extend({
        template: 'TrobzDashboard.widget.search',
    
        regions: {
            domain: '.domain',
            order: '.order',
            group: '.group'
        },
        
        initialize: function(options){
            this.type = options.type;
            this.search = options.search;
        },
        
        onRender: function(){
            
            var domain = new Domain({
                collection: this.collection.filterByTypes('domain'),
                search: this.search
            });
            this.domain.show(domain);
            
            if(this.type != 'numeric'){
                var group = new Group({
                    collection: this.collection.filterByTypes('group'),
                    search: this.search
                });
                this.group.show(group);
            }
            if(this.type == 'graph'){
                var order = new Order({
                    collection: this.collection.filterByTypes('order'),
                    search: this.search
                });
                this.order.show(order);
            }
        }
        
    });

    dashboard.views('WidgetSearch', WidgetSearch);

});