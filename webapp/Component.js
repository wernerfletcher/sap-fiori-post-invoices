/* eslint-disable @sap/ui5-jsdocs/no-jsdoc */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "pldemo1/model/models",
    "sap/ui/model/json/JSONModel"
],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("pldemo1.Component", {
            metadata: {
                "manifest": "json",
                "interfaces": ["sap.ui.core.IAsyncContentCreation"],
                "rootView": {
                    "viewName": "pldemo1.view.ListInvoices",
                    "type": "XML",
                    "id": "ListInvoices"
                }
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                UIComponent.prototype.init.apply(this, arguments);
                
                const oModel = this.loadJson();
                this.setModel(oModel);
            },

            loadJson: function () {
                const jsonModel = new JSONModel();
    
                fetch('../2tCloud.json')
                    .then(data => data.json())
                    .then(json => jsonModel.setData(json));
    
                return jsonModel;
            }
        });
    }
);