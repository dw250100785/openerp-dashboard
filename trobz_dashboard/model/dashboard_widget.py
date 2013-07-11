# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields

class dashboard_widget(osv.osv):

    _name = "dashboard.widget"
    _description = "Widget"

    def extra_fields(self, cr, uid, ids, field_names, arg, context=None):
        result = {}
        
        for widget in self.browse(cr, uid, ids, context=context):
            
            metrics = []
            for metric in widget.metric_ids:
                metrics.append({
                    'id': metric.id,
                    'name': metric.name,
                    'type':  metric.type,
                    'query_name': metric.query_name,
                    'method': metric.method,
                    'options': metric.options,
                    'values': metric.values,
                    'defaults': metric.defaults,
                    'model_details': metric.model_details,
                    'fields': metric.fields,
                })
            
            result[widget.id] = {
                'metrics': metrics
            }
            
        return result

    _columns = {
        'name': fields.char('Name'),
        'type': fields.selection((('numeric','Numeric'), ('list','List'), ('graph','Graph')), 'Widget type'),
        
        'board_ids': fields.many2many('dashboard.board', 'dashboard_board_to_widget_rel', id1='widget_id',id2='board_id', string='Boards', ondelete='cascade', required=True),
        'metric_ids': fields.one2many('dashboard.metric', 'widget_id','Metrics', ondelete='cascade', required=True),
        
        # get metric details directly by JSON-RPC (no need to query dashboard.metric on web side)
        'metrics': fields.function(extra_fields, method=True, multi=True, type='serialized', string='Metrics Data', readonly=True),
    }
    



dashboard_widget()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

