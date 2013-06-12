# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields

class dashboard_widget(osv.osv):

    _name = "dashboard.widget"
    _description = "Dashboard Widget"

    _columns = {
        'name': fields.char('Name'),
        'type': fields.selection((('numeric','Numeric'), ('list','List'), ('graph','Graph')), 'Widget type'),
        'board_id': fields.many2one('dashboard.board','Board', ondelete='cascade', required=True),
        'metrics': fields.one2many('dashboard.widget.metric', 'widget_id','Metrics', ondelete='cascade', required=True),
        
        #appearance / position
        'sequence': fields.integer('Sequence', help='Position in the dashboard, higher numbers are placed at the top'),
        'width':  fields.integer('Width', help='Width, max 24 units'),
        'height':  fields.integer('Height', help='Height, max 24 units'),
        'options': fields.text('Options')
        
    }

dashboard_widget()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

