# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields

class dashboard_field(osv.osv):

    _name = "dashboard.field"
    _description = "Metric Field"

    def type_names(self, cr, uid, ids, field_name, arg, context=None):
        result = {}
        
        for field in self.browse(cr, uid, ids, context=context):
            types = ()
            for type in field.type_ids:
                types += (type.name,)
            result[field.id] = types
    
        return result
        
    
    def field_description(self, cr, uid, ids, field_name, arg, context=None):
        result = {}
        
        for field in self.browse(cr, uid, ids, context=context):
            try:
                model = self.pool.get(field.model.model)
                description = model.fields_get(cr, uid, [field.field_name.name], context=context)
                description[field.field_name.name]['name'] = field.field_name.name
                result[field.id] = description[field.field_name.name]
            except: 
                result[field.id] = 'not found'
            
        return result
    
    
    _columns = {
        'metric_id': fields.many2one('dashboard.metric','Metric', ondelete='cascade', required=True),
        'name': fields.char('Name', required=True),
        'sequence': fields.integer('Sequence', help="field order, useful for list widgets"),
        'reference': fields.char('Reference', help="used to recognize fields with the same type of data", required=True),
        'sql_name': fields.char('SQL Name', help="name use in a SQL query, depend on the metric method. If the domain has to be used by the ORM, keep this field empty"),
        'field_name': fields.many2one('ir.model.fields','Field Name', help="field name in the model"),
        'type_ids': fields.many2many('dashboard.field.type',id1='metric_field_id',id2='metric_field_type_id', string='Types', help='Defined the propose of the field: output, filter, group_by, order_by'),
        
        # used to access type names in JSON-RPC without an other query 
        'type_names': fields.function(type_names, method=True, type='serialized', string='Tag Names', readonly=True),
        
        # search form need the description of the field defined
        'field_description': fields.function(field_description, method=True, type='serialized', string='Field Description', readonly=True),
        
    }
        

dashboard_field()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

