openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){


    var RowView = Backbone.Marionette.ItemView.extend({
        tagName : "tr",
        template : "TrobzDashboard.widget.display.list.body",
        serializeData : function() {
            return {
                row : this.model.toJSON()
            };
        }
    });


    var default_limit = null;

    var Pager = base.views('Pager'),
        Composite = Backbone.Marionette.CompositeView,
        _super = Composite.prototype; 

    var DisplayList = Composite.extend({
        itemView : RowView,

        // specify a jQuery selector to put the itemView instances in to
        itemViewContainer : 'tbody',

        events: {
            'click .sortable': 'orderBy',
            'click .oe_group_header': 'toggleGroup'
        },

        template : "TrobzDashboard.widget.display.list",

        initialize: function(options){
            this.search = options.search;
            this.collection = this.model.results;
            
            var group = this.search.get('group');
            this.group_by = group.length > 0 ? {field: group[0]} : {};
        
            default_limit = !default_limit ? options.limit || 100 : default_limit;
                
            this.listenTo(this.search, 'change:group', this.groupChanged, this);
        },
        
        groupChanged: function(search, group){
            if(group.length > 0){
                var field = group[0]; 
                this.group_by = {
                    field: field 
                };
                    
                default_limit = this.collection.pager.limit;
                this.collection.changeLimit('all');
            }    
            else {
                this.group_by = {};    
                this.collection.changeLimit(default_limit);
            }
            
            console.log('groupChanged', this.group_by);
        },
        
        renderModel: function(){
            if('field' in this.group_by){
                this.group_by.groups = _.uniq(this.collection.pluck(this.group_by.field.get('sql_name')));
                if(_(this.group_by.groups).contains(null)){
                    this.group_by.groups = _(this.group_by.groups).without(null);
                    this.group_by.groups.push('undefined');    
                }
            }
        
            return _super.renderModel.apply(this, arguments);
        },

        render: function(){
            _super.render.apply(this, arguments);
            
            if('field' in this.group_by){
                this.$('tbody.group').each(function(index, group){
                    var $group = $(group),
                        $label = $group.prev().find('.group_label'),
                        $items = $group.find('tr');
                        
                   $label.text($label.text() + ' (' + $items.length + ')');     
                });
            }
            
            this.addPager();
        },
        
        addPager: function(){
            var pager = new Pager({
                collection: this.model.results
            });
            this.pager = new Marionette.Region({ el: '.pager' });
            this.pager.$el = this.$('.pager');
            this.pager.show(pager);
        },
        
        appendHtml: function(collectionView, itemView, index){
            var $el = this.$('tbody'), item = itemView.model;
            
            if('field' in this.group_by){
                var sql_name = this.group_by.field.get('sql_name');
                $el = this.$('tbody.group[group-name="' + (item.get(sql_name) || 'undefined') + '"]');
            } 
            $el.append(itemView.el);
        },

        toggleGroup: function(e){
            e.preventDefault();
            
            var $group = $(e.currentTarget),
                $data = $group.parent().next(),
                $icon = $group.find('.ui-icon');
            
            if($data.hasClass('hidden')){
                $data.removeClass('hidden');
                $icon.attr('class', 'ui-icon ui-icon-triangle-1-s');
            }
            else {
                $data.addClass('hidden');
                $icon.attr('class', 'ui-icon ui-icon-triangle-1-e');
            }
        },
        
        orderBy: function(e){
            e.preventDefault();
            
            var $column = $(e.currentTarget),
                field = this.model.fields.oneBySQLName($column.attr('data-id')),
                type = $column.is('.desc') ? 'DESC' : 'ASC';
            
            if(field){
                this.search.addOrder(field, type);
            }
        },

        serializeData : function() {
            var orders = this.search.get('order'),
                reorder = {};
            _(orders).each(function(order){
                var type = order[1] == 'ASC' ? 'DESC' : (order[1] == 'DESC' ? 'ASC' : '');
                reorder[order[0].get('sql_name')] = (type).toLowerCase();
            });
            
            
            return {
                'groups': 'groups' in this.group_by ? this.group_by.groups : [], 
                'columns': this.model.fields.filterByTypes('output').toArray(),
                'reorder': reorder
            };
        },
        
        remove: function(){
            this.pager.reset();
            return _super.remove.apply(this, arguments);
        }
    }); 

    dashboard.views('DisplayList', DisplayList);
});