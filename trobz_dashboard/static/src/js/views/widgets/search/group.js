openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var View = Marionette.ItemView,
        _super = View.prototype;

    var SearchGroup = View.extend({
        template: 'TrobzDashboard.widget.search.group'
    });

    dashboard.views('SearchGroup', SearchGroup);

});