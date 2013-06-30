openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var SearchGroup = View.extend({
        
        className: 'search_part',
    
        template: 'TrobzDashboard.widget.search.group',
        
        templates: {
            'form': 'TrobzDashboard.search.group.form',
        },
        
          events: {
            'click .search_action': 'renderForm',
            'click .add': 'addGroup',
            'click .remove': 'removeGroup',
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
        
        addGroup: function(e){
            e.preventDefault();
            
            var field = this.collection.get(this.$el.find('.field').val());
                    
            this.search.addGroup(field);
            
            this.render();
        },
        
        removeGroup: function(e){
            e.preventDefault();
            var $remove = $(e.currentTarget),
                $criterion = $remove.parent(),
                field = $criterion.find('span.search_field').attr('field-id');
            
            field = this.collection.get(field);
            
            this.search.removeGroup(field);
            
            this.render();
        },
        
        serializeData: function(){
            var groups = this.search.get('group');
            
            return {
              "groups": groups,
              "has_group": groups.length > 0
            }
        }
        
    });

    dashboard.views('SearchGroup', SearchGroup);

});