sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/ui/model/json/JSONModel',
    '../model/Constants'
],
    function (Controller, MessageToast, JSONModel, Constants) {
        'use strict';

        return Controller.extend('pldemo1.controller.ListInvoices', {
            handleUpload: function (oEvent) {
                const file = oEvent.getParameters().files[0];
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = (readerEvent) => {
                    const payload = readerEvent.target.result;
                    this.getView().setModel(new JSONModel(JSON.parse(payload)));
                };
            },

            generateInvoicePayload: function (invoices) {
                const finalPayload = [];
                invoices.forEach(invoice => {
                    invoice.Customers.forEach(customer => {
                        const docLines = [];
                        let lineNum = 1;
                        customer.Subscriptions.forEach((sub) => {
                            sub.PriceLines.forEach((line) => {
                                docLines.push({
                                    'LineNum': lineNum,
                                    'ItemCode': line.LineId,
                                    'ItemDescription': line.Description,
                                    'Quantity': line.Quantity,
                                    'UnitPrice': line.UnitPrice
                                });
                                lineNum++;
                            });
                        });
                        lineNum = 1;

                        const payload = {
                            'CardCode': `C${customer.AccountID}`,
                            'DocDate': invoice.Header.Date,
                            'DocDueDate': invoice.Header.Date,
                            'TaxDate': invoice.Header.Date,
                            'Comments': 'Test from PlDemoApp',
                            'DocumentLines': docLines
                        }
                        finalPayload.push(payload);
                    });
                });

                return finalPayload;
            },

            login: function () {
                return fetch((Constants.API_BASE_URL + Constants.API_LOGIN), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(Constants.LOGIN_REQ_BODY)
                });
            },

            logout: function () {
                fetch((Constants.API_BASE_URL + Constants.API_LOGOUT), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                .catch(err => {
                    console.error('Logout error:', err);
                });
            },

            postInvoice: function (invoice) {
                console.log('Posting invoice: ', invoice);

                fetch((Constants.API_BASE_URL + Constants.API_INVOICES), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(invoice)
                })
                .then(res => {
                    if (res.ok) {
                        console.log(`Invoice for ${invoice.CardCode} posted successfully`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.error) {
                        console.error(`${data.error.code} ${data.error.message}`);
                    }
                })
                .catch(err => {
                    console.error('Error posting invoice: ', err);
                });
            },

            processInvoices: function () {
                const oModel = this.getView().getModel().getData();
                const oTable = this.byId('table1');
                const oProcessButton = this.byId('processButton');
                
                oTable.setShowOverlay(true);
                oProcessButton.setEnabled(false);

                let aIndices = oTable.getSelectedIndices();
                let invoicesToProcess = [];
                aIndices.forEach((element) => {
                    invoicesToProcess.push(oModel.Invoices[element]);
                });

                const invoicePayload = this.generateInvoicePayload(invoicesToProcess);

                this.login()
                    .then(res => {
                        invoicePayload.forEach(inv => {
                            this.postInvoice(inv);
                        });

                        this.logout();

                        oTable.clearSelection();
                        oTable.setShowOverlay(false);
                        oProcessButton.setEnabled(true);
                    })
                    .catch(err => {
                        console.error('Login failure', err);
                        oTable.setShowOverlay(false);
                        oProcessButton.setEnabled(true);
                    });

                MessageToast.show(`Processing ${invoicePayload.length} invoice(s)`);
            }
        });
    });
