# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv
from psycopg2 import Error, ProgrammingError


class post_object(osv.osv_memory):
    
    _name = 'post.object.dashboard'
    _description = 'prepare the database'
    _auto = True
    _log_access = True
    
    
    def start(self, cr, uid):
        self.add_postgresql_unaccent_module(cr, uid)
        self.generate_ir_rules_identifier(cr, uid)
        return True
    
    
    def generate_ir_rules_identifier(self, cr, uid):
        """
        populate custom ir.rules field "identifier" with data id if available
        """
        
        # get rules
        cr.execute('SELECT id FROM ir_rule;')
        rules = cr.fetchall()
         
        update = {
            'query': [],
            'params': []
        }
        
        for rule in rules:
            cr.execute("SELECT module, name FROM ir_model_data WHERE model = %s AND res_id = %s", ['ir.rule', rule])
            info = cr.fetchone()
            if len(info) == 2:
                update['query'].append("UPDATE ir_rule SET identifier = %s WHERE id = %s;")  
                update['params'] = update['params'] + [ info[0] + '.' + info[1], rule ]   
         
        # update all rules
        cr.execute("".join(update['query']), update['params'])
        cr.commit()
        
        
    
    def add_postgresql_unaccent_module(self, cr, uid):
        """
        lazy load unaccent extension
        """
        ok = False
        
        try:
            cr.execute('CREATE EXTENSION "unaccent";')
        
        except ProgrammingError as e:
            if e.pgcode == "42710":
                # extension already installed
                ok = True
            else:
                raise e
        
        else:
            ok = True
            
        finally:
            cr.rollback() 
            if not ok:
                raise Exception('Ooops, postgesql unaccent module can not be loaded, check your postgresql version and if this module is installed. To install it on ubuntu, execute: sudo apt-get install postgresql-contrib-9.1')
        
post_object()
