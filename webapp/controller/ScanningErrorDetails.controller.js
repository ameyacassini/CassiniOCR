sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox",
	'../Formatter'
], function (BaseController, MessageBox, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.ScanningErrorDetails", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        	oRouter.getRoute("ScanningErrorDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent) {
			var nonSapErrorDataModel = oComponent.getModel("NonSapErrorData");
			var errors = nonSapErrorDataModel.getData();
			var errorData = {};
			for(var i = 0; i < errors.length; i++) {
				if(errors[i].scanId === oEvent.getParameter("arguments").scanId){
					errorData = errors[i];
					break;
				}
			}
			
			var errorModel = new sap.ui.model.json.JSONModel(errorData);
			oView.setModel(errorModel, "errorData");  
		},
		
		onUpdateScanningError: function() {
			try {
				MessageBox.confirm(
					"Do you confirm the update?",
					{
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						onClose: function(sAction) {
							if(sAction == "OK") {
								sap.ui.core.BusyIndicator.show(0);
								var errorModel = oView.getModel("errorData");
				
								var errorData = errorModel.getData();
								
								var dt = new Date(errorData.invoiceDate);
							
								var year = dt.getFullYear();
								var month = "";
								if(dt.getMonth() < 9) {
									month = "0" + (dt.getMonth() + 1);
								} else {
									month = (dt.getMonth() + 1).toString();
								}
								
								var date = "";
								if(dt.getDate() < 10) {
									date = "0" + dt.getDate();
								} else {
									date = dt.getDate().toString();
								}
								
								errorData.invoiceDate = year + "-" + month + "-" + date + "T00:00:00.000Z";
								
								var createdTime = errorData.createdTime;
								var createdYear = createdTime.getFullYear();
								var createdMonth = "";
								if(createdTime.getMonth() < 9) {
									createdMonth = "0" + (createdTime.getMonth() + 1);
								} else {
									createdMonth = (createdTime.getMonth() + 1).toString();
								}
								var createdDate = "";
								if(createdTime.getDate() < 10) {
									createdDate = "0" + createdTime.getDate();
								} else {
									createdDate = createdTime.getDate().toString();
								}
								
								errorData.createdTime = createdYear + "-" + createdMonth + "-" + createdDate + "T00:00:00.000Z";
								
								var updatedTime = new Date();
								var updatedYear = updatedTime.getFullYear();
								var updatedMonth = "";
								if(updatedTime.getMonth() < 9) {
									updatedMonth = "0" + (updatedTime.getMonth() + 1);
								} else {
									updatedMonth = (updatedTime.getMonth() + 1).toString();
								}
								
								var updatedDate = "";
								if(updatedTime.getDate() < 10) {
									updatedDate = "0" + updatedTime.getDate();
								} else {
									updatedDate = updatedTime.getDate().toString();
								}
								
								errorData.updatedTime = updatedYear + "-" + updatedMonth + "-" + updatedDate + "T00:00:00.000Z";
								errorData.errorMessage = "";
								errorData.status = "SUCCESS";
								delete errorData.invoiceFile;
								var postData = JSON.stringify(errorData);
								$.ajax({
									type: 'POST',
									headers: { 
								        'Content-Type': 'application/json' 
								    },
									url: "/ocrspring/updateInvoiceData/",
									data: postData,
									dataType: "json",
									success: function(data, response) {
										sap.ui.core.BusyIndicator.hide();
										MessageBox.success(
											"Document validated",
											{
												actions: [sap.m.MessageBox.Action.OK],
												onClose: function(sAction) {
													var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
													oRouter.navTo("Home");
												}
											}
										);
									},
									error: function(err, response) {
										MessageBox.error(err);
										sap.ui.core.BusyIndicator.hide();
										if(err.responseText === "SUCCESS") {
											MessageBox.success(
												"Document validated",
												{
													actions: [sap.m.MessageBox.Action.OK],
													onClose: function(sAction) {
														var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
														oRouter.navTo("Home");
													}
												}
											);
										}
									}
								});
							}
						}
					}
				);
				
				
			} catch (ex) {
				MessageBox.error(ex);
				sap.ui.core.BusyIndicator.hide();
			}
		}
	});
});