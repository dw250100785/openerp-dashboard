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
        
        
        query = self._metrics_sql[sql_name]
        defaults = {}
        params = []
        
        if isinstance(query, dict):
            params = query['params'] if 'params' in query else [] 
            defaults = query['defaults'] if 'defaults' in query else {}
            query = query['query'] if 'query' in query else ''
        
            
        group_by, order_by, limit, offset = self.defaults_metric_params(defaults, group_by, order_by, limit, offset)
        self.validate_metric_params(group_by, order_by, limit, offset)
            
        e = expression(domain)
        domain_query, domain_params = e.to_sql()
        
        query = query.format(** {'generated': domain_query, 'group': ','.join(group_by)})
        
        query = '%s GROUP BY %s' % (query, ','.join(group_by)) if len(group_by) > 0 else query
        query = '%s ORDER BY %s' % (query, ','.join(order_by)) if len(order_by) > 0 else query
        query = '%s LIMIT %s' % (query, limit) if limit is not None else query
        query = '%s OFFSET %s' % (query, offset) if offset is not None else query
        
        params = params + domain_params
        
        _logger.info("query: %s, params: %s", query, params)
        
        cr.execute(query, params)
        
        return { 'columns': cr.description, 'results': cr.dictfetchall()}
    
    
    def defaults_metric_params(self, defaults, group_by, order_by, limit, offset):
        """
        set default parameters if necessary
        TODO: should find a better way, with inspect module maybe...
        """
        group_by = defaults['group_by'] if 'group_by' in defaults and len(group_by) == 0 else group_by
        order_by = defaults['order_by'] if 'order_by' in defaults and len(order_by) == 0 else order_by
        limit = defaults['limit'] if 'limit' in defaults and limit == "ALL" else limit
        offset = defaults['offset'] if 'offset' in defaults and offset == 0 else offset
        
        # order by group if no order by default
        if len(order_by) == 0 and len(group_by) != 0:
            for field in group_by:
                order_by.append(field + ' ASC')
        
        return group_by, order_by, limit, offset;
    
    def validate_metric_params(self, group_by, order_by, limit, offset):
        """
        validate fields and prevent SQL Injection...
        """
        
        pattern = re.compile("^[\w\.'\"]*$")
        for group in group_by:
            if pattern.match(group) is None:
                raise Exception('group "%s" is not valid' % (group, ))
            
        pattern = re.compile("^[\w\.'\"]* [ASC|DESC]*$")
        for order in order_by:
            if pattern.match(order) is None:
                raise Exception('order "%s" is not valid' % (order, ))
        
        if not (isinstance(limit, int) or limit == "ALL"):
            raise Exception('limit is not an integer or is not "ALL"')
        
        if not isinstance(offset, int):
            raise Exception('offset is not an integer')
        
        return True
    
metric_support = metrics