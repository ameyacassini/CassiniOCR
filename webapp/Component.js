sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"demo/cassini/ocr/CassiniOCR/model/models"
], function (UIComponent, Device, models) {
	"use strict";
	var oComponent;
	return UIComponent.extend("demo.cassini.ocr.CassiniOCR.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			oComponent = this;
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			var postData = [
				{
					postId: "1",
					status: 1,
					workflow: 1,
					vendorNo: 'V23425',
					vendorName: 'ABC Corporation',
					poNo: 'P123',
					grossAmount: 990,
					currencyCode: 'USD',
					currencySymbol: '$',
					docId: "D123455",
					invoiceNo: "IN12345",
					process: "MM",
					docDate: "2018-07-19"
				},
				{
					postId: "2",
					status: 2,
					workflow: 2,
					vendorNo: 'V56545',
					vendorName: 'XYZ Inc.',
					poNo: 'P234',
					grossAmount: 123,
					currencyCode: 'USD',
					currencySymbol: '$',
					docId: "D232323",
					invoiceNo: "IN23232",
					process: "FI",
					docDate: "2018-07-19"
				},
				{
					postId: "3",
					status: 0,
					workflow: 0,
					vendorNo: 'V67686',
					vendorName: 'Alpha Pvt. Ltd.',
					poNo: 'P345',
					grossAmount: 145,
					currencyCode: 'USD',
					currencySymbol: '$',
					docId: "D343345",
					invoiceNo: "IN34332",
					process: "FI",
					docDate: "2018-07-19"
				}
			];
			
			var oModel = new sap.ui.model.json.JSONModel({
				PostData: postData
			});
			
			this.setModel(oModel);
			
			var vendorNoData = [
				{
					vendorNo: "VL00451100",
					vendorName: "Acer Laptop",
					pincode: "67453"
				},
				{
					vendorNo: "VL00453300",
					vendorName: "3M",
					pincode: "55144"
				},
				{
					vendorNo: "VL00452200",
					vendorName: "Lenovo",
					pincode: "67330"
				}
			];
			
			var vendorNoDataModel = new sap.ui.model.json.JSONModel(vendorNoData);
			this.setModel(vendorNoDataModel, "VendorNoData");
			
		    var nonSapErrorDataModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(nonSapErrorDataModel, "NonSapErrorData");
		    
			var sapErrorDataModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(sapErrorDataModel, "SapErrorData");
			
			var mgrApprovalDataModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(mgrApprovalDataModel, "MgrApprovalData");
			
			var warningDataModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(warningDataModel, "WarningData");
			
			var inProcessDataModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(inProcessDataModel, "InProcessData");
			
			var rejectedDataModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(rejectedDataModel, "RejectedData");
			
			var chartDataModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(chartDataModel, "chartData");
			
			var manualVerifyDocsModel = new sap.ui.model.json.JSONModel([]);
			this.setModel(manualVerifyDocsModel, "ManualVerifyDocuments");
			
			//var completeRecordsModel = new sap.ui.model.json.JSONModel([]);
			//this.setModel(chartDataModel, "CompleteRecords");
			
			//this.getCompletedRecords();
			
		},
		
		getNonSapErrorData: function(oController, ...ids) {
			try {
				for(var i = 0; i < ids.length; i++) {
					oController.getView().byId(ids[0]).setBusy(true);	
				}
				
				/*$.ajax("https://103.73.151.249:8080/OcrRestSpring/errorData/", {
					success: function(data) {
						console.log(data);
						var nonSapErrorDataModel = oComponent.getModel("NonSapErrorData");
						for(var i = 0; i < data.length; i++) {
							var dt = new Date(data[i].createdTime);
							data[i].createdTime = dt;
							
							data[i].invoiceDate = new Date(data[i].invoiceDate);
						}
						nonSapErrorDataModel.setData(data);
						nonSapErrorDataModel.refresh(true);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
						
						var chartItem = {
							Status: "Scanning Errors",
							Count: data.length
						};
						
						var chartDataModel = oComponent.getModel("chartData");
						var chartData = chartDataModel.getData();
						var isExist = false;
						for(var i = 0; i < chartData.length; i++) {
							if(chartData[i].Status === "Scanning Errors") {
								isExist = true;
								chartData[i].Count = data.length;
								break;
							}
						}
						
						if(!isExist) {
							chartData.push(chartItem);
						}
						console.log(JSON.stringify(chartData));
						chartDataModel.refresh(true);
						
						var oVizFrame = oController.getView().byId("idVizFrame");
			            var dataModel = oVizFrame.getModel();
			            dataModel.setData({
			            	chart: chartDataModel.getData()
			            });
			            dataModel.refresh(true);
					},
					error: function(err) {
						console.log(err);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
			    	}
			   });*/
			   $.ajax("/ocrclient/Documents/filter?role=20", {
					success: function(data) {
						var manualVerifyDocsModel = oComponent.getModel("ManualVerifyDocuments");
						manualVerifyDocsModel.setData(data);
						manualVerifyDocsModel.refresh(true);
						//console.log(data);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
						
						var chartItem = {
							Status: "Scanning Errors",
							Count: data.length
						};
						
						var chartDataModel = oComponent.getModel("chartData");
						var chartData = chartDataModel.getData();
						var isExist = false;
						for(var i = 0; i < chartData.length; i++) {
							if(chartData[i].Status === "Scanning Errors") {
								isExist = true;
								chartData[i].Count = data.length;
								break;
							}
						}
						
						if(!isExist) {
							chartData.push(chartItem);
						}
						console.log(JSON.stringify(chartData));
						chartDataModel.refresh(true);
						
						var oVizFrame = oController.getView().byId("idVizFrame");
			            var dataModel = oVizFrame.getModel();
			            dataModel.setData({
			            	chart: chartDataModel.getData()
			            });
			            dataModel.refresh(true);
					},
					error: function(err) {
						console.log(err);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
			    	}
			   });
			} catch (ex) {
				console.log(ex);
				for(var i = 0; i < ids.length; i++) {
					oController.getView().byId(ids[0]).setBusy(false);	
				}
			}
		},
		
		getFiReviewRecords: function(oController, ...ids) {
			try {
				for(var i = 0; i < ids.length; i++) {
					oController.getView().byId(ids[0]).setBusy(true);	
				}
				
				var allfilters = [];
				allfilters.push(new sap.ui.model.Filter("Servicecall", sap.ui.model.FilterOperator.EQ, "FIN"));
				var mainServiceModel = this.getModel("mainServiceModel");
				mainServiceModel.read("/GetOcrHdrs", {
					filters: allfilters,
					urlParameters: {
						"$expand": "GetOcrHdrToOcrItm"
					},
					success: function(oData) {
						console.log(oData);
						var results = oData.results;
						for(var i = 0; i < results.length; i++) {
							results[i].highlightStatus = "Success"
							results[i].workflow = 1
							results[i].Ponumber = results[i].GetOcrHdrToOcrItm.results[0].Ponumber;
							results[i].VendorCountry = results[i].GetOcrHdrToOcrItm.results[0].VendorCountry;
							results[i].Paymentterm = results[i].GetOcrHdrToOcrItm.results[0].Paymentterm;
							results[i].Paymentindays = results[i].GetOcrHdrToOcrItm.results[0].Paymentindays;
							results[i].Companycode = results[i].GetOcrHdrToOcrItm.results[0].Companycode;
							results[i].Taxcode = results[i].GetOcrHdrToOcrItm.results[0].Taxcode;
							results[i].Postingdate = new Date();
						}
						var fiReviewRecordsModel = new sap.ui.model.json.JSONModel(oData.results);
						oComponent.setModel(fiReviewRecordsModel, "FiReviewRecords"); 
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
						var chartItem = {
							Status: "Pending Finance Review",
							Count: results.length
						};
						
						var chartDataModel = oComponent.getModel("chartData");
						var chartData = chartDataModel.getData();
						var isExist = false;
						for(var i = 0; i < chartData.length; i++) {
							if(chartData[i].Status === "Pending Finance Review") {
								isExist = true;
								chartData[i].Count = results.length;
								break;
							}
						}
						
						if(!isExist) {
							chartData.push(chartItem);
						}
						console.log(JSON.stringify(chartData));
						chartDataModel.refresh(true);
						
						var oVizFrame = oController.getView().byId("idVizFrame");
			            var dataModel = oVizFrame.getModel();
			            dataModel.setData({
			            	chart: chartDataModel.getData()
			            });
			            dataModel.refresh(true);
					},
					error: function(oError) {
						console.log(oError);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		},
		
		getSapErrorData: function(oController, ...ids) {
			try {
				for(var i = 0; i < ids.length; i++) {
					oController.getView().byId(ids[0]).setBusy(true);	
				}
				
				var mainServiceModel = this.getModel("mainServiceModel");
				var sapErrorDataModel = oComponent.getModel("SapErrorData");
				mainServiceModel.read("/GetOcrScanErrs", {
					success: function(oData) {
						console.log(oData);
						sapErrorDataModel.setData(oData.results);
						sapErrorDataModel.refresh(true);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
						var chartItem = {
							Status: "Validation Errors",
							Count: oData.results.length
						};
						
						var chartDataModel = oComponent.getModel("chartData");
						var chartData = chartDataModel.getData();
						var isExist = false;
						for(var i = 0; i < chartData.length; i++) {
							if(chartData[i].Status === "Validation Errors") {
								isExist = true;
								chartData[i].Count = oData.results.length;
								break;
							}
						}
						
						if(!isExist) {
							chartData.push(chartItem);
						}
						console.log(JSON.stringify(chartData));
						chartDataModel.refresh(true);
						//oController.getView().byId(ids).setBusy(false);
						//oComponent.setModel(sapErrorDataModel, "SapErrorData"); 
						
						var oVizFrame = oController.getView().byId("idVizFrame");
			            var dataModel = oVizFrame.getModel();
			            dataModel.setData({
			            	chart: chartDataModel.getData()
			            });
			            dataModel.refresh(true);
					},
					error: function(oError) {
						console.log(oError);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
						//oController.getView().byId(ids).setBusy(false);
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		},
		
		getMgrApprovalData: function(oController, ...ids) {
			try {
				for(var i = 0; i < ids.length; i++) {
					oController.getView().byId(ids[0]).setBusy(true);	
				}
				var allfilters = [];
				allfilters.push(new sap.ui.model.Filter("Servicecall", sap.ui.model.FilterOperator.EQ, "MGR"));
				var mainServiceModel = this.getModel("mainServiceModel");
				var mgrApprovalDataModel = oComponent.getModel("MgrApprovalData");
				mainServiceModel.read("/GetOcrHdrs", {
					filters: allfilters,
					urlParameters: {
						"$expand": "GetOcrHdrToOcrItm"
					},
					success: function(oData) {
						console.log(oData);
						var results = oData.results;
						
						
						for(var i = 0; i < results.length; i++) {
							for(var j = 0; j < results[i].GetOcrHdrToOcrItm.results.length; j++) {
								results[i].GetOcrHdrToOcrItm.results[j].QtyToDisplay = results[i].GetOcrHdrToOcrItm.results[j].PoitemQuantity;
							}
						}
						
						mgrApprovalDataModel.setData(results);
						mgrApprovalDataModel.refresh(true);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						} 
						
						var chartItem = {
							Status: "Pending Manager Approval",
							Count: oData.results.length
						};
						
						var chartDataModel = oComponent.getModel("chartData");
						var chartData = chartDataModel.getData();
						var isExist = false;
						for(var i = 0; i < chartData.length; i++) {
							if(chartData[i].Status === "Pending Manager Approval") {
								isExist = true;
								chartData[i].Count = oData.results.length;
								break;
							}
						}
						
						if(!isExist) {
							chartData.push(chartItem);
						}
						console.log(JSON.stringify(chartData));
						chartDataModel.refresh(true);
						
						var oVizFrame = oController.getView().byId("idVizFrame");
			            var dataModel = oVizFrame.getModel();
			            dataModel.setData({
			            	chart: chartDataModel.getData()
			            });
			            dataModel.refresh(true);
					},
					error: function(oError) {
						console.log(oError);
						for(var i = 0; i < ids.length; i++) {
							oController.getView().byId(ids[0]).setBusy(false);	
						}
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		},
		
		getCompletedRecords: function(oController) {
			try {
				var completedRecords = [];
				var mainServiceModel = this.getModel("mainServiceModel");
				mainServiceModel.read("/GetApprovalDataSet", {
					success: function(oData) {
						console.log(oData);
						var results = oData.results;
						for(var i = 0; i < results.length; i++) {
							var recordExist = false;
							for(var j = 0; j < completedRecords.length; j++) {
								if(results[i].Uniqueid === completedRecords[j].Uniqueid) {
									recordExist = true;
									break;
								}
							}
							if(!recordExist && results[i].FinReviewed === "X" && results[i].MgrApproved === "X") {
								completedRecords.push(results[i]);
							}
						}
						
						//var completeRecordsModel = oComponent.getModel("CompleteRecords");
						//completeRecordsModel.setData(completedRecords);
						var chartItem = {
							Status: "Posted",
							Count: completedRecords.length
						};
						
						var chartDataModel = oComponent.getModel("chartData");
						var chartData = chartDataModel.getData();
						var isExist = false;
						for(var i = 0; i < chartData.length; i++) {
							if(chartData[i].Status === "Posted") {
								isExist = true;
								chartData[i].Count = completedRecords.length;
								break;
							}
						}
						
						if(!isExist) {
							chartData.push(chartItem);
						}
						console.log(JSON.stringify(chartData));
						chartDataModel.refresh(true);
						
						var oVizFrame = oController.getView().byId("idVizFrame");
			            var dataModel = oVizFrame.getModel();
			            dataModel.setData({
			            	chart: chartDataModel.getData()
			            });
			            dataModel.refresh(true);
					},
					error: function(oError) {
						console.log(oError);
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		},
		
		capitalizeFirstLetter: function (string) {
    		return string.charAt(0).toUpperCase() + string.slice(1);
		}
	});
});