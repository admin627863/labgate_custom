import frappe
from datetime import date, datetime, timedelta
from frappe.utils import date_diff


def on_sales_order_after_submit(doc, handler=""):
    if doc.company == 'ArtinAzma':    
        for i in doc.items:
                if i.company == "Labgate" or i.company == "Yadro":
                        get_spp = frappe.db.get_value('Supplier',{'name':i.s_supplier},['default_currency'])
                        get_curr = frappe.db.get_value('Company',{'name':i.company},['default_currency'])
                        purchase_order = frappe.new_doc('Purchase Order')
                        purchase_order.company = i.company
                        purchase_order.currency = get_spp or get_curr
                        purchase_order.buying_prince_list = "Standard Buying"
                        purchase_order.supplier = i.s_supplier
                        purchase_order.order_number = doc.name
                        purchase_order.sales_order = doc.name
                        purchase_order.schedule_date = i.delivery_date 
                        purchase_order.flags.ignore_permissions  = True
                        purchase_order.append("items",{
                                'item_code':i.item_code,
                                'qty':i.qty,
                                'uom':i.uom,
                                'rate':i.rate,
                                'amount':i.amount     
                                
                        }) 
                        
                        purchase_order.save()    
                else:
                        purchase_order = frappe.new_doc('Purchase Order')
                        purchase_order.company = i.company
                        purchase_order.supplier = i.s_supplier
                        purchase_order.order_number = doc.name
                        purchase_order.sales_order = doc.name
                        purchase_order.schedule_date = i.delivery_date 
                        purchase_order.flags.ignore_permissions  = True
                        purchase_order.append("items",{
                                'item_code':i.item_code,
                                'qty':i.qty,
                                'uom':i.uom,
                                'rate':i.rate,
                                'amount':i.amount     
                                
                        }) 
                        purchase_order.save()
                purchase_order = frappe.new_doc('Purchase Order')
                purchase_order.company = doc.company
                purchase_order.supplier = i.company
                purchase_order.order_number = doc.name
                purchase_order.sales_order = doc.name
                purchase_order.schedule_date = doc.delivery_date 
                purchase_order.flags.ignore_permissions  = True
                purchase_order.append("items",{
                                'item_code':i.item_code,
                                'qty':i.qty,
                                'uom':i.uom,
                                'rate':i.rate,
                                'amount':i.amount     
                                
                        }) 
                        
                purchase_order.save()

            
        return


        