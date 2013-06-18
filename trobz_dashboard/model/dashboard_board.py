# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields
from textwrap import dedent

import logging
_logger = logging.getLogger('ZAZADEV')
_logger.info('board')

class dashboard_board(osv.osv):

    def create(self, cr, uid, vals, context=None):
        board_id = super(dashboard_board, self).create(cr, uid, vals, context=context)
        return board_id
#        
#        action_id = self.pool.get('ir.actions.act_window').create(cr, uid, {
#            'name': vals['name'],
#            'view_mode': 'dashboard',
#            'res_model': 'dashboard.board',
#            'res_id': board_id,
#            'target': 'inline'
#        }, context=context)
#       
#        self.pool.get('ir.ui.menu').create(cr, uid, {
#            'name': vals['name'],
#            'parent_id': vals['menu_parent_id'],
#            'action': 'ir.actions.act_window,%s' % (action_id,)
#        }, context=context)
#    
#        return id


    def write(self, cr, uid, ids, vals, context=None):
        
#        action_ids = self.pool.get('ir.actions.act_window').search(cr, uid, [
#            ('view_mode', '=', 'dashboard'),
#            ('res_id', '=', ids[0] ),
#        ])
#       
#        _logger.info('action found: %s', action_ids)
#        
#        actions = self.pool.get('ir.actions.act_window').read(cr, uid, action_ids,  ['name', 'context'], context)
#       
#        _logger.info('action details: %s', actions)
#        
#        menu_action = 'ir.actions.act_window,%s' % (action_ids[0],)
#       
#        
#        _logger.info('menu_action: %s', menu_action)
#        
#        menu_ids = self.pool.get('ir.ui.menu').search(cr, uid, [
#            ('action', '=', menu_action),
#        ])
#       
#        _logger.info('menu_ids: %s', menu_ids)
#        
#        menus = self.pool.get('ir.ui.menu').read(cr, uid, menu_ids,  ['name', 'action'], context)
#       
#        _logger.info('menu details: %s', menus)
#        
        #self.pool.get('ir.actions.act_window').unlink(cr, uid, action_ids)
        #self.pool.get('ir.ui.menu').unlink(cr, uid, menu_ids)
        #_logger.info('action and menu deleted')
        
        return super(dashboard_board, self).write(cr, uid, ids, vals, context=context)
       

    def _default_menu_parent_id(self, cr, uid, context=None):
        _, menu_id = self.pool.get('ir.model.data').get_object_reference(cr, uid, 'trobz_dashboard', 'menu_dashboard_board')
        return menu_id

    
    _name = "dashboard.board"
    _description = "Dashboard"

    _columns = {
        'name': fields.char('Name'),
        
        'widget_ids': fields.many2many('dashboard.widget', 'dashboard_board_to_widget_rel', id1='board_id',id2='widget_id', string='Widgets', ondelete='cascade', required=True),
        
        'period_name': fields.selection(
                                        (('day','Day'), ('week','Week'), ('month','Month'), ('quarter','Quarter'), ('semester','Semester'), ('year','Year')), 
                                        'Period Name'
                                        ),
        'period_type':  fields.selection((('rolling','Rolling'), ('calendar','Calendar')), 'Period Type'),
        'period_start_at': fields.date('Period Start', help="override Period Name and Period Type if defined"),
        'period_end_at': fields.date('Period End', help="override Period Name and Period Type if defined"),
        
        'menu_parent_id': fields.many2one('ir.ui.menu', 'Parent Menu', required=True),
    }
    
    _defaults = {
        'menu_parent_id': _default_menu_parent_id,
        'period_name': 'month',
        'period_type': 'calendar',
        
    }
    

dashboard_board()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

