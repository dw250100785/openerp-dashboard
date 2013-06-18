# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields


class dashboard_metric(osv.osv):

    _name = "dashboard.metric"
    _description = "Widget Metric"

    _columns = {
        'name': fields.char('Name'),
        'type':  fields.selection((('number','Single number'), ('list','List'), ('bar','Bar Chart'), ('line','Line Chart'), ('pie','Pie Chart'), ), 'Type of metric retrieved by the query'),
        'method': fields.text('Model Method', help="Method called on the model to get the metric data", required=True),
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
        'values': fields.serialized('Values', help="Current metric state")
           
    }
    
    _defaults = {
        'options': {},
        'values': {},
    }
    
dashboard_metric()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

