openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var DisplayNumeric = dashboard.views('DisplayNumeric'),
        DisplayGraph = dashboard.views('DisplayGraph'),
        DisplayList = dashboard.views('DisplayList')

    var Controller = Marionette.Controller,
        _super = Controller.prototype;

    var WidgetDisplay = Controller.extend({
    
        template: 'TrobzDashboard.widget.display',
    
        views: {
            'numeric': DisplayNumeric,
            'graph': DisplayGraph,
            'list': DisplayList
        },
    
        initialize: function(options){
            this.type = options.type;
            this.search = options.search;
            this.collection = options.collection;
            
            this.view = this.viewFactory();
            
            this.listenTo(this.collection, 'updated', this.render);
        },
        
        render: function(){
            this.view.render();
            return this.view;
        },
        
        viewFactory:function(){
            if(!this.views[this.type]){
                throw new Error('metic type ' + this.type + ' is not yet supported.');
            }
            
            var view = new this.views[this.type]({
                collection: this.collection,
            });
            
            this.el = view.el;
            this.$el = view.$el;
            
            return view;
        }, 
    });

    dashboard.views('WidgetDisplay', WidgetDisplay);

});