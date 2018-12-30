sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox",
	'../Formatter'
], function (BaseController, MessageBox, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.ValidationErrors", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
		},
		onSelectDocument: function(oEvent) {
			try {
				
				//var row = oEvent.getSource().getParent();
				//var sPath = row.getBindingContext('SapErrorData').getPath();
				//var selectedRecord = row.getBindingContext('SapErrorData').getModel().getProperty(row.getBindingContext('SapErrorData').getPath());
				
				var docId = oEvent.getSource().getProperty('text');
				var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
				oRouter.navTo("ValidationErrorDetails", {
					docId: docId
				});
			} catch (ex) {
				MessageBox.error(ex);
			}
		}
	});
});