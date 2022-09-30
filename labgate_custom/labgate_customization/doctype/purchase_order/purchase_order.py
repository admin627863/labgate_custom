from __future__ import unicode_literals
from datetime import datetime
from telnetlib import STATUS
import frappe
import frappe.utils
from frappe import _


def on_purchase_order_after_submit(doc, handler=""):
    if doc.company != 'ArtinAzma':

        sales = frappe.new_doc("Sales Order")
        for i in doc.items:
            sales.append("items", {
                'item_code': i.item_code,
                'item_name': i.item_name,
                'rate': i.rate,
                'delivery_date': datetime.now(),
                'qty': i.qty,
                'uom': i.uom,
                'company': doc.company,
                's_supplier': doc.supplier,
            })
            sales.customer = "ArtinAzma"
            sales.deal_number = doc.order_number
            sales.purchase_order_no = doc.name
            sales.company = doc.company
            sales.set_warehouse = doc.set_warehouse
            sales.staidentus = "Draft"
            sales.ignore_permissions = True
            sales.save()
            frappe.msgprint(msg='Sales Order Created Successfully',
                            title='Message',
                            indicator='green')


def cancel_sales_from_po(doc, method):
    name = frappe.db.get_value(
        'Sales Order', {'purchase_order_no': doc.name}, ['name'])
    if name:
        sales = frappe.get_doc('Sales Order', name)
        sales.submit()
        sales.docstatus = 2
        sales.save()
    frappe.msgprint(msg='Sales Order Cancelled Successfully',
                    title='Message',
                    indicator='red')
    return


def trash_sales_order(doc, method):
    name = frappe.db.get_value(
        'Sales Order', {'purchase_order_no': doc.name}, ['name'])

    frappe.delete_doc('Sales Order', name)
    frappe.msgprint(msg='Sales Order Deleted Successfully',
                    title='Message',
                    indicator='red')
    return
