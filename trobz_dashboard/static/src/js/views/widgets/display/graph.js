openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var DisplayGraph = View.extend({
    
        template: 'TrobzDashboard.widget.display.graph',
    
        });

    dashboard.views('DisplayGraph', DisplayGraph);
});