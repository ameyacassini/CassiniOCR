sap.ui.define([
	"demo/cassini/ocr/CassiniOCR/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("demo.cassini.ocr.CassiniOCR.controller.App", {
		onChangeLanguage: function(oEvent) {
			try {
				if(oEvent.getParameter("state")) {
					sap.ui.getCore().getConfiguration().setLanguage("en");
				} else {
					sap.ui.getCore().getConfiguration().setLanguage("de");
				}
			} catch (ex) {
				MessageBox.error(ex);
			}
		}
	});
});