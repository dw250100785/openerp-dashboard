openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    
    var Widgets = dashboard.collections('Widgets'),
        Period = dashboard.models('BoardPeriod');
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Board = BaseModel.extend({
        
        model_name: 'dashboard.board',
        
        initialize: function(data, options){
            this.widgets = new Widgets();
            this.period = new Period();
            
            this.on('sync', this.onSync);
        },
        
        onSync: function(){
            if(!this.hasCustomPeriod()){
                this.period.set({
                    name: this.get('period_name'),
                    type: this.get('period_type'),
                });
            }
            else {
                this.period.set({
                    start: this.get('period_start_at'),
                    end: this.get('period_end_at'),
                });
            }   
        },
        
        parse: function(data, options){
            var widgets = [];
            if('widgets' in data){
                widgets = data.widgets;
                delete data.widgets;
            }
            this.widgets.reset(widgets);
            
            data['period_start_at'] = moment(data['period_start_at']);
            data['period_end_at'] = moment(data['period_end_at']);
            
            return data;
        },
        
        hasCustomPeriod: function(){
            var start = this.get('period_start_at'),
                end = this.get('period_end_at');
            return start.isValid() && end.isValid() && start < end;
        }
    });

    dashboard.models('Board', Board);
});