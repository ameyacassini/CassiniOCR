sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox",
	"../Formatter"
], function (BaseController, MessageBox, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.ReadyToPostDetails", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			$('body').on('click', '#btnToggleTable', function() {
		       $(this).parent().toggleClass('no-filter');
		       oView.byId("collapsibleFooter").toggleStyleClass('expanded');
		    });
		    
		    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        	oRouter.getRoute("ReadyToPostDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent) {
			var fiReviewRecordsDataModel = oComponent.getModel("FiReviewRecords");
			var records = fiReviewRecordsDataModel.getData();
			var record = {};
			for(var i = 0; i < records.length; i++) {
				if(records[i].Uniqueid == oEvent.getParameter("arguments").recordId){
					record = records[i];
					break;
				}
			}
			//approval.balanceAmount = approval.Grossvalue;
			//approval.isValid = false;
			
			var recordlModel = new sap.ui.model.json.JSONModel(record);
			oView.setModel(recordlModel, "record");  
			
		$.ajax("/ocrspring/getTaxRate/"+ record.VendorCountry + "/" + record.Companycode + "/", {
				success: function(data) {
					recordlModel.getData().Taxcode = data.taxCode;
					recordlModel.getData().Taxrate = data.taxRate;
					var tax = (parseFloat(recordlModel.getData().Netvalue) * parseFloat(data.taxRate)) / 100;
					recordlModel.getData().Vat = tax;
					recordlModel.refresh(true);
				},
				error: function(err) {
					MessageBox.error(err);
		    	}
		   });
		},
		onExpandCollapsibleTable: function(oEvent) {
			try {
				//this.getView().byId("collapsibleFooter").toggleStyleClass('expanded');
			} catch (ex) {
				MessageBox.error(ex);
			}
		},
		onPost: function(oEvent) {
			try {
				MessageBox.confirm(
					"Do you confirm the posting?",
					{
						actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						onClose: function(sAction) {
							if(sAction == "OK") {
								sap.ui.core.BusyIndicator.show(0);
								var reviewedData = JSON.parse(JSON.stringify(oView.getModel("record").getData()));
								reviewedData.UpdOcrHdrToOcrItm = reviewedData.GetOcrHdrToOcrItm;
								
								for(var i = 0; i < reviewedData.UpdOcrHdrToOcrItm.results.length; i++) {
									reviewedData.UpdOcrHdrToOcrItm.results[i].FinReviewed = "X";
									delete reviewedData.UpdOcrHdrToOcrItm.results[i].Paymentindays;
									delete reviewedData.UpdOcrHdrToOcrItm.results[i].VendorCountry;
									delete reviewedData.UpdOcrHdrToOcrItm.results[i].__metadata;
								}
								
								var postingDate = new Date(reviewedData.Postingdate);
							
								var postingMonth = "";
								if(postingDate.getMonth() < 9) {
									postingMonth = "0" + (postingDate.getMonth() + 1);
								} else {
									postingMonth = (postingDate.getMonth() + 1).toString();
								}
								
								postingDate = postingDate.getFullYear() + "-" + postingMonth + "-" + postingDate.getDate() + "T00:00:00";
								
								var documentDate = new Date(reviewedData.Invoicedate);
							
								var documentMonth = "";
								if(documentDate.getMonth() < 9) {
									documentMonth = "0" + (documentDate.getMonth() + 1);
								} else {
									documentMonth = (documentDate.getMonth() + 1).toString();
								}
								
								documentDate = documentDate.getFullYear() + "-" + documentMonth + "-" + documentDate.getDate() + "T00:00:00";
								
								var postData = {
									Servicecall: "FIN",
									PostingDate: postingDate.toJSON().split(".")[0],
									MgrComment: reviewedData.MgrComment,
									Vat: reviewedData.Vat.toString(),
									TaxCode: reviewedData.Taxcode,
									DocumentDate: documentDate.toJSON().split(".")[0],
									CalcTax: "X",
									UpdOcrHdrToOcrItm: reviewedData.UpdOcrHdrToOcrItm.results
								};
								
								var mainServiceModel = oComponent.getModel("mainServiceModel");
								mainServiceModel.create("/UpdOcrHdrs", postData, {
									success: function(postResponse) {
										sap.ui.core.BusyIndicator.hide();
										MessageBox.success(
											"Document no. " + postResponse.UpdOcrHdrToOcrItm.results[0].Sapinvoice + " posted successfully",
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
							}
						}
					});
				
			} catch (ex) {
				sap.ui.core.BusyIndicator.hide();
				MessageBox.error(ex);
			}
		}
	});
});