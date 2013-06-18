# -*- coding: utf-8 -*-
{
    'name': 'Trobz Dashboard',
    'version': '1.0',
    'category': 'Dashboard',
    'description': """
Creates Interactive and customizable Dashboard, with widgets: Metric, List, Graph and Combined Graph 
    """,
    'author': 'trobz',
    'website': 'http://trobz.com',
    'depends': [
        'web',
        'trobz_base'
    ],
    'data': [
        'view/dashboard_board_view.xml',
        'view/dashboard_widget_view.xml',
        'view/dashboard_metric_view.xml',
        'view/dashboard_field_view.xml',
        
        'menu/dashboard_menu.xml',
      
        'data/dashboard_data.xml',
    ],
    
    'demo': [],
    'application': True,
    'sequence': -99,
    'installable': True,
    'active': False,
    'post_objects': [],
    
    'qweb' : [
        'static/src/templates/*.xml',
    ],
    
    'js': [
        'static/src/js/dashboard.js',
    ],
    'css': [
        'static/src/css/dashboard.css',
    ],
    
    'test': [
    ]
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
