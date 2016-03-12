sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
   "use strict";
   return UIComponent.extend("sap.ui.avanzarit.solutions.office.ims.Component", {
	   metadata : {
           manifest: "json"
     },
      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
            
      }
   });
});