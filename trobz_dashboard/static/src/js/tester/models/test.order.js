openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){
    
    var TestBaseFields = dashboard.models('TestBaseFields'),
        _super = TestBaseFields.prototype;
    
    var CODES = _super.codes;
    
    var TestOrders = TestBaseFields.extend({
         
        label: 'test metric fields: order', 
        
        execute: function(field){
            var params = {
                order: [ field.get('reference') + ' ASC' ],
                period: {
                    start: '2010-01-01 00:00:00',
                    end: '2010-01-02 00:00:00',
                },
                debug: true
            };
            
            if(this.model.get('type') == 'graph'){
                params.group = [ field.get('reference') ];
            }
            
            return this.model.execute(params);
        }
    });      

    dashboard.models('TestOrders', TestOrders);

});