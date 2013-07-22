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
        
        return True
    
    def add_postgresql_unaccent_module(self, cr, uid):
        ok = False
        
        try:
            cr.execute('CREATE EXTENSION "unaccent"')
        
        except ProgrammingError as e:
            if e.pgcode == "42710":
                # extension already installed
                ok = True
            else:
                raise e
        
        else:
            ok = True
            
        finally:
            if not ok:
                raise Exception('Ooops, postgesql unaccent module can not be loaded, check your postgresql version and if this module is installed. To install it on ubuntu, execute: sudo apt-get install postgresql-contrib-9.1')
        
post_object()
