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
        # libs
        'static/lib/bootstrap-daterangepicker/daterangepicker.js',
        
        'static/src/js/models/state.js',
        'static/src/js/models/period.js',
        'static/src/js/models/board.js',
        'static/src/js/models/boardRelation.js',
        
        'static/src/js/collections/results.js',
        'static/src/js/collections/pagerResults.js',
        
        
        'static/src/js/models/operator.js',
        'static/src/js/collections/operators.js',
        
        'static/src/js/models/search.js',
        
        'static/src/js/models/field.js',
        'static/src/js/collections/fields.js',
        
        'static/src/js/models/metric.js',
        'static/src/js/collections/metrics.js',
    
        'static/src/js/models/widget.js',
        'static/src/js/collections/widgets.js',
    
        # views
        'static/src/js/views/widgets/search/widgets.js',
        'static/src/js/views/widgets/search/order.js',
        'static/src/js/views/widgets/search/group.js',
        'static/src/js/views/widgets/search/domain.js',
        'static/src/js/views/widgets/search/search.js',
        
        'static/src/js/views/widgets/display/numeric.js',
        'static/src/js/views/widgets/display/list.js',
        'static/src/js/views/widgets/display/graph.js',
        'static/src/js/views/widgets/display/display.js',
        
        'static/src/js/views/widgets/status/status.js',
        
        'static/src/js/views/widgets/widget.js',
        'static/src/js/views/widgets/widgets.js',
        
        'static/src/js/views/toolbar.js',
        'static/src/js/views/panel.js',
    
        'static/src/js/dashboard.js',
    ],
    'css': [
        # libs
        'static/lib/bootstrap-daterangepicker/daterangepicker.css',
        'static/src/css/datepicker_bootstrap.css',
     
        'static/src/css/dashboard.css',
        'static/src/css/toolbar.css',
 
        'static/src/css/widgets.css',
        'static/src/css/widget.css',
        'static/src/css/search.css',
        'static/src/css/display.css',
    ],
    
    'test': [
        'static/src/tests/search.js',
    ]
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
