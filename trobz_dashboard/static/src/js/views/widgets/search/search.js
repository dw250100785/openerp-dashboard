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
            
            var fields = {
                domain: this.collection.filterByTypes('domain'),
                group: this.collection.filterByTypes('group_by'),
                order: this.collection.filterByTypes('order_by'),
            };
            
            if(fields.domain.length > 0){
                var domain = new Domain({
                    collection: fields.domain,
                    search: this.search
                });
                this.domain.show(domain);
            }
            
            if(this.type != 'numeric' && fields.group.length > 0){
                var group = new Group({
                    collection: fields.group,
                    search: this.search
                });
                this.group.show(group);
            }
            if(this.type == 'graph' && fields.order.length > 0){
                var order = new Order({
                    collection: fields.order,
                    search: this.search
                });
                this.order.show(order);
            }
        }
        
    });

    dashboard.views('WidgetSearch', WidgetSearch);

});