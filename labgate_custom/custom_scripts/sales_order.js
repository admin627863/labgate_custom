frappe.ui.form.on('Sales Order', "refresh", function(frm){
    
    frm.add_custom_button(__("Update Deal Number"), function() {
        frappe.confirm('Are you sure you want to proceed?',
        () => {
            if (frm.doc.docstatus == 1){
                frappe.call({
                     method: "labgate_custom.labgate_customization.doctype.sales_order.sales_order_update.update_item_price",
                     args: {
                         s_name:frm.doc.name,
                         deal_no: frm.doc.deal_number
                     }
                 });
             }
             else {
                 msgprint('Please Submit Document');
             }   
        }, () => {
            // action to perform if No is selected
        })
   
  });
});

