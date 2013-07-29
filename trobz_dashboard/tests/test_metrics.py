from tests.common import TransactionCase
import re
from osv.expression import expression 

class TestMetrics(TransactionCase):
    
#    def setUp(self):
#        super(TestMetrics, self).setUp()
#        
#        cr, uid = self.cr, self.uid
#        
#        self.metric_model = self.registry('dashboard.metric')
#        self.widget_model = self.registry('dashboard.widget')
#        
#        widget_id = self.widget_model.search(cr, uid, [('name', '=', 'UnitTestWidget')])
#        if not widget_id:
#            raise Exception('can not find widget with name: %s, check if you have correctly initialized the database with demo_dashboard module' % ('UnitTestWidget',))
#        
#        self.widget = self.widget_model.browse(cr, uid, widget_id)[0]

    def test_expression(self):
        cr, uid = self.cr, self.uid
        
        model = self.registry('hr.holidays')
        
        print "Expression:"
        uid = 9
        e = expression(cr, uid, [('notes', 'like', 't'), ('employee_id', '=', 10)], model, {})
        print e.to_sql()

#        
#        
#    def get_metric(self, metric_name):
#        cr, uid = self.cr, self.uid
#        
#        metric_ids = self.metric_model.search(cr, uid, [('widget_id.name', '=', 'UnitTestWidget'), ('name', '=', metric_name)])
#        
#        if len(metric_ids) <= 0:
#            raise Exception('can not find metric with name: %s, check if you have correctly initialized the database with demo_dashboard module' % (metric_name,))
#     
#        return self.metric_model.browse(cr, uid, metric_ids)[0]
#    
#    
#    def get_metric_ids(self, metric_names):
#        cr, uid = self.cr, self.uid
#        
#        domain = [('widget_id.name', '=', 'UnitTestWidget')]
#        
#        count = 0
#        for name in metric_names:
#            count += 1
#            if count == 2:
#                domain.insert(len(domain) - 3, '|')
#                count = 0
#            domain.append(('name', '=', name))
#    
#        metric_ids = self.metric_model.search(cr, uid, domain)
#        
#        if len(metric_ids) <= 0:
#            raise Exception('can not find metric with names: %s, check if you have correctly initialized the database with demo_dashboard module' % (metric_names,))
#     
#        return metric_ids
#    
#    
#        
#    def test_count(self):
#        """
#        Test graph metric with one metric and an alpha-numerical x-axis
#        """
#        
#        count = self.get_metric('Count')
#        custom_count = self.get_metric('CustomCount')
#        
#        result, debug = self.widget.exec_metrics([count])
#        self.assertEquals(result[count.id]['results'][0]['count'], 30)
#      
#        result, debug = self.widget.exec_metrics([custom_count])
#        self.assertEquals(result[custom_count.id]['results'][0]['count'], 1)
#        
#        result, debug = self.widget.exec_metrics([count], domain=[['category', '=', 'new']])
#        self.assertEquals(result[count.id]['results'][0]['count'], 5)
#
#        period = {
#            'start': u'2010-01-01',
#            'end':   u'2010-03-01',
#        }
#
#        result, debug = self.widget.exec_metrics([count], period=period, domain=[['category', '=', 'new']])
#        self.assertEquals(result[count.id]['results'][0]['count'], 2)
#        
#        result, debug = self.widget.exec_metrics([count, custom_count])
#        self.assertEquals(result[count.id]['results'][0]['count'], 30)
#        self.assertEquals(result[custom_count.id]['results'][0]['count'], 1)
#        
#        # test if unaccent is applied with like operator
#        pattern = re.compile(r"""(?i)(unaccent\(.*?\) (not )?(?:like|ilike) unaccent\(.*?\))""")
#
#        result, debug = self.widget.exec_metrics([count], domain=[['category', 'like', 'new']], debug=True)
#        self.assertEquals(result[count.id]['results'][0]['count'], 5)
#        matches = pattern.search(debug[0]['query'])
#        self.assertIsNotNone(matches)
#
#        result, debug = self.widget.exec_metrics([count], domain=['!', ['category', 'ilike', 'new']], debug=True)
#        self.assertEquals(result[count.id]['results'][0]['count'], 25)
#        matches = pattern.search(debug[0]['query'])
#        self.assertIsNotNone(matches)
#
#
#    def test_single_alphanumeric(self):
#        """
#        Test graph metric with one metric and an alpha-numerical x-axis
#        """
#        graph_price = self.get_metric('GraphPrice')
#        
#        result, debug = self.widget.exec_metrics([graph_price])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'new', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'second_hand', 'total_price': 300L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'category': u'third_hand', 'total_price': 450L})
#        
#        result, debug = self.widget.exec_metrics([graph_price],order_by=['category DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'third_hand', 'total_price': 450L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'second_hand', 'total_price': 300L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'category': u'new', 'total_price': 150L})
#        
#        result, debug = self.widget.exec_metrics([graph_price],domain=[['price', '>', '30']], group_by=['price'], order_by=['price DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 50, 'total_price': 300L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 40, 'total_price': 240L})
#        
#        result, debug = self.widget.exec_metrics([graph_price],order_by=['category DESC'], limit=2, offset=1)
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'second_hand', 'total_price': 300L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'new', 'total_price': 150L})
#        
#        period = {
#            'start': u'2010-01-01',
#            'end':   u'2010-03-01',
#        }
#
#        result, debug = self.widget.exec_metrics([graph_price],period=period, order_by=['category DESC'], limit=2, offset=1)
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'second_hand', 'total_price': 120L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'new', 'total_price': 30L})
#        
#        
#    def test_single_date(self):
#        """
#        Test graph metric with one metric and a date x-axis
#        """
#        
#        
#        graph_price = self.get_metric('GraphPrice')
#        
#        period = {
#            'start': u'2010-01-01',
#            'end':   u'2010-06-30',
#        }
#        
#        result, debug = self.widget.exec_metrics([graph_price],period=period, group_by=['sale_month'], order_by=['sale_month DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_price': 150L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-05-01 00:00:00', 'total_price': 150L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-04-01 00:00:00', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-03-01 00:00:00', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-02-01 00:00:00', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-01-01 00:00:00', 'total_price': 150L})
#        
#        result, debug = self.widget.exec_metrics([graph_price],period=period, group_by=['sale_month'], order_by=['sale_month ASC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-01-01 00:00:00', 'total_price': 150L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 150L}) 
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-03-01 00:00:00', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-05-01 00:00:00', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-06-01 00:00:00', 'total_price': 150L})
#        
#        result, debug = self.widget.exec_metrics([graph_price],period=period, domain=[['category', '=', 'second_hand']], group_by=['sale_month'], order_by=['total_price DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-03-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 70L})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-01-01 00:00:00', 'total_price': 50L})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_price': 50L})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-06-01 00:00:00', 'total_price': 30L})
#        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-05-01 00:00:00', 'total_price': 10L})
#        
#        period = {
#            'start': u'2009-11-01',
#            'end':   u'2010-02-28',
#        }
#        
#        result, debug = self.widget.exec_metrics([graph_price],period=period, domain=[['category', '=', 'second_hand']], group_by=['sale_month'], order_by=['total_price DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-02-01 00:00:00', 'total_price': 70L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-01-01 00:00:00', 'total_price': 50L})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2009-11-01 00:00:00', 'total_price': None}) 
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2009-12-01 00:00:00', 'total_price': None})
#
#        result, debug = self.widget.exec_metrics([graph_price],period=period, domain=[['category', '=', 'second_hand']], group_by=['sale_month'], order_by=['total_price DESC'], limit=2, offset=2)
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2009-11-01 00:00:00', 'total_price': None}) 
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2009-12-01 00:00:00', 'total_price': None})
#
#    
#    def test_many_alphanumeric(self):
#        """
#        Test graph metric with many metrics and alpha-numerical x-axis
#        """
#        
#        graph_price = self.get_metric('GraphPrice')
#        graph_quantity = self.get_metric('GraphQuantity')
#        
#        
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'new', 'total_price': 150L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'second_hand', 'total_price': 300L})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'category': u'third_hand', 'total_price': 450L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'category': u'new', 'total_quantity': 5L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'category': u'second_hand', 'total_quantity': 10L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'category': u'third_hand', 'total_quantity': 15L})
#    
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], domain=[['category', '=', 'third_hand']], group_by=['quantity'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'quantity': 1, 'total_price': 210L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'quantity': 5, 'total_price': 240L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'quantity': 1, 'total_quantity': 7L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'quantity': 5, 'total_quantity': 8L})
#        
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], domain=[['category', '=', 'third_hand']], group_by=['quantity'], order_by=['quantity DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'quantity': 5, 'total_price': 240L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'quantity': 1, 'total_price': 210L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'quantity': 5, 'total_quantity': 8L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'quantity': 1, 'total_quantity': 7L})
#        
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], group_by=['price'], order_by=['total_price DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 50, 'total_price': 300L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 40, 'total_price': 240L})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'price': 30, 'total_price': 180L})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'price': 20, 'total_price': 120L})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {'price': 10, 'total_price': 60L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'price': 50, 'total_quantity': 6L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'price': 40, 'total_quantity': 6L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'price': 30, 'total_quantity': 6L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'price': 20, 'total_quantity': 6L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'price': 10, 'total_quantity': 6L})
#
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], group_by=['price'], order_by=['total_price DESC'], limit=2, offset=2)
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 30, 'total_price': 180L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 20, 'total_price': 120L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'price': 30, 'total_quantity': 6L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'price': 20, 'total_quantity': 6L})
#        
#        period = {
#            'start': u'2010-01-01',
#            'end':   u'2010-03-01',
#        }
#
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], period=period, group_by=['price'], order_by=['total_price DESC'], limit=2, offset=2)
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 30, 'total_price': 60L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 20, 'total_price': 40L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'price': 30, 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'price': 20, 'total_quantity': 2L})
#        
#                
#    
#    def test_many_date(self):
#        """
#        Test graph metric with many metrics and date x-axis
#        """
#        graph_price = self.get_metric('GraphPrice')
#        graph_quantity = self.get_metric('GraphQuantity')
#        
#        period = {
#            'start': u'2010-01-01',
#            'end':   u'2010-06-30',
#        }
#        
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-01-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-03-01 00:00:00', 'total_price': 30L})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_price': 60L})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-06-01 00:00:00', 'total_price': 120L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-01-01 00:00:00', 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'sale_month': '2010-03-01 00:00:00', 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][5], {'sale_month': '2010-06-01 00:00:00', 'total_quantity': 3L})
#        
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'], order_by=['sale_month DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_price': 120L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-04-01 00:00:00', 'total_price': 60L})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-03-01 00:00:00', 'total_price': 30L})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
#        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-01-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'sale_month': '2010-04-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'sale_month': '2010-03-01 00:00:00', 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][5], {'sale_month': '2010-01-01 00:00:00', 'total_quantity': 2L})
#        
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'], order_by=['total_price DESC'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_price': 120L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-01-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-04-01 00:00:00', 'total_price': 60L})
#        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-03-01 00:00:00', 'total_price': 30L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-01-01 00:00:00', 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'sale_month': '2010-04-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][5], {'sale_month': '2010-03-01 00:00:00', 'total_quantity': 2L})
#        
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'], order_by=['total_price DESC'], limit=2, offset=2)
#        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
#
#
#        # test no_result option: total_price no_result=NULL / total_quantity no_result=0
#        period = {
#            'start': u'2009-11-01',
#            'end':   u'2010-03-01',
#        }
#
#        result, debug = self.widget.exec_metrics([graph_price, graph_quantity], period=period, group_by=['sale_month'])
#        self.assertDictEqual(result[graph_price.id]['results'][0], {u'total_price': None, u'sale_month': '2009-11-01 00:00:00'})
#        self.assertDictEqual(result[graph_price.id]['results'][1], {u'total_price': None, u'sale_month': '2009-12-01 00:00:00'})
#        self.assertDictEqual(result[graph_price.id]['results'][2], {u'total_price': 150L, u'sale_month': '2010-01-01 00:00:00'})
#        self.assertDictEqual(result[graph_price.id]['results'][3], {u'total_price': 150L, u'sale_month': '2010-02-01 00:00:00'})
#        self.assertDictEqual(result[graph_price.id]['results'][4], {u'total_price': None, u'sale_month': '2010-03-01 00:00:00'})
#        self.assertDictEqual(result[graph_quantity.id]['results'][0], {u'total_quantity': 0L, u'sale_month': '2009-11-01 00:00:00'})
#        self.assertDictEqual(result[graph_quantity.id]['results'][1], {u'total_quantity': 0L, u'sale_month': '2009-12-01 00:00:00'})
#        self.assertDictEqual(result[graph_quantity.id]['results'][2], {u'total_quantity': 5L, u'sale_month': '2010-01-01 00:00:00'})
#        self.assertDictEqual(result[graph_quantity.id]['results'][3], {u'total_quantity': 5L, u'sale_month': '2010-02-01 00:00:00'})
#        self.assertDictEqual(result[graph_quantity.id]['results'][4], {u'total_quantity': 0L, u'sale_month': '2010-03-01 00:00:00'})
#        
