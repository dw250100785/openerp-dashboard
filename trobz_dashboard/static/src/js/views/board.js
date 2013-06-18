openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var BaseView = base.views('BaseView'),
        _super = BaseView.prototype;

    var Board = BaseView.extend({
        
        className:  '.trobz_board',
        templates: {
            main: 'TrobzDashboard.board'    
        },
        
        events: {
        },
        
        
        bind: function(){
            this.ready.done(this.render);
        },
        
        unbind: function(){
        },
        
        render: function(){
            this.$el.html(
                this.ref.display.render(this.templates.main)
            );
        }
    });

    dashboard.views('Board', Board);

});