# -*- coding: utf-8 -*-
{
    'name': 'Demo Dashboard',
    'version': '1.0',
    'category': 'Dashboard',
    'description': """
Demo data for Trobz Dashboard module
    """,
    'author': 'trobz',
    'website': 'http://trobz.com',
    'depends': [
        'trobz_dashboard',
        'hr',
        'sale'
    ],
    'data': [
        'data/dashboard.xml',
        'data/widget_number.xml',
        'data/widget_list.xml',
        'data/widget_graph.xml',
    
        'data/dashboard_unit_test_data.xml',
    
        'menu/dashboard.xml',
    
        'data/dashboard.test-unit_test.csv'
    ],
    
    'demo': [],
    
    'application': True,
    'sequence': -99,
    'installable': True,
    'active': False,
    'post_objects': [],
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
