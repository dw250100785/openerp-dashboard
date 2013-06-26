openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var View = Marionette.ItemView,
        _super = View.prototype;

    var SearchOrder = View.extend({
        template: 'TrobzDashboard.widget.search.order'
    });

    dashboard.views('SearchOrder', SearchOrder);

});