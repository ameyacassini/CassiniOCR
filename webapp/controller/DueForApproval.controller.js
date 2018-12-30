sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox",
	'../Formatter'
], function (BaseController, MessageBox, Formatter) {
	"use strict";
	//var oView, oController, oComponent;
	//var oController;
	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.DueForApproval", {
		onInit: function() {
			//oController = this;
			//oView = this.getView();
			//oComponent = this.getOwnerComponent();
		},
		onSelectDocument: function(oEvent) {
			try {
				//var row = oEvent.getSource().getParent();
				//var sPath = row.getBindingContext('MgrApprovalData').getPath();
				//var selectedRecord = row.getBindingContext('MgrApprovalData').getModel().getProperty(row.getBindingContext('MgrApprovalData').getPath());
				
				
				var approvalId = oEvent.getSource().getProperty('text');
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
				oRouter.navTo("PoPreference", {
					approvalId: approvalId
				});
			} catch (ex) {
				MessageBox.error(ex);
			}
		}
	});
});