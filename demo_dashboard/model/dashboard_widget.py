# -*- encoding: utf-8 -*-
##############################################################################

from osv import osv
from os import path

class dashboard_widget(osv.osv):

    _inherit = "dashboard.widget"

    def custom_execute(self, cr, uid, ids, period={}, domain=[], group_by=[], order_by=[], limit="ALL", offset=0, debug=False, context=None):
        """
        Demo: custom method to execute widget metrics.
        
        Read values from a text file, maybe a little bit dirty but it just for the POC.
        
        Note: 
        This method is only used for demo, by a specific widget associated with well known metrics and fields.
        The response has to follow the same format than the default `execute` method.
        """

        response = {}
        
        current_path = path.dirname(path.realpath(__file__))
        source_file = current_path + '/../data/custom_method_data.txt'
        data = [[i for i in line.split()] for line in open(source_file)]
        
        columns = [{'name': 'custom_name'}, {'name': 'custom_value'}]
        results = [{columns[i]['name']:val for i, val in enumerate(line)} for line in data]
        
        for widget in self.browse(cr, uid, ids, context=context):
            response[widget.id] = {}
            for metric in widget.metric_ids:
                
                response[widget.id][metric.id] = {
                    'columns': columns,
                    'results': results,
                }
            
                if debug:
                    response[widget.id]['debug'] = {
                        'message': 'read text file %s with %s results for widget %s' % (source_file, len(data), widget.name)
                    }
                     
            
        return response



dashboard_widget()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

