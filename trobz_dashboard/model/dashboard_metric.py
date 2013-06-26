# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields


class dashboard_metric(osv.osv):

    _name = "dashboard.metric"
    _description = "Widget Metric"

    def model_details(self, cr, uid, ids, field_name, arg, context=None):
        result = {}
        
        for metric in self.browse(cr, uid, ids, context=context):
            result[metric.id] = { 'id': metric.model.id, 'name': metric.model.name, 'model' : metric.model.model }
            
        return result
    
 

    _columns = {
        'name': fields.char('Name'),
        'type':  fields.selection((('number','Single number'), ('list','List'), ('bar','Bar Chart'), ('line','Line Chart'), ('pie','Pie Chart'), ), 'Type of metric retrieved by the query'),
        'query_name': fields.char('SQL Query Name', help="Custom SQL query defined on the model to get metric data.", required=True),
        'method': fields.char('Model Method', help="Custom method to call on the model, do not change it if you use SQL Query Name"),
        'model':fields.many2one('ir.model','Model of the Resource', help='OpenERP model that will implement the method.', required=True),
                
        'widget_id': fields.many2one('dashboard.widget','Widget', ondelete='cascade', required=True),
        'field_ids': fields.one2many('dashboard.field', 'metric_id', 'Fields', ondelete='cascade', required=True),
        
        'options': fields.serialized('Options', help="""
Options are defined according to the metric type:

Number:
- format (use numerical.js): "0"
- thresholders: { ">10": "red", "<10": "green"}
List:
- page limit: 80 
Pie / Line / Bar Chart:
- all options available in Flotr2
        """),
        'values': fields.serialized('Values', help="Current metric state"),
     
        # get the model details directly by JSON-RPC
        'model_details': fields.function(model_details, method=True, type='serialized', string='Model Details', readonly=True),
        
    }
    
    _defaults = {
        'method': 'exec_metric',
        'options': {},
        'values': {},
    }
    
dashboard_metric()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

