# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields
from trobz_dashboard.utils.model import metric_support 


class dashboard_metric(osv.osv, metric_support):

    _name = "dashboard.metric"
    _description = "Widget Metric"

    def extra_fields(self, cr, uid, ids, field_names, arg, context=None):
        result = {}
        
        for metric in self.browse(cr, uid, ids, context=context):
            
            fields = []
            for field in metric.field_ids:
                fields.append({
                    'id': field.id,
                    'name': field.name,
                    'sequence': field.sequence,
                    'reference': field.reference,
                    'sql_name': field.sql_name,
                    'type_names': field.type_names,
                    'field_description': field.field_description,
                    'period': field.period
                })
            
            model_details = { 'id': metric.model.id, 'name': metric.model.name, 'model' : metric.model.model }
            
            result[metric.id] = {
                'fields': fields,
                'model_details': model_details
            }
            
        return result
    
    _columns = {
        'name': fields.char('Name'),
        'type':  fields.selection((('numeric','Numeric'), ('list','List'), ('graph','Graph') ), 'Type of metric retrieved by the query'),
        'query_name': fields.char('SQL Query Name', help="Custom SQL query defined on the model to get metric data.", required=True),
        'method': fields.char('Model Method', help="Custom method to call on the model, do not change it if you use SQL Query Name"),
        'model':fields.many2one('ir.model','Model of the Resource', help='OpenERP model that will implement the method.', required=True),
                
        'widget_id': fields.many2one('dashboard.widget','Widget', ondelete='cascade', required=True),
        'field_ids': fields.many2many('dashboard.field', 'dashboard_metric_to_field_rel', id1='metric_id',id2='field_id', string='Fields', ondelete='cascade', required=True),
        
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
        'model_details': fields.function(extra_fields, method=True, multi=True, type='serialized', string='Model Details', readonly=True),
        
        # get field details directly by JSON-RPC (no need to query dashboard.field on web side)
        'fields': fields.function(extra_fields, method=True, multi=True, type='serialized', string='Fields Data', readonly=True),
    }
    
    _defaults = {
        'method': 'exec_metric',
        'options': {},
        'values': {},
    }
    
dashboard_metric()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

