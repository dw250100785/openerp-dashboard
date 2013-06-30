openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var SearchOrder = View.extend({
        className: 'search_part',
        
        template: 'TrobzDashboard.widget.search.order',
        
        
        templates: {
            'form': 'TrobzDashboard.search.order.form',
        },
        
          events: {
            'click .search_action': 'renderForm',
            'click .add': 'addOrder',
            'click .remove': 'removeOrder',
            'click .cancel': 'render',
        },
        
        initialize: function(options){
            this.search = options.search;
        },
        
        renderForm: function(e){
            e.preventDefault();
            if(this.collection.length > 0){
                var fields = Renderer.render(this.templates.form, {
                    fields: this.collection.toArray()
                });
                
                this.$el.empty();
                this.$el.html(fields);    
            }
        },
        
        addOrder: function(e){
            e.preventDefault();
            
            var field = this.collection.get(this.$el.find('.field').val()),
                type = this.$el.find('.type').val();
                    
            this.search.addOrder(field, type);
            
            this.render();
        },
        
        removeOrder: function(e){
            e.preventDefault();
            var $remove = $(e.currentTarget),
                $criterion = $remove.parent(),
                field = $criterion.find('span.search_field').attr('field-id'),
                type = $criterion.find('span.search_value').attr('value');
            
            field = this.collection.get(field);
            
            this.search.removeOrder(field, type);
            
            this.render();
        },
        
        serializeData: function(){
            var orders = this.search.get('order');
            
            return {
              "orders": orders,
              "has_order": orders.length > 0
            }
        }
    });

    dashboard.views('SearchOrder', SearchOrder);

});