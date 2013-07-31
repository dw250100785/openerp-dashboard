# -*- coding: utf-8 -*-

from osv import osv, fields

from trobz_dashboard.utils.model import metric_support 

# to support metric, the model has to inherit from osv and metric_support
class hr_employee(osv.osv, metric_support):
   
    _inherit = 'hr.employee'
    
    _metrics_sql = {
        # simply specify a query without custom condition
        # use "count" name in Metric SQL Query Name
        'count': 'SELECT count(id) as count FROM hr_employee WHERE TRUE {generated}',
        # query with conditions, use the %s syntax in the query and add parameters for each of them
        # use "custom_count" name in Metric SQL Query Name
        'custom_count': {
             'query': 'SELECT count(id) as count FROM hr_employee WHERE TRUE AND name_related like %s {generated}',
             'params': ['J%']
        },
                    
        'list': """
             SELECT he.name_related, he.work_email, he.birthday, he.parent_id as manager, rc.name as "country"  
             FROM hr_employee AS he 
             LEFT JOIN res_country rc ON rc.id = he.country_id 
             WHERE TRUE {generated}
             """,
        
         'graph_attendance': {
            'query': """
                 SELECT {group_sql} AS "{group_ref}", count(ha.id) AS count 
                 FROM hr_employee AS he
                 INNER JOIN hr_attendance ha ON ha.employee_id = he.id
                 LEFT JOIN res_country rc ON rc.id = he.country_id 
                 WHERE TRUE {generated}
                 """,
            'defaults': {
                 'group_by': ['name_related'],
                 'limit': 10
            }
         },
                    
         'graph_booking': {
            'query': """
                SELECT {group_sql} AS "{group_ref}", count(br.id) AS booking_count 
                FROM hr_employee AS he
                LEFT JOIN booking_resource br ON he.id =  br.origin_id
                LEFT JOIN ir_model ir ON ir.id =  br.origin_model
                LEFT JOIN res_country rc ON rc.id = he.country_id 
                WHERE ir.model = %s
                {generated}
                """,
            'params': ['hr.employee'],
            'defaults': {
                 'group_by': ['name_related'],
                 'limit': 10
            }
        }
    }
    
    _columns = {
        'write_date': fields.datetime('Date Modified', readonly=True),
    }
    
hr_employee()
