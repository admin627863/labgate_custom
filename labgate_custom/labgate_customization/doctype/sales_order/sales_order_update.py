import frappe

@frappe.whitelist(allow_guest=True)
def update_item_price(s_name,deal_no):
    frappe.db.sql("""update `tabPurchase Order` set order_number = %s where sales_order = %s""",(deal_no,s_name))
    frappe.db.commit()
    frappe.msgprint("Deal number updated...")