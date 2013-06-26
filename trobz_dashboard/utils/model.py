#!/usr/bin/env python
# -*- coding: utf-8 -*-

from domain_converter import expression  
import re
 
import logging
_logger = logging.getLogger('ZAZADEV')

 
class metrics():
    
    _metrics_sql = {
    }
    
    def exec_metric(self, cr, uid, ids, sql_name, domain, group_by=[], order_by=[], limit="ALL", offset=0, context=None):
        """
        Execute a SQL query, used to process a metric object
        """
        
        if not sql_name in self._metrics_sql:
            raise Exception('"%s" is not defined in _metrics_sql' % (sql_name,))
        
        params = []
        query = self._metrics_sql[sql_name]
        
        if isinstance(query, dict):
            params = query['params']
            query = query['query'] 
         
        self.validate_metric_params(group_by, order_by, limit, offset)
            
        e = expression(domain)
        domain_query, domain_params = e.to_sql()
        
        
        _logger.info("query before: %s", query)
        
        query = query.format(** {'generated': domain_query })
        
        _logger.info("query after: %s", query)
        
        query = '%s GROUP BY %s' % (query, ','.join(group_by)) if len(group_by) > 0 else query
        query = '%s ORDER BY %s' % (query, ','.join(order_by)) if len(order_by) > 0 else query
        query = '%s LIMIT %s' % (query, limit) if limit is not None else query
        query = '%s OFFSET %s' % (query, offset) if offset is not None else query
        
        params = params + domain_params
        
        
        _logger.info("query: %s, params: %s", query, params)
        
        cr.execute(query, params)
        
        return cr.dictfetchall()
    
    def validate_metric_params(self, group_by, order_by, limit, offset):
        """
        validate fields and prevent SQL Injection...
        """
        
        _logger.info('validate: %s, %s, %s, %s', group_by, order_by, limit, offset)
        
        pattern = re.compile("^[\w\.'\"]*$")
        for group in group_by:
            if pattern.match(group) is None:
                raise Exception('group "%s" is not valid' % (group, ))
            
        pattern = re.compile("[^[\w\.'\"]* [ASC|DESC]*$")
        for order in order_by:
            if pattern.match(order) is None:
                raise Exception('order "%s" is not valid' % (order, ))
        
        if not (isinstance(limit, int) or limit == "ALL"):
            raise Exception('limit is not an integer or is not "ALL"')
        
        if not isinstance(offset, int):
            raise Exception('offset is not an integer')
        
        return True
    
metric_support = metrics