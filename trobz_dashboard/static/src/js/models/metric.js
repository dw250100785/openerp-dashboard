openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var Results = dashboard.collections('Results');
    
    var Fields = dashboard.collections('Fields');
            
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Metric = BaseModel.extend({
        model_name: 'dashboard.metric',
        
        initialize: function(data, options){
            this.fields = new Fields(data.fields || []);    
            this.results = new Results([], {
                fields: this.fields
            });
            this.listenTo(this.results, 'reset', this.resultChanged);
        },
        
        resultChanged: function(){
            this.collection.trigger('change:results', this);
        }
    
    });

    dashboard.models('Metric', Metric);
});