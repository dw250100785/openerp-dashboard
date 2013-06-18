# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields

class dashboard_field(osv.osv):

    _name = "dashboard.field"
    _description = "Metric Field"

    _columns = {
        'metric_id': fields.many2one('dashboard.metric','Metric', ondelete='cascade', required=True),
        'name': fields.char('Name', required=True),
        'reference': fields.char('Reference', help="used to recognize fields with the same type of data", required=True),
        'sql_name': fields.char('SQL Name', help="name use in a SQL query, depend on the metric method", required=True),
        'field_name': fields.char('Field Name', help="field name in the model"),
        'model': fields.many2one('ir.model','Field Model', help='OpenERP model of the field.'),
        'type_ids': fields.many2many('dashboard.field.type',id1='metric_field_id',id2='metric_field_type_id', string='Types', help='Defined the propose of the field: output, filter, group_by, order_by'),
    }

dashboard_field()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

