sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui.avanzarit.solutions.office.ims.controller.AppContainer", {
	
	   onInit: function(){
				 			 
	   },
	   
	   onBind:function(oEvent){
		   var photoCaptureControl=oEvent.getSource();
		   photoCaptureControl.setPhotoPlaceholder(this.getView().byId(oEvent.getParameter("photoplaceholder")));
	   }
   
   
	      
   });
});