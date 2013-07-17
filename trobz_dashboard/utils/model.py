#!/usr/bin/env python
# -*- coding: utf-8 -*-

from domain_converter import expression  
import copy
import re
 
import logging
_logger = logging.getLogger('ZAZADEV')

 
class metrics():
    
    
    envelopes = {
        'query_date': """
            select date_trunc('{period}', gdate.gtime) as "{reference}", {output} from 
            (
                {query}
            ) AS result 
            right outer join ( 
                SELECT * FROM generate_series ( '{start}'::timestamp, '{end}', '{period_inc}') as gtime
            ) AS gdate ON result."{reference}" = date_trunc('{period}', gdate.gtime)
            group by date_trunc('{period}', gdate.gtime)
            {order}
            {limit}
            {offset}
            """,
            
        'query_string': """
            select result."{reference}" as {reference}, {output} from 
            (
                {query}
            ) AS result 
            group by result."{group}"
            {order}
            {limit}
            {offset}
            """
        
    }
    
    def execute(self, cr, uid, ids, period={}, domain=[], group_by=[], order_by=[], limit="ALL", offset=0, debug=False, context=None):
        """
        Execute custom SQL queries to populate a trobz dashboard widget
        """
        
        print "ZAZA DEBUG: %s" % debug

        result = {}
        widgets = self.browse(cr, uid, ids, context=context)
        
        for widget in widgets:
            result[widget.id] = self.exec_metrics(cr, uid, ids, widget, period=period, domain=domain, group_by=group_by, order_by=order_by, limit=limit, offset=offset, debug=debug, context=context) 
            
        return result
    
    
    def exec_metrics(self, cr, uid, ids, widget, period={}, domain=[], group_by=[], order_by=[], limit="ALL", offset=0, debug=False, context=None):
        """
        Execute metrics SQL queries
        """
     
        print "ZAZA DEBUG: %s" % debug

        stacks = {}
        is_graph_metrics = self.is_graph_metrics(widget.metric_ids)
        order_tmp = order_by
        
        for metric in widget.metric_ids:
            model = self.pool.get(metric.model.model)
            
            query, params, defaults = self.get_query(model, metric)
        
            if is_graph_metrics:
                order_by = order_tmp
                self.set_stack_globals(metric, defaults, stacks, period, group_by, order_by, limit, offset)
                # in graph mode, order will be applied to the global query 
                order_tmp = order_by
                order_by = []
                #FIXME: should not disable the limit and offset on sub queries but it"s required if the ordering is different on sub queries and main query...
                limit = 'ALL'
                offset = 0
            
            args = self.defaults_arguments(defaults, group_by, order_by, limit, offset)
            fields_domain, fields_args = self.convert_fields(metric, domain, args) 
            fields_domain = self.add_period(period, fields_domain, metric)
            query, domain_params = self.process_query(query, fields_domain, fields_args);
                
            params = params + domain_params
        
            stacks[metric.id] = {
                'query': query,
                'params': params,
                'args':  fields_args,
                'output': self.extract_aggregate_field(metric, query),
                'metric': metric
            }
        
        return self.execute_stacks(cr, widget, stacks, debug=debug, context=context)
        
    
    
    def set_stack_globals(self, metric, defaults, stacks, period, group_by, order_by, limit, offset):
        group = copy.copy(defaults['group_by']) if 'group_by' in defaults and len(group_by) == 0 else copy.copy(group_by)
        order = copy.copy(order_by)
        
        if len(group) <= 0:
            raise Exception('graph metric require a group_by')
            
            
        # apply order by group for graph by default
        if len(order) <= 0:
            order.append(group[0] + ' ASC')
       
        stacks['global'] = {
            'limit': limit,
            'offset': offset,
            'period': period
        } if not 'global' in stacks else stacks['global'] 
        
        try:
            stacks['global']['order'] = self.convert_order(metric, order[0]) if 'order' not in stacks['global'] else stacks['global']['order']
        except:
            pass
        
        try:
            stacks['global']['group'] = self.convert_group(metric, group[0]) if 'group' not in stacks['global']  else stacks['global']['group']
        except:
            pass
        
    def add_period(self, period, fields_domain, metric):
        """
        add a period to the domain if possible
        """
        period_field = self.get_field_by_type(metric, 'period')
        if len(period) == 2 and period_field:
            fields_domain.append([period_field, '>=', period['start']])
            fields_domain.append([period_field, '<', period['end']])
        return fields_domain
        
    def process_query(self, query, domain, arguments):
        """
        create query and parameters for psycopg2 
        """
        
        group = arguments['group'][0] if len(arguments['group']) > 0 else None
        group_sql = group.sql_name if group else ""
        group_ref = group.reference if group else ""
        
        sql_domain, sql_args = self.to_sql(domain, arguments) 
    
        e = expression(sql_domain)
        domain_query, domain_params = e.to_sql()
            
        query = query.format(** {'generated': domain_query, 'group_sql': group_sql, 'group_ref': group_ref})
        
        query = '%s GROUP BY %s' % (query, ','.join(sql_args['group'])) if len(sql_args['group']) > 0 else query
        query = '%s ORDER BY %s' % (query, ','.join(sql_args['order'])) if len(sql_args['order']) > 0 else query
        query = '%s LIMIT %s' % (query, sql_args['limit']) if sql_args['limit'] is not None else query
        query = '%s OFFSET %s' % (query, sql_args['offset']) if sql_args['offset'] is not None else query
        
        return query, domain_params
    
    def execute_stacks(self, cr, widget, stacks, debug=False, context=None):
        result = {}
        is_graph_metrics = self.is_graph_metrics(widget.metric_ids)
        

        # execute one query in UNION for all metrics
        if is_graph_metrics:
            
            global_args = stacks['global']
            order = global_args['order']
            group = global_args['group']
            period = global_args['period']
            limit = global_args['limit']
            offset = global_args['offset']
            del stacks['global']
            
            # rebuild output parameters
            outputs = []
            query_outputs = {}
            queries = []
            params = []
            
            for metric_id, stack in stacks.items():
                output_ref = stack['output'].reference
                outputs.append('max(result."%s") as "%s"' % (output_ref, output_ref))
                query_outputs[metric_id] = 'NULL as "%s"' % (output_ref)
            
            for metric_id, stack in stacks.items():
                queries.append('\n(' + self.replace_outputs(stack['query'], query_outputs, metric_id) + '\n)')
                params += stack['params']
            
            if group and group.period:
                print 'group.field_description: ', group.field_description
            
            if group and group.period and group.field_description['type'] in ['date', 'datetime']:
                
                order_by = ''
                if order:
                    order_by = "ORDER BY date_trunc('%s', gdate.gtime) %s" % (order[0].period, order[1]) if order[0].period else 'ORDER BY max(result."%s") %s NULLS LAST' % (order[0].reference, order[1]) 
                    
                    
                query = self.envelopes['query_date'].format(** {
                  "start": period['start'],
                  "end": period['end'],
                  "reference": group.reference,
                  "period": group.period,
                  "period_inc": "1 %s" % group.period if group.period != 'quarter' else "3 %s" % "month",
                  "output": ', '.join(outputs),
                  "order": order_by,
                  "limit": "LIMIT %s" % (limit), 
                  "offset": "OFFSET %s" % (offset), 
                  "query": '\nUNION ALL\n'.join(queries)
                })
            else:
                
                query = self.envelopes['query_string'].format(** {
                  "reference": group.reference,
                  "output": ', '.join(outputs),
                  "query": '\nUNION ALL\n'.join(queries),
                  "group": group.reference,
                  "limit": "LIMIT %s" % (limit), 
                  "offset": "OFFSET %s" % (offset), 
                  "order": 'ORDER BY max(result."%s") %s NULLS LAST' % (order[0].reference, order[1]) if order else ""
                })
                
            cr.execute(query, params)
   
            fetch = cr.dictfetchall()
            
            columns_index = {}
            for column in cr.description:
                columns_index[column.name] = column
    
            metric_names = []
            group_ref = group.reference
            for metric_id, stack in stacks.items():
                output_ref = stack['output'].reference
                
                desc = []
                desc.append(columns_index[group_ref])
                desc.append(columns_index[output_ref])
              
                res = []
                for item in fetch:
                    data = {}
                    data[group_ref] = item[group_ref]
                    data[output_ref] = item[output_ref]
                    res.append(data)
                
                result[metric_id] = {'columns': desc, 'results': res}
                metric_names.append(stack['metric'].name)
            
            if debug:     
                result['debug'] = {
                    'message': 'merge queries on widget %s' % (widget.name), 
                    'queries': [
                              { 'message': ', '.join(metric_names), 'query' : query, 'params': params }
                    ]
                }
                 
                
        # execute each metric separately
        else:
            
            if debug:
                result['debug'] = {
                    'message': 'merge queries on widget %s' % (widget.name),
                    'queries': [] 
                }
            
            for metric_id, stack in stacks.items():
                cr.execute(stack['query'], stack['params'])
             
                result[metric_id] = {'columns': cr.description, 'results': cr.dictfetchall()}
                    
                if debug:
                    result['debug']['queries'].append({
                        'message': stack['metric'].name,
                        'query' : stack['query'], 
                        'params': stack['params']
                    })
            
            
    
        return result
    
    def replace_outputs(self, query, outputs, metric_id):
        """
        rebuild query with parameters slot for other queries, required for UNION
        """
        
        pattern = re.compile(r"""(?is)^(.*select .* as [^,]+),(.* as [a-z0-9_'"]+)(.*from.*)""")
        matches = pattern.match(query)
        
        fields = []
        for mid, output in outputs.items():
            if mid == metric_id:
                fields.append(matches.group(2))
            else:
                fields.append(output)
        
        return pattern.sub('\\1,' + ','.join(fields) + '\\3', query)
     
        
    def extract_aggregate_field(self, metric, query):
        """
        extract the last output field, used for graph metrics
        """
        
        pattern = re.compile(r"""(?is)^.*select .* as (?:['"])?([a-z0-9_]+)(?:['"])?.*from""")
        matches = pattern.match(query)
        
        if not matches or  matches.lastindex < 1:
            raise Exception('can not get the last output field on metric "%s"' % (metric.name))
        
        
        return self.get_field(metric, matches.group(1))    
        
    def to_sql(self, domain, arguments):
        """
        convert domain and arguments to field name
        """
        
        converted_domain = []
        for criteria in domain:
            if len(criteria) == 3:
                clone = copy.copy(criteria)
                clone[0] = clone[0].sql_name
                converted_domain.append(clone)
            else:
                converted_domain.append(copy.copy(criteria))
         
        converted_args = {
           'group': [],
           'order': [],
           'limit': arguments['limit'],
           'offset': arguments['offset']
        }
        
        for group in arguments['group']:
            converted_args['group'].append(group.sql_name)
         
        for order in arguments['order']:
            converted_args['order'].append(order[0].sql_name + ' ' + order[1])
        
        
        self.validate_arguments(converted_args)
         
        return converted_domain, converted_args       
        
    
    def convert_fields(self, metric, domain, arguments):
        """
        convert all field reference to field object
        """
             
        converted_domain = []
        for criteria in domain:
            if len(criteria) == 3:
                clone = copy.copy(criteria)
                clone[0] = self.get_field(metric, clone[0])
                converted_domain.append(clone)
            else:
                converted_domain.append(copy.copy(criteria))
         
        converted_args = {
           'group': [],
           'order': [],
           'limit': arguments['limit'],
           'offset': arguments['offset']
        }
        
        for group in arguments['group']:
            converted_args['group'].append(self.convert_group(metric, group))
         
        for order in arguments['order']:
            converted_args['order'].append(self.convert_order(metric, order))
         
        return converted_domain, converted_args;       
     
       
    def convert_group(self, metric, group_by):
        return self.get_field(metric, group_by)
     
    def convert_order(self, metric, order_by):
        pattern = re.compile(r"""(?i)^([a-z0-9_-]+) (ASC|DESC)$""")
        matches = pattern.match(order_by)
        if not matches or matches.lastindex < 2:
            raise Exception('can not get field reference from order "%s"' % (order_by))
        return [self.get_field(metric, matches.group(1)), matches.group(2)]
    
    
    def get_field_by_type(self, metric, field_type):
        """
        get a field object based on field type
        """
        for metric_field in metric.field_ids:
            if field_type in metric_field.type_names:
                return metric_field
        return None
    
    def get_field(self, metric, field_reference):
        """
        get a field object based on the field reference
        """
        for metric_field in metric.field_ids:
            if metric_field.reference == field_reference:
                return metric_field
        raise Exception('field reference "%s" is not associated with metric "%s"' % (field_reference,metric.name))
        
    
    def get_query(self, model, metric):
        """
        get the query to execute and all default parameters
        """
        
        if not hasattr(model, '_metrics_sql') or not metric.query_name in model._metrics_sql:
            raise Exception('"%s" is not defined in model._metrics_sql' % (metric.query_name,))
    
        query = model._metrics_sql[metric.query_name]
        
        params = query['params'] if isinstance(query, dict) and 'params' in query else [] 
        defaults = query['defaults'] if isinstance(query, dict) and 'defaults' in query else {}
        sql_query = query['query'] if isinstance(query, dict) and 'query' in query else query
   
        return sql_query, params, defaults
   
    
    def defaults_arguments(self, defaults, group_by, order_by, limit, offset):
        """
        set default parameters if necessary
        """
        
        arguments = {}
        arguments['group'] = copy.copy(defaults['group_by']) if 'group_by' in defaults and len(group_by) == 0 else copy.copy(group_by)
        arguments['order'] = copy.copy(defaults['order_by']) if 'order_by' in defaults and len(order_by) == 0 else copy.copy(order_by)
        arguments['limit'] = defaults['limit'] if 'limit' in defaults and limit == "ALL" else limit
        arguments['offset'] = defaults['offset'] if 'offset' in defaults and offset == 0 else offset
          
        return arguments;
    
    
    def validate_arguments(self, arguments):
        """
        validate fields and prevent SQL Injection...
        """
        
        pattern = re.compile(r"""(?i)^(
                                    (?:
                                        (?:date_trunc\([\ ]*[a-z'"]+[\ ]*,[\ ]*[a-z0-9_'"\.]+[\ ]*\)){1} # extract on value
                                        (?:\ asc|\ desc)? # required for order
                                    )        
                                    |
                                    (?:[^\s]+(?:\ asc|\ desc)?)  # any groups, space not allowed
                                 )$""", re.X)
        
        for group in arguments['group']:
            if pattern.match(group) is None and pattern.match(group) is None:
                raise Exception('group "%s" is not valid' % (group, ))
            
        for order in arguments['order']:
            if pattern.match(order) is None and pattern.match(order) is None:
                raise Exception('order "%s" is not valid' % (order, ))
        
        if not (isinstance(arguments['limit'], int) or arguments['limit'] == "ALL"):
            raise Exception('limit is not an integer or is not "ALL"')
        
        if not isinstance(arguments['offset'], int):
            raise Exception('offset is not an integer')
        
        return True
    
    
    def is_graph_metrics(self, metrics):
        """
        check if a collection of metrics are all graph type
        """
        
        for metric in metrics:
            if metric.type != "graph":
                return False
        
        return True
    
metric_support = metrics

