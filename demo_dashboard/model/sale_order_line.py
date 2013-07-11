# -*- coding: utf-8 -*-

from osv import osv
from trobz_dashboard.utils.model import metric_support 

class sale_order_line(osv.osv, metric_support):
    _inherit = 'sale.order.line'
    
    _metrics_sql = {
        'graph_total_sales': {
           'query': """
                SELECT {group_sql} AS "{group_ref}", sum(price_unit * product_uom_qty) as total_sales 
                FROM sale_order_line sol
                JOIN sale_order sor ON sor.id = sol.order_id
                JOIN res_company rco ON rco.id=sor.company_id
                JOIN sale_shop ssh ON ssh.id=sor.shop_id
                JOIN res_partner rpa ON rpa.id=sor.partner_id
                JOIN resource_resource rre ON rre.user_id = sor.user_id
                JOIN hr_employee hem ON hem.resource_id = rre.id
                JOIN hr_department hde ON hde.id = hem.department_id
                JOIN product_product ppr ON ppr.id = sol.product_id
                JOIN product_template pte ON pte.id = ppr.product_tmpl_id
                JOIN product_category pca ON pca.id = pte.categ_id
                where TRUE {generated}
                """,
           'defaults': {
                'group_by': ['order_date_month']
           }
        }
    }


sale_order_line()