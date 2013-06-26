openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var DisplayList = View.extend({
    
        template: 'TrobzDashboard.widget.display.list',
    
        });

    dashboard.views('DisplayList', DisplayList);
});