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
        'data/dashboard.test-unit_test.csv',
        #Sales Dashboard
        'data/dashboard/sales/dashboard_board_data.xml',
        'data/dashboard/sales/dashboard_widget_data.xml',
        'data/dashboard/sales/board_to_widget_rel_data.xml',
        'data/dashboard/sales/dashboard_metric_data.xml',
        'data/dashboard/sales/dashboard_field_data.xml',
    
        #Menus (must be created last)
        'menu/dashboard.xml',
    
    ],
    
    'demo': [],
    
    'application': True,
    'sequence': -99,
    'installable': True,
    'active': False,
    'post_objects': [],
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
