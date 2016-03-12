sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui.avanzarit.solutions.office.ims.controller.AppContainer", {
	
	   onInit: function(){
				 
	   },
	   
		   
	   onCapture: function(oEvent){
	       var photoSrc=oEvent.getParameter("photoSrc");
		   this.getView().byId("photoplaceholder").setSrc(photoSrc);
		   
	   }   
	      
   });
});