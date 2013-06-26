openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){
 
    var ItemView = Marionette.ItemView,
        _super = ItemView.prototype;

    var ToolBar = ItemView.extend({
        
        template: 'TrobzDashboard.toolbar',
        
        ui: { 
            type: '.period_type span',
            name: '.period_name select',
            daterange: '.daterange',
            mode: '.mode'
        }, 
        
        events: {
            'click .period_type span': 'changeType',
            'change .period_name select': 'changeName',
            'shown .daterange': 'openRangePicker',
        
            'click .board_action .fullscreen': 'switchFullscreen',
            'click .board_action .sliding': 'slidingMode',
            'click .board_action .list': 'listMode',
        },
        
        modelEvents: {
            'change': 'refresh'
        },
        
        initialize: function(options){
            this.options = _.defaults(options, {
                dateformat: 'dddd, Do MMMM, YYYY' 
            });
            
            this.fullscreen = false;
        },
        
        changeType: function(e){
            e.preventDefault();
            var $type = $(e.currentTarget);
            this.model.set('type', $type.attr('data-type'));
        },
        
        changeName: function(e){
            e.preventDefault();
            var $name = $(e.currentTarget);
            this.model.set('name', $name.find('option:selected').val());
        },
        
        openRangePicker: function(e){
            this.ui.daterangepicker.updateView();
            this.ui.daterangepicker.updateCalendars();
        },
        
        switchFullscreen: function(e){
            e.preventDefault();
            var $icon = $(e.currentTarget).find('i');
        
            this.fullscreen = !this.fullscreen;
            this.trigger('fullscreen', this.fullscreen);        
            $icon.attr('class', this.fullscreen ? 'icon-resize-small' : 'icon-resize-full');
        },
        
        slidingMode: function(e){
            e.preventDefault();
            this.trigger('mode', 'sliding');        
            var html = Marionette.Renderer.render('TrobzDashboard.toolbar.sliding');
            this.ui.mode.empty().html(html);
        },
        
        listMode: function(e){
            e.preventDefault();
            this.trigger('mode', 'list');        
            var html = Marionette.Renderer.render('TrobzDashboard.toolbar.list');
            this.ui.mode.empty().html(html);
        },
        
        render: function(){
            _super.render.apply(this, arguments);
            
            var period = this.model;
            
            this.ui.daterange.daterangepicker(
                {
                    //FIXME: made to have the datepicker inside the element in fullscreen mode... the lib has been customized to support it... 
                    appendToElement: '#trobz_board',
                    startDate: this.model.start(),
                    endDate: this.model.end()
                },
                function(start, end){
                    if(start && end){
                        period.set({
                            start: start,
                            end: end
                        });    
                    }
                }
            );
            this.ui.daterangepicker = this.ui.daterange.data('daterangepicker');
                
            this.refresh();
        },
        
        refresh: function(){
            this.ui.type.removeClass('selected');
            this.ui.type.filter('.' + this.model.get('type')).addClass('selected');
            
            this.ui.name.find('option:selected').attr('selected', false);
            this.ui.name.find('option[value="' + this.model.get('name') + '"]').attr('selected', true);
            
            this.ui.daterange.text(this.model.start().format(this.options.dateformat) + ' - ' + this.model.end().format(this.options.dateformat));
            this.ui.daterangepicker.startDate = this.model.start();
            this.ui.daterangepicker.endDate = this.model.end();
        },
        
        serializeData: function(){
            return {
              "name": this.model.get('name'),
              "type": this.model.get('type'),
              "start": this.model.start().format('LL'),
              "end": this.model.end().format('LL'),
            }
        }
    });

    dashboard.views('ToolBar', ToolBar);

});