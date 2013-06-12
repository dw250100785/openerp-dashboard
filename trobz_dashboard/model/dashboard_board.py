# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields
from textwrap import dedent

import logging
_logger = logging.getLogger('ZAZADEV')

class dashboard_board(osv.osv):

    def create(self, cr, uid, vals, context=None):
        _logger.info('Create a %s with vals %s', self._name, vals)
        return super(dashboard_board, self).create(cr, uid, vals, context=context)
                                                     
    def dashboard_board(self, cr, uid, ids, context=None):

        assert len(ids) == 1
        this = self.browse(cr, uid, ids[0], context=context)

        _logger.info('create action for %s', this.name)
        
        view_arch = dedent("""<?xml version="1.0"?>
            <form string="%s" version="7.0">
            <trobz_dashboard style="2-1">
                <column/>
                <column/>
            </trobz_dashboard>
            </form>
        """.strip() % (this.name,))

        view_id = self.pool.get('ir.ui.view').create(cr, uid, {
            'name': this.name,
            'model': 'bashboard.board',
            'priority': 16,
            'type': 'form',
            'arch': view_arch,
        }, context=context)

        action_id = self.pool.get('ir.actions.act_window').create(cr, uid, {
            'name': this.name,
            'view_type': 'form',
            'view_mode': 'form',
            'res_model': 'bashboard.board',
            'usage': 'menu',
            'view_id': view_id,
            'help': dedent('''<div class="oe_empty_custom_dashboard">
              <p>
                <b>This dashboard is empty.</b>
              </p>
          </div>
            ''')
        }, context=context)

        menu_id = self.pool.get('ir.ui.menu').create(cr, uid, {
            'name': this.name,
            'parent_id': this.menu_parent_id.id,
            'action': 'ir.actions.act_window,%s' % (action_id,)
        }, context=context)

        self.pool.get('dashboard.board')._clear_list_cache()

        return {
            'type': 'ir.actions.client',
            'tag': 'reload',
            'params': {
                'menu_id': menu_id
            },
        }

    def _default_menu_parent_id(self, cr, uid, context=None):
        _, menu_id = self.pool.get('ir.model.data').get_object_reference(cr, uid, 'trobz_dashboard', 'menu_dashboard_board')
        return menu_id

    
    _name = "dashboard.board"
    _description = "Dashboard"

    _columns = {
        'name': fields.char('Name'),
        'widgets': fields.one2many('dashboard.widget','board_id', 'Widgets', ondelete='cascade', required=True),
        'menu_parent_id': fields.many2one('ir.ui.menu', 'Parent Menu', required=True),
    }
    
    _defaults = {
        'menu_parent_id': _default_menu_parent_id,
    }
    

dashboard_board()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

