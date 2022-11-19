sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("pldemo1.controller.ListInvoices", {
            onProcess: function () {
                const oTable = this.byId("table1");
                oTable.setShowOverlay(true);

                const aIndices = oTable.getSelectedIndices();
                const oModel = this.getView().getModel().getData();
                const invoicesToProcess = [];

                aIndices.forEach((element) => {
                    invoicesToProcess.push(oModel.Invoices[element]);
                });

                const invoicePayload = this.getSapInvoicePayload(invoicesToProcess);
                console.log(invoicePayload);

                var i = 0;
                var interval = setInterval(function () {
                    // TODO: Post to SAP
                    console.log(invoicePayload[i]);
                    i++;
                    if (i === invoicePayload.length) clearInterval(interval);
                }, 1000);

                MessageToast.show(`You have sent ${aIndices.length} invoices for processing`);
                oTable.clearSelection();
                oTable.setShowOverlay(false);
            },

            getSapInvoicePayload: function (invoices) {
                const finalPayload = [];
                invoices.forEach(invoice => {
                    invoice.Customers.forEach(customer => {
                        const docLines = [];
                        customer.Subscriptions.forEach(sub => {
                            sub.PriceLines.forEach((line, lIndex) => {
                                docLines.push({
                                    "LineNum": lIndex,
                                    "ItemCode": line.LineId,
                                    "ItemDescription": line.Description,
                                    "Quantity": line.Quantity,
                                    "TaxCode": line.TaxZoneID,
                                    "UnitPrice": line.UnitPrice
                                });
                            });
                        });
                        const payload = {
                            "CardCode": customer.AccountID,
                            "DocDate": invoice.Header.Date,
                            "DocDueDate": invoice.Header.Date,
                            "TaxDate": invoice.Header.Date,
                            "Comments": "Test from PlDemoApp",
                            "DocumentLines": docLines
                        }
                        finalPayload.push(payload);
                    });
                });

                return finalPayload;
            }
        });
    });
