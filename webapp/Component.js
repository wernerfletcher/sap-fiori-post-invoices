/* eslint-disable @sap/ui5-jsdocs/no-jsdoc */

sap.ui.define([
    "sap/ui/core/UIComponent"
],
    function (UIComponent) {
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
            }
        });
    }
);