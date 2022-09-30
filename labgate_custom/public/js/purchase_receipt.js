this.frm.dashboard.add_transactions([
    {
        'items': [
            'Shipment'
            ],
        'label': 'Related'
    }
]);

frappe.ui.form.on('Purchase Receipt', "refresh", function(frm) {
    frm.add_custom_button(__("Generate Shipment"), function() {
        frappe.model.open_mapped_doc({
            method: "shipment.shipment.doctype.purchase_receipt.purchase_receipt.make_shipment",
            frm: cur_frm
        })
    });
});

frappe.ui.form.on("Purchase Receipt", {
	setup: (frm) => {
		frm.make_methods = {
			'Shipment': () => {
				let ship = frappe.model.get_new_doc('Shipment');
				ship.pickup_from_type = "Supplier";
				ship.pickup_supplier = frm.doc.supplier;
				ship.delivery_to_type = "Company";
				ship.delivery_company = frm.doc.company
				frappe.set_route("Form", ship.doctype, ship.name);
			},
		}
	}
});

frappe.ui.form.on('Purchase Receipt',{
    refresh(frm){
        
        $.each(cur_frm.doc.items, function(i, v) {
            if(v.check_bd_qty == 0){
                v.bd_qty = v.qty;    
            }
            
         });
         
        if (frm.doc.items.length){
            frm.add_custom_button(__("Box Details"),() => {
                frm.trigger("box_details");
            });
        }
    },
     box_details:function(frm){
        const dialog = frappe.prompt({
 
            fieldnmae:'box_child',
            fieldtype:'Table',
            label:(__("Box Details")),
        
            fields:[
                {
                    fieldtype:'Link',
                    options:'Item',
                    fieldname:'item_code',
                    label: __('Item Code'),
                    in_list_view:1,
                    get_query:function(doc) {
                        return{
                            filters :{
                                name :['in', cur_frm.doc.items.map((val)=>{ return val.item_code })]
                            }
                        };
                    }
                    
                    
                },
                 {
                    fieldtype:'Data',
                    fieldname:'item_name',
                    label: __('Item Name'),
                    in_list_view:1
                    
                },
                 {
                    fieldtype:'Float',
                    fieldname:'qty',
                    label: __('Qty'),
                    in_list_view:1
                    
                    
                },
                 {
                    fieldtype:'Link',
                    options:'UOM',
                    fieldname:'uom',
                    label: __('UOM'),
                    in_list_view:1
                    
                },
                {
                    fieldtype:'Data',
                    fieldname:'box_no',
                    label: __('Box No'),
                    in_list_view:1,
                    hidden:1,
                    set_query:function(doc) {cur_frm.doc.name}
                    
                    
                },
                {
                    fieldtype:'Int',
                    fieldname:'length_cm',
                    label: __('Length (cm)'),
                    
                    
                },
                {
                    fieldtype:'Int',
                    fieldname:'width_cm',
                    label: __('Width (cm)'),
    
                },
                {
                    fieldtype:'Int',
                    fieldname:'height_cm',
                    label: __('Height (cm)'),
                },
                {
                    fieldtype:'Float',
                    fieldname:'weight_kg',
                    label: __('Weight (kg)'),

                },
                {
                    fieldtype:'Int',
                    fieldname:'count',
                    label: __('Count'),
    
                }
                ],
            
        },
                function(r){
                    
                        console.log(r);
                        let flag = 0;
                  $.each(r, function(a, b) {
                      
                      $.each(b, function(c, d) {
                        $.each(cur_frm.doc.items, function(i, v) {
                        // console.log(v);
                        if(d.item_code == v.item_code){
                            if(v.check_bd_qty == 1){
                                 frappe.throw("Box Details No More Create!");
                            }
                            else if(d.qty > v.bd_qty){
                                 frappe.throw("Qty Is Grater than Atual Qty");
                            }
                            else if(d.qty <= v.bd_qty){
                                flag = 1;
                                console.log(flag);
                                let temp = v.bd_qty - d.qty;
                                frappe.model.set_value(v.doctype, v.name, "bd_qty", temp);
                                if(v.bd_qty == 0){
                                     frappe.model.set_value(v.doctype, v.name, "check_bd_qty", 1);
                                     cur_frm.save();
                                }
                            }
                            else{
                                 frappe.throw("Atual Qty Is 0");
                            }
                        }
                        
                      });
                    });
                  });
                       let ar = [];
                         if (flag == 1){
                    $.each(r,function(i,j){
                    let row = [];
                    $.each(j,function(i1,j1){
                        row.push({
                            'item_code':j1.item_code,
                            'item_name':j1.item_name,
                            'qty':j1.qty,
                            'uom':j1.uom,
                            'box_no':cur_frm.doc.name,
                            "length_cm":j1.length_cm,
                            "width_cm":j1.width_cm,
                            "height_cm":j1.height_cm,
                            "weight_kg":j1.weight_kg,
                            "count":j1.count,
                        });
                     });
                     frappe.model.get_value("Box Details",{"purchase_receipt_no":frm.doc.name},"name",function(data){
                              frappe.db.insert({
                                "doctype":"Box Details",
                                "purchase_receipt_no":cur_frm.doc.name,
                                "items":row
                            }).then(function(doc){
                                frappe.msgprint("Data Inserted Successfully.");
                            });
                     });
                });
                } 
        });
    }
});