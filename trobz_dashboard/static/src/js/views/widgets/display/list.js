openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Renderer = Marionette.Renderer,
        View = Marionette.CompositeView,
        _super = View.prototype;


    var RowView = Backbone.Marionette.ItemView.extend({
        tagName : "tr",
        template : "TrobzDashboard.widget.display.list.body",
        serializeData : function() {
            return {
                row : this.model.toJSON()
            };
        }
    });

    var DisplayList = Backbone.Marionette.CompositeView.extend({
        itemView : RowView,

        // specify a jQuery selector to put the itemView instances in to
        itemViewContainer : "tbody",

        template : "TrobzDashboard.widget.display.list",

        serializeData : function() {
            return {
                columns : this.collection.columns
            };
        }
    }); 

    dashboard.views('DisplayList', DisplayList);
});