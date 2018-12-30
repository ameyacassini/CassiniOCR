sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox",
	'../Formatter'
], function (BaseController, MessageBox, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.ValidationErrorDetails", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        	oRouter.getRoute("ValidationErrorDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent) {
			var sapErrorDataModel = oComponent.getModel("SapErrorData");
			var errors = sapErrorDataModel.getData();
			var errorData = {};
			for(var i = 0; i < errors.length; i++) {
				if(errors[i].Uniqueid === oEvent.getParameter("arguments").docId){
					errorData = errors[i];
					break;
				}
			}
			errorData.invoiceFile = "";
			var errorModel = new sap.ui.model.json.JSONModel(errorData);
			oView.setModel(errorModel, "errorData"); 
			var postData = JSON.stringify({
				fileName: errorData.Filename,
				filePath: errorData.Filepath
			});
			oView.byId("invoiceFileImg").setBusy(true);
			$.ajax({
				type: 'POST',
				headers: { 
			        'Content-Type': 'application/json' 
			    },
				url: "/ocrspring/getInvoiceFile/",
				data: postData,
				dataType: "json",
				success: function(data) {
					oView.byId("invoiceFileImg").setBusy(false);
				},
				error: function(err) {
					MessageBox.error(err);
					if(err.status === 200) {
						errorModel.getData().invoiceFile = err.responseText;
						oView.byId("invoiceFileImg").setBusy(false);
						errorModel.refresh(true);
					}
				}
			});
		},
		
		onChangeVendorDetails: function(oEvent) {
			try {
				var vendorNoDataModel = oComponent.getModel("VendorNoData");
				var errorModel = oView.getModel("errorData");
				var vendorNoExist = false;
				for(var i = 0; i < vendorNoDataModel.getData().length; i++) {
					if(vendorNoDataModel.getData()[i].vendorName === errorModel.getData().Vendorname 
						&& vendorNoDataModel.getData()[i].pincode === errorModel.getData().Postalcode) {
						errorModel.getData().Vendorno = vendorNoDataModel.getData()[i].vendorNo;
						errorModel.refresh(true);
						vendorNoExist = true;
						break;
					}
				}
				
				if(!vendorNoExist) {
					errorModel.getData().Vendorno = "";
					errorModel.refresh(true);
				}
			} catch (ex) {
				MessageBox.error(ex);
			}
		},
		
		onUpdate: function(oEvent) {
			try {
				MessageBox.confirm(
					"Do you confirm the update?",
					{
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						onClose: function(sAction) {
							if(sAction == "OK") {
								sap.ui.core.BusyIndicator.show(0);
								var errorData = JSON.parse(JSON.stringify(oView.getModel("errorData").getData()));
				
								var invoiceDate = new Date(errorData.Invoicedate);
							
								var invoiceMonth = "";
								if(invoiceDate.getMonth() < 9) {
									invoiceMonth = "0" + (invoiceDate.getMonth() + 1);
								} else {
									invoiceMonth = (invoiceDate.getMonth() + 1).toString();
								}
								
								invoiceDate = invoiceDate.getFullYear() + "-" + invoiceMonth + "-" + invoiceDate.getDate() + "T00:00:00";
								
								var postData = {
									Servicecall: "FIN",
									UpdOcrScanHdrToItm: [{
										Uniqueid: errorData.Uniqueid,
										Invoiceno: errorData.Invoiceno,
							            Vendorno: errorData.Vendorno,
							            Invoicetype: "MM",
							            Invoicedate: invoiceDate,
							            Vendorname: errorData.Vendorname,
							            Postalcode: errorData.Postalcode,
							            Filename: errorData.Filename,
							            Filepath: errorData.Filepath,
							            Status: errorData.Status,
							            Netvalue: errorData.Netvalue,
							            Grossvalue: errorData.Grossvalue,
							            Vat: errorData.Vat,
							            Currency: errorData.Currency,
							            Timestamp: null,
							            ValidStatus: "VE"
									}]
								};
								var mainServiceModel = oComponent.getModel("mainServiceModel");
								mainServiceModel.create("/UpdOcrScanHdrs", postData, {
									success: function() {
										sap.ui.core.BusyIndicator.hide();
										MessageBox.success(
											"Request updated",
											{
												actions: [sap.m.MessageBox.Action.OK],
												onClose: function(sAction) {
													var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
													oRouter.navTo("Home");
												}
											}
										);
									},
									error: function(oError) {
										sap.ui.core.BusyIndicator.hide();
										MessageBox.error(oError);
									}
								});				
							} else {
								sap.ui.core.BusyIndicator.hide();
							}
						}
					});
				
			} catch (ex) {
				MessageBox.error(ex);
			}
		}
	});
});