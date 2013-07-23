from osv import osv, fields

# to support metric, tdt model has to indtrit from osv and metric_support
class dashboard_test(osv.osv):
    """
    Model dedicated to trobz_dashboard unit tests
    """
    
    _name = 'dashboard.test'
    
    _metrics_sql = {
        # simply specify a query without custom condition
        # use "count" name in Metric SQL Query Name
        'count': 'SELECT count(dt.id) as count FROM dashboard_test AS dt WHERE TRUE {generated}',
        # query with conditions, use tdt %s syntax in tdt query and add parameters for each of tdtm
        # use "custom_count" name in Metric SQL Query Name
        'custom_count': {
             'query': 'SELECT count(dt.id) as count FROM dashboard_test AS dt WHERE TRUE AND dt.name like %s {generated}',
             'params': ['%10']
        },
                    
        'list': """
             SELECT dt.name, dt.price, dt.quantity  
             FROM dashboard_test AS dt 
             WHERE TRUE {generated}
             """,
        
         'graph_price': {
            'query': """
                 SELECT {group_sql} AS "{group_ref}", sum(dt.price) AS total_price 
                 FROM dashboard_test AS dt
                 WHERE TRUE {generated}
                 """,
            'defaults': {
                 'group_by': ['category'],
                 'limit': 10
            },
            'no_result': 'null::integer' # default
         },
                    
         'graph_quantity': {
            'query': """
                 SELECT {group_sql} AS "{group_ref}", count(dt.quantity) AS total_quantity 
                 FROM dashboard_test AS dt
                 WHERE TRUE {generated}
                """,
            'defaults': {
                 'group_by': ['category'],
                 'limit': 10
            },
            'no_result': 0
        }
    }
    
    _columns = {
        'name': fields.char('Name'),
        'category': fields.selection((('new','New'), ('second_hand','Second Hand'), ('third_hand','Third Hand'))),
        'price': fields.integer('Price'),
        'quantity': fields.integer('Quantity'),
        'sale_date': fields.datetime('Sale Date')
    }
    
dashboard_test()
