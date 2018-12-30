sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox",
	'../Formatter'
], function (BaseController, MessageBox, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.ReadyToPost", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
		},
		onSelectDocument: function(oEvent) {
			try {
				//var row = oEvent.getSource().getParent();
				//var sPath = row.getBindingContext('FiReviewRecords').getPath();
				//var selectedRecord = row.getBindingContext('FiReviewRecords').getModel().getProperty(row.getBindingContext('FiReviewRecords').getPath());
				
				
				var recordId = oEvent.getSource().getProperty('text');
				var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
				oRouter.navTo("ReadyToPostDetails", {
					recordId: recordId
				});
				
			} catch (ex) {
				MessageBox.error(ex);
			}
		},
		
		onPost: function(oEvent) {
			try {
				var source = oEvent.getSource();
				
				var row = source.getParent();
				//var sPath = row.getBindingContext('FiReviewRecords').getPath();
				var selectedRecord = row.getBindingContext('FiReviewRecords').getModel().getProperty(row.getBindingContext('FiReviewRecords').getPath());
				
				
				
				source.setBusy(true);
				var reviewedData = JSON.parse(JSON.stringify(selectedRecord));
				
				
				$.ajax("/ocrspring/getTaxRate/"+ reviewedData.VendorCountry + "/" + reviewedData.Companycode + "/", {
					success: function(data) {
						//recordlModel.getData().Taxcode = data.taxCode;
						//recordlModel.getData().Taxrate = data.taxRate;
						var tax = (parseFloat(reviewedData.Netvalue) * parseFloat(data.taxRate)) / 100;
						//recordlModel.getData().Vat = tax;
						//recordlModel.refresh(true);
						
						
						
						reviewedData.UpdOcrHdrToOcrItm = reviewedData.GetOcrHdrToOcrItm;
				
						for(var i = 0; i < reviewedData.UpdOcrHdrToOcrItm.results.length; i++) {
							//reviewedData.UpdOcrHdrToOcrItm.results[i].Message = "";
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
							PostingDate: postingDate,
							MgrComment: reviewedData.MgrComment,
							Vat: reviewedData.Vat.toString(),
							TaxCode: data.taxCode,
							DocumentDate: documentDate,
							CalcTax: "X",
							UpdOcrHdrToOcrItm: reviewedData.UpdOcrHdrToOcrItm
						};
						
						var mainServiceModel = oComponent.getModel("mainServiceModel");
						mainServiceModel.create("/UpdOcrHdrs", postData, {
							success: function(postResponse) {
								
								
								var parent = source.getParent().getParent();
								$("#" + parent.getId() + "-highlight").addClass("posted");
								source.setBusy(false);
								$("#" + parent.getId() + "-highlight").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
								function(e) {
							    	var oFiRecordsModel = oComponent.getModel("FiReviewRecords");
									var totalFiRecords = oFiRecordsModel.getData();
									
									for(var i = 0; i < totalFiRecords.length; i++) {
										if(reviewedData.Uniqueid === totalFiRecords[i].Uniqueid) {
											totalFiRecords.splice(i, 1);
										}
									}
									oFiRecordsModel.refresh(true);
								});
								
								
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
								MessageBox.error(oError);
							}
						});
					},
					error: function(err) {
						MessageBox.error(err);
			    	}
			   });	
			} catch (ex) {
				MessageBox.error(ex);
			}
		}
	});
});