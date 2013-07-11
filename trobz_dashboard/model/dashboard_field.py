# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields
import re

class dashboard_field(osv.osv):

    _name = "dashboard.field"
    _description = "Metric Field"

    def extra_fields(self, cr, uid, ids, field_names, arg, context=None):
        result = {}
        pattern = re.compile(r"""(?i)^date_trunc\((?:['"])?([a-z]+)(?:['"])?, .*\)""")
        
        for field in self.browse(cr, uid, ids, context=context):
            
            # field "period"
            matches = pattern.match(field.sql_name)
            period = matches.group(1) if matches and matches.lastindex == 1 else ""
            
            # field "type_names"
            types = ()
            for type in field.type_ids:
                types += (type.name,)
  
            # field "field_description"
            try:
                model = self.pool.get(field.field_name.model)
                description = model.fields_get(cr, uid, [field.field_name.name], context=context)
                description[field.field_name.name]['name'] = field.field_name.name
                desc = description[field.field_name.name]
            except: 
                desc = 'not found'
            
            result[field.id] = {
                'period': period,
                'type_names': types,
                'field_description': desc
            }
        
        return result

    
    _columns = {
        'metric_ids': fields.many2many('dashboard.metric','dashboard_metric_to_field_rel', id1='field_id',id2='metric_id', string='Metrics', ondelete='cascade', required=True),
        'name': fields.char('Name', required=True),
        'sequence': fields.integer('Sequence', help="field order, useful for list widgets"),
        'reference': fields.char('Reference', help="used to recognize fields with the same type of data", required=True),
        'sql_name': fields.char('SQL Name', help="name use in a SQL query, depend on the metric method. If the domain has to be used by the ORM, keep this field empty"),
        'field_name': fields.many2one('ir.model.fields','Field Name', help="field name in the model"),
        'type_ids': fields.many2many('dashboard.field.type',id1='metric_field_id',id2='metric_field_type_id', string='Types', help='Defined the propose of the field: output, filter, group_by, order_by'),
        
        # used to access type names in JSON-RPC without an other query 
        'type_names': fields.function(extra_fields, method=True, type='serialized', string='Tag Names', multi=True, readonly=True),
        
        # search form need the description of the field defined
        'field_description': fields.function(extra_fields, method=True, type='serialized', string='Field Description', multi=True, readonly=True),
        
        # get the period from sql_name, if any
        'period': fields.function(extra_fields, method=True, type='char', string='Period', multi=True, readonly=True),
        
    }
        

dashboard_field()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

