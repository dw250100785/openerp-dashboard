openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone){
    
    var _super = Backbone.Model.prototype;
    
    var State = Backbone.Model.extend({
        
        defaults: {
            action: null,
            menu_id: null,
            model: null,
            view_type: null,
            
            period_name: 'month',
            period_type: 'rolling',
            period_start_at: null,
            period_end_at: null,
        },
        
        link: function(period){
            this.period = period;
        },
        
        bind: function(){
            this.period.on('change', this.periodChanged, this);
        },
        
        unbind: function(){
            this.period.off(null, null, this);
        },
        
        /* processing */
        process: function(){
            return $.when(
                this.configPeriod({
                    period_name: this.get('period_name'),
                    period_type: this.get('period_type'),
                    period_start_at: this.get('period_start_at'),
                    period_end_at: this.get('period_end_at')   
                })
            );
        },
        
        configPeriod: function(state){
            this.period.set({
                name: state.period_name,
                type: state.period_type,
                start: moment(state.period_start_at),
                end: moment(state.period_end_at),
            }, {silent: true});
            
            return $.when();
        },
        
        periodChanged: function(period){
            this.set({
                period_name: period.get('name'),
                period_type: period.get('type'),
                period_start_at: period.calculated() ? null : period.start().format('YYYY-MM-DD'),
                period_end_at: period.calculated() ? null : period.end().format('YYYY-MM-DD')   
            }); 
        },
        
        
        destroy: function(){
            this.unbind();
            _super.destroy.apply(this, arguments);
        }
    });

    dashboard.models('State', State);

});