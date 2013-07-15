# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields
from textwrap import dedent


class dashboard_board(osv.osv):

    _name = "dashboard.board"
    _description = "Dashboard"

    def extra_fields(self, cr, uid, ids, field_names, arg, context=None):
        result = {}
        
        for board in self.browse(cr, uid, ids, context=context):
            widgets = []
            for widget in board.widget_ids:
                
                sequence = 0
                width = 10 
                for rel in board.widget_rel:
                    if rel.widget_id == widget.id:
                        sequence = rel.sequence
                        width = rel.width
                        
                widgets.append({
                    'id': widget.id,
                    'name': widget.name,
                    'type': widget.type,
                    'method': widget.method,
                    'sequence': sequence,
                    'width': width,
                    'metrics': widget.metrics,
                })
            
            result[board.id] = {
                'widgets': widgets
            }
            
        return result

    _columns = {
        'name': fields.char('Name'),
        
        'widget_ids': fields.many2many('dashboard.widget', 'dashboard_board_to_widget_rel', id1='board_id',id2='widget_id', string='Widgets', ondelete='cascade', required=True),
        
        'widget_rel': fields.one2many('dashboard.board_to_widget_rel', 'board_id', 'widget relation'),
    
        'period_name': fields.selection(
                                        (('day','Day'), ('week','Week'), ('month','Month'), ('quarter','Quarter'), ('semester','Semester'), ('year','Year')), 
                                        'Period Name'
                                        ),
        'period_type':  fields.selection((('rolling','Rolling'), ('calendar','Calendar')), 'Period Type'),
        'period_start_at': fields.date('Period Start', help="override Period Name and Period Type if defined"),
        'period_end_at': fields.date('Period End', help="override Period Name and Period Type if defined"),
    
        # get widget details directly by JSON-RPC (no need to query dashboard.widget on web side)
        'widgets': fields.function(extra_fields, method=True, multi=True, type='serialized', string='Metrics Data', readonly=True),
    }
    
    _defaults = {
        'period_name': 'month',
        'period_type': 'calendar',
        
    }
    

dashboard_board()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

