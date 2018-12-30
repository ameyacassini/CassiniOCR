sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox",
	'../Formatter'
], function (BaseController, MessageBox, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.ScanningErrors", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			
			var oModel = this.getOwnerComponent().getModel();
			var postData = oModel.getData().PostData;
			var scanningErrorData = postData.filter(function(data) {
			    return data.status === 0;
			});
			
			var oScanningErrorModel = new sap.ui.model.json.JSONModel({
				PostData: scanningErrorData
			});
			this.getOwnerComponent().setModel(oScanningErrorModel, "ScanningErrorData");
		},
		onSelectDocument: function(oEvent) {
			try {
				
				//var row = oEvent.getSource().getParent();
				//var sPath = row.getBindingContext('NonSapErrorData').getPath();
				//var selectedRecord = row.getBindingContext('NonSapErrorData').getModel().getProperty(row.getBindingContext('NonSapErrorData').getPath());
				
				
				var scanId = oEvent.getSource().getProperty('text');
				var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
				oRouter.navTo("ScanningErrorDetails", {
					scanId: scanId
				});
			} catch (ex) {
				MessageBox.error(ex);
			}
		}
	});
});