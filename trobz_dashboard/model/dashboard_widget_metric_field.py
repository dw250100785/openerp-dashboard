# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields

class dashboard_widget_metric_field(osv.osv):

    _name = "dashboard.widget.metric.field"
    _description = "Metric Field"

    _columns = {
        'name': fields.char('Name'),
        'field_model': fields.char('Model Name'),
        'field_id': fields.char('Technical Name'),
        'type': fields.selection((('group','Group By'), ('filter','Filter')), 'Type', help='Use the field as a Group or a Filter criteria'),
        'metric_id': fields.many2one('dashboard.widget.metric','Metric', ondelete='cascade', required=True),
        
    }

dashboard_widget_metric_field()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

