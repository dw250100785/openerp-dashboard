openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Renderer = Marionette.Renderer,
        View = Marionette.ItemView,
        _super = View.prototype;

    var SearchDomain = View.extend({
    
        template: 'TrobzDashboard.search.domain.view',
    
        templates: {
            'form': 'TrobzDashboard.search.domain.form',
            'char': 'TrobzDashboard.search.domain.char',
            'selection': 'TrobzDashboard.search.domain.selection',
            'number': 'TrobzDashboard.search.domain.number',
            'date': 'TrobzDashboard.search.domain.date',
            'datetime': 'TrobzDashboard.search.domain.datetime',
        },
    
        events: {
            'click .search_action': 'renderForm',
            'click .add': 'addDomain',
            'click .remove': 'removeDomain',
            'click .cancel': 'render',
            'change .field': 'renderFieldForm',
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
            
                this.renderCondition(this.collection.at(0));
            }
        },
        
        renderFieldForm: function(e){
            var $select = $(e.currentTarget);
            this.renderCondition(this.collection.get($select.val()));
        },
        
        renderCondition: function(field){
            var $condition = this.$el.find('.condition'),
                description = field.get('field_description'),
                condition = Renderer.render(this.templates[description.type], {
                description: description,
                operators: this.search.operators
            });
            $condition.empty();
            $condition.html(condition);
        },
        
        addDomain: function(e){
            e.preventDefault();
            
            var field = this.collection.get(this.$el.find('.field').val()),
                operator = this.$el.find('.operator').val() || 'e',
                value = this.$el.find('.value').val();
                    
            this.search.addDomain(field, operator, value);
            
            this.render();
        },
        
        removeDomain: function(e){
            e.preventDefault();
            var $remove = $(e.currentTarget),
                $criterion = $remove.parent(),
                field = $criterion.find('span.domain_field').attr('field-id'),
                operator = $criterion.find('span.domain_operator').attr('operator'),
                value = $criterion.find('span.domain_value').attr('value');
            
            field = this.collection.get(field);
            value = $.isNumeric(value) ? parseInt(value) : value;   
                
            this.search.removeDomain(field, operator, value);
            
            this.render();
        },
        
        serializeData: function(){
            
            var domain = this.search.get('domain');
            
            var groups = _(domain).groupBy(function(criterion){ 
                return criterion.field.get('reference'); 
            });
            
            return {
              "operators": this.search.operators,
              "group_size": _(groups).size(),
              "groups": groups,
              "has_domain": domain.length > 0,
              "has_condition": this.collection.length > 0
            }
        }
        
        
    });

    dashboard.views('SearchDomain', SearchDomain);
});