# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv, fields

class dashboard_widget_metric(osv.osv):

    _name = "dashboard.widget.metric"
    _description = "Widget Metric"

    _columns = {
        'name': fields.char('Name'),
        'type':  fields.selection((('number','Single number'), ('list','List'), ('bar','Bar Chart'), ('line','Line Chart'), ('pie','Pie Chart'), ), 'Type of metric retrieved by the query'),
        'query': fields.text('SQL Query', help="""
%(where) and %(group_by) parameters will be dynamically replaced.

Field selected by the query are specific for each type of metric:
- List: all selected fields are displayed in the table
- Number: `SELECT field as number...`
- Bar Chart: `SELECT field1 as x_axis, field2 as y_axis...`
- Line Chart: `SELECT field1 as x_axis, field2 as y_axis...`
- Pie Chart: `SELECT field1 as label, field2 as value...`
        """),
                
        'widget_id': fields.many2one('dashboard.widget','Widget', ondelete='cascade', required=True),
        'fields': fields.one2many('dashboard.widget.metric.field', 'metric_id', 'Fields', ondelete='cascade', required=True),
        
        
        # optional attributes, based on the type of widget used
        'x_axis': fields.char('X-axis name'),
        'y_axis': fields.char('Y-axis name'),
        'options': fields.text('Options')
           
    }

dashboard_widget_metric()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

