# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields

class dashboard_widget(osv.osv):

    _name = "dashboard.widget"
    _description = "Widget"


    _columns = {
        'name': fields.char('Name'),
        'type': fields.selection((('numeric','Numeric'), ('list','List'), ('graph','Graph')), 'Widget type'),
    
        'board_rel': fields.one2many('dashboard.board_to_widget_rel', 'widget_id', 'board relation'),
        
        'board_ids': fields.many2many('dashboard.board', 'dashboard_board_to_widget_rel', id1='widget_id',id2='board_id', string='Boards', ondelete='cascade', required=True),
        'metric_ids': fields.one2many('dashboard.metric', 'widget_id','Metrics', ondelete='cascade', required=True),
    }
    



dashboard_widget()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

