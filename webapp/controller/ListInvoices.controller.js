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
                    this.getView().setModel(new JSONModel(JSON.parse(readerEvent.target.result)));
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

            login: function (dbName, uName, pWord) {
                return fetch((Constants.API_BASE_URL + Constants.API_LOGIN), {
                    method: 'POST',
                    headers: Constants.REQ_HEADERS,
                    credentials: 'include',
                    body: JSON.stringify({
                        CompanyDB: dbName,
                        UserName: uName,
                        Password: pWord
                    })
                });
            },

            logout: function () {
                fetch((Constants.API_BASE_URL + Constants.API_LOGOUT), {
                    method: 'POST',
                    headers: Constants.REQ_HEADERS,
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
                    headers: Constants.REQ_HEADERS,
                    credentials: 'include',
                    body: JSON.stringify(invoice)
                })
                .then(res => {
                    if (res.ok) {
                        console.log(`Invoice for '${invoice.CardCode}' posted successfully`);
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
                const dbName = this.byId('dbNameInput').getValue();
                const uName = this.byId('uNameInput').getValue();
                const pWord = this.byId('pWordInput').getValue();

                if (!dbName || !uName || !pWord) {
                    alert('Please enter connection details');
                } else {
                    const oModelData = this.getView().getModel().getData();
                    const oTable = this.byId('table1');
                    
                    this.disableControls();

                    let aIndices = oTable.getSelectedIndices();
                    let invoicesToProcess = [];
                    aIndices.forEach((element) => {
                        invoicesToProcess.push(oModelData.Invoices[element]);
                    });
                    const invoicePayload = this.generateInvoicePayload(invoicesToProcess);

                    this.login(dbName, uName, pWord)
                    .then(res => {
                        if (res.ok) {
                            invoicePayload.forEach(inv => {
                                this.postInvoice(inv);
                            });
    
                            this.logout();
                            this.enableControls(true);
                        } else {
                            console.error('Could not log in, check connection details');
                            this.enableControls(false);
                        }
                    })
                    .catch(err => {
                        console.error('Login failure', err);
                        this.enableControls(false);
                    });

                    MessageToast.show(`Processing ${invoicePayload.length} invoice(s)`);
                }
            },

            enableControls: function (clearSelection) {
                if (clearSelection) {
                    this.byId('table1').clearSelection();
                }
                this.byId('table1').setShowOverlay(false);
                this.byId('processButton').setEnabled(true);
            },

            disableControls: function () {
                this.byId('table1').setShowOverlay(true);
                this.byId('processButton').setEnabled(false);
            }
        });
    });
