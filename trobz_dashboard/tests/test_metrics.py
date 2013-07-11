from tests.common import TransactionCase

class TestMetrics(TransactionCase):
    
    def setUp(self):
        super(TestMetrics, self).setUp()
        self.metric_model = self.registry('dashboard.metric')
        
    def get_metric(self, metric_name):
        cr, uid = self.cr, self.uid
        
        metric_ids = self.metric_model.search(cr, uid, [('widget_id.name', '=', 'UnitTestWidget'), ('name', '=', metric_name)])
        
        if len(metric_ids) <= 0:
            raise Exception('can not find metric with name: %s, check if you have correctly initialized the database with demo_dashboard module' % (metric_name,))
     
        return self.metric_model.browse(cr, uid, metric_ids)[0]
    
    def get_metric_ids(self, metric_names):
        cr, uid = self.cr, self.uid
        
        domain = [('widget_id.name', '=', 'UnitTestWidget')]
        
        count = 0
        for name in metric_names:
            count += 1
            if count == 2:
                domain.insert(len(domain) - 3, '|')
                count = 0
            domain.append(('name', '=', name))
    
        metric_ids = self.metric_model.search(cr, uid, domain)
        
        if len(metric_ids) <= 0:
            raise Exception('can not find metric with names: %s, check if you have correctly initialized the database with demo_dashboard module' % (metric_names,))
     
        return metric_ids
    
    
        
    def test_count(self):
        """
        Test graph metric with one metric and an alpha-numerical x-axis
        """
        
        count = self.get_metric('Count')
        custom_count = self.get_metric('CustomCount')
        
        result = count.exec_metric()
        self.assertEquals(result[count.id]['results'][0]['count'], 30)
      
        result = custom_count.exec_metric()
        self.assertEquals(result[custom_count.id]['results'][0]['count'], 1)
        
        result = count.exec_metric(domain=[['category', '=', 'new']])
        self.assertEquals(result[count.id]['results'][0]['count'], 5)

        period = {
            'start': u'2010-01-01',
            'end':   u'2010-03-01',
        }

        result = count.exec_metric(period=period, domain=[['category', '=', 'new']])
        self.assertEquals(result[count.id]['results'][0]['count'], 2)
        
        cr, uid = self.cr, self.uid
        count_ids = self.get_metric_ids(['Count', 'CustomCount'])
        result = self.metric_model.exec_metric(cr, uid, count_ids)
        self.assertEquals(result[count.id]['results'][0]['count'], 30)
        self.assertEquals(result[custom_count.id]['results'][0]['count'], 1)
        


    def test_single_alphanumeric(self):
        """
        Test graph metric with one metric and an alpha-numerical x-axis
        """
        graph_price = self.get_metric('GraphPrice')
        
        result = graph_price.exec_metric()
        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'new', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'second_hand', 'total_price': 300L}) 
        self.assertDictEqual(result[graph_price.id]['results'][2], {'category': u'third_hand', 'total_price': 450L})
        
        result = graph_price.exec_metric(order_by=['category DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'third_hand', 'total_price': 450L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'second_hand', 'total_price': 300L}) 
        self.assertDictEqual(result[graph_price.id]['results'][2], {'category': u'new', 'total_price': 150L})
        
        result = graph_price.exec_metric(domain=[['price', '>', '30']], group_by=['price'], order_by=['price DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 50, 'total_price': 300L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 40, 'total_price': 240L})
        
        result = graph_price.exec_metric(order_by=['category DESC'], limit=2, offset=1)
        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'second_hand', 'total_price': 300L}) 
        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'new', 'total_price': 150L})
        
        period = {
            'start': u'2010-01-01',
            'end':   u'2010-03-01',
        }

        result = graph_price.exec_metric(period=period, order_by=['category DESC'], limit=2, offset=1)
        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'second_hand', 'total_price': 120L}) 
        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'new', 'total_price': 30L})
        
        
    def test_single_date(self):
        """
        Test graph metric with one metric and a date x-axis
        """
        
        
        graph_price = self.get_metric('GraphPrice')
        
        period = {
            'start': u'2010-01-01',
            'end':   u'2010-06-30',
        }
        
        result = graph_price.exec_metric(period=period, group_by=['sale_month'], order_by=['sale_month DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_price': 150L}) 
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-05-01 00:00:00', 'total_price': 150L}) 
        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-04-01 00:00:00', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-03-01 00:00:00', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-02-01 00:00:00', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-01-01 00:00:00', 'total_price': 150L})
        
        result = graph_price.exec_metric(period=period, group_by=['sale_month'], order_by=['sale_month ASC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-01-01 00:00:00', 'total_price': 150L}) 
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 150L}) 
        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-03-01 00:00:00', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-05-01 00:00:00', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-06-01 00:00:00', 'total_price': 150L})
        
        result = graph_price.exec_metric(period=period, domain=[['category', '=', 'second_hand']], group_by=['sale_month'], order_by=['total_price DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-03-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 70L})
        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-01-01 00:00:00', 'total_price': 50L})
        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_price': 50L})
        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-06-01 00:00:00', 'total_price': 30L})
        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-05-01 00:00:00', 'total_price': 10L})
        
        period = {
            'start': u'2009-11-01',
            'end':   u'2010-02-28',
        }
        
        result = graph_price.exec_metric(period=period, domain=[['category', '=', 'second_hand']], group_by=['sale_month'], order_by=['total_price DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-02-01 00:00:00', 'total_price': 70L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-01-01 00:00:00', 'total_price': 50L})
        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2009-11-01 00:00:00', 'total_price': None}) 
        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2009-12-01 00:00:00', 'total_price': None})

        result = graph_price.exec_metric(period=period, domain=[['category', '=', 'second_hand']], group_by=['sale_month'], order_by=['total_price DESC'], limit=2, offset=2)
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2009-11-01 00:00:00', 'total_price': None}) 
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2009-12-01 00:00:00', 'total_price': None})

    
    def test_many_alphanumeric(self):
        """
        Test graph metric with many metrics and alpha-numerical x-axis
        """
        
        cr, uid = self.cr, self.uid
        
        graph_ids = self.get_metric_ids(['GraphPrice', 'GraphQuantity'])
        
        graph_price = self.get_metric('GraphPrice')
        graph_quantity = self.get_metric('GraphQuantity')
        
        
        result = self.metric_model.exec_metric(cr, uid, graph_ids)
        self.assertDictEqual(result[graph_price.id]['results'][0], {'category': u'new', 'total_price': 150L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'category': u'second_hand', 'total_price': 300L})
        self.assertDictEqual(result[graph_price.id]['results'][2], {'category': u'third_hand', 'total_price': 450L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'category': u'new', 'total_quantity': 5L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'category': u'second_hand', 'total_quantity': 10L})
        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'category': u'third_hand', 'total_quantity': 15L})
    
        result = self.metric_model.exec_metric(cr, uid, graph_ids, domain=[['category', '=', 'third_hand']], group_by=['quantity'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'quantity': 1, 'total_price': 210L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'quantity': 5, 'total_price': 240L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'quantity': 1, 'total_quantity': 7L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'quantity': 5, 'total_quantity': 8L})
        
        result = self.metric_model.exec_metric(cr, uid, graph_ids, domain=[['category', '=', 'third_hand']], group_by=['quantity'], order_by=['quantity DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'quantity': 5, 'total_price': 240L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'quantity': 1, 'total_price': 210L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'quantity': 5, 'total_quantity': 8L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'quantity': 1, 'total_quantity': 7L})
        
        result = self.metric_model.exec_metric(cr, uid, graph_ids, group_by=['price'], order_by=['total_price DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 50, 'total_price': 300L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 40, 'total_price': 240L})
        self.assertDictEqual(result[graph_price.id]['results'][2], {'price': 30, 'total_price': 180L})
        self.assertDictEqual(result[graph_price.id]['results'][3], {'price': 20, 'total_price': 120L})
        self.assertDictEqual(result[graph_price.id]['results'][4], {'price': 10, 'total_price': 60L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'price': 50, 'total_quantity': 6L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'price': 40, 'total_quantity': 6L})
        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'price': 30, 'total_quantity': 6L})
        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'price': 20, 'total_quantity': 6L})
        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'price': 10, 'total_quantity': 6L})

        result = self.metric_model.exec_metric(cr, uid, graph_ids, group_by=['price'], order_by=['total_price DESC'], limit=2, offset=2)
        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 30, 'total_price': 180L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 20, 'total_price': 120L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'price': 30, 'total_quantity': 6L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'price': 20, 'total_quantity': 6L})
        
        period = {
            'start': u'2010-01-01',
            'end':   u'2010-03-01',
        }

        result = self.metric_model.exec_metric(cr, uid, graph_ids, period=period, group_by=['price'], order_by=['total_price DESC'], limit=2, offset=2)
        self.assertDictEqual(result[graph_price.id]['results'][0], {'price': 30, 'total_price': 60L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'price': 20, 'total_price': 40L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'price': 30, 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'price': 20, 'total_quantity': 2L})
    
    def test_many_date(self):
        """
        Test graph metric with many metrics and date x-axis
        """
        cr, uid = self.cr, self.uid
        
        graph_ids = self.get_metric_ids(['GraphPrice', 'GraphQuantity'])
        
        graph_price = self.get_metric('GraphPrice')
        graph_quantity = self.get_metric('GraphQuantity')
        
        period = {
            'start': u'2010-01-01',
            'end':   u'2010-06-30',
        }
        
        result = self.metric_model.exec_metric(cr, uid, graph_ids, domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-01-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-03-01 00:00:00', 'total_price': 30L})
        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_price': 60L})
        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-06-01 00:00:00', 'total_price': 120L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-01-01 00:00:00', 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'sale_month': '2010-03-01 00:00:00', 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'sale_month': '2010-04-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][5], {'sale_month': '2010-06-01 00:00:00', 'total_quantity': 3L})
        
        result = self.metric_model.exec_metric(cr, uid, graph_ids, domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'], order_by=['sale_month DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_price': 120L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-04-01 00:00:00', 'total_price': 60L})
        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-03-01 00:00:00', 'total_price': 30L})
        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-01-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'sale_month': '2010-04-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'sale_month': '2010-03-01 00:00:00', 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][5], {'sale_month': '2010-01-01 00:00:00', 'total_quantity': 2L})
        
        result = self.metric_model.exec_metric(cr, uid, graph_ids, domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'], order_by=['total_price DESC'])
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_price': 120L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-01-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_price.id]['results'][2], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_price.id]['results'][3], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
        self.assertDictEqual(result[graph_price.id]['results'][4], {'sale_month': '2010-04-01 00:00:00', 'total_price': 60L})
        self.assertDictEqual(result[graph_price.id]['results'][5], {'sale_month': '2010-03-01 00:00:00', 'total_price': 30L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-06-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-01-01 00:00:00', 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][2], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][3], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
        self.assertDictEqual(result[graph_quantity.id]['results'][4], {'sale_month': '2010-04-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][5], {'sale_month': '2010-03-01 00:00:00', 'total_quantity': 2L})
        
        result = self.metric_model.exec_metric(cr, uid, graph_ids, domain=[['category', '=', 'third_hand']], period=period, group_by=['sale_month'], order_by=['total_price DESC'], limit=2, offset=2)
        self.assertDictEqual(result[graph_price.id]['results'][0], {'sale_month': '2010-05-01 00:00:00', 'total_price': 90L})
        self.assertDictEqual(result[graph_price.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_price': 60L})
        self.assertDictEqual(result[graph_quantity.id]['results'][0], {'sale_month': '2010-05-01 00:00:00', 'total_quantity': 3L})
        self.assertDictEqual(result[graph_quantity.id]['results'][1], {'sale_month': '2010-02-01 00:00:00', 'total_quantity': 2L})
