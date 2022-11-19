/*global QUnit*/

sap.ui.define([
	"pl-demo-1/controller/ListInvoices.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListInvoices Controller");

	QUnit.test("I should test the ListInvoices controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
