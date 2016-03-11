sap.ui.define([ "sap/ui/core/Control", "sap/m/ToggleButton", "sap/m/Button" ], function(Control, ToggleButton, Button) {
	"use strict";
	return Control.extend("sap.ui.avanzarit.solutions.office.ims.control.Video", {
		metadata : {
			properties : {
				videoWidth : "sap.ui.core.CSSSize",
				videoHeight : "sap.ui.core.CSSSize"
			},
			
			events : {
				bind : {
					parameters : {
						videoObjectId : {type : "string"},
						canvasObjectId:{type:"string"}
					}
				}
			}
		},
		
	
		// set up the inner controls
		init : function() {

						
		},
onAfterRendering:function(){

	this.fireEvent("bind",{
		videoObjectId:"#"+$("video").attr("id"),
		canvasObjectId:"#"+$("canvas").attr("id"),
		
	});
},
			
		// render a composite with a wrapper div
		renderer : function(oRm, oControl) {

		
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.write(">");
				
			 oRm.write("<video id="+oControl.getId()+"-video" +" width=\"" + oControl.getVideoWidth() +"\" height=\"" + oControl.getVideoHeight() + "\"style=\"display:none;\" autoplay>Click Capture</video>");
			 oRm.write("<canvas id="+oControl.getId()+"-canvas" +" width=\"600\" height=\"480\"style=\"display:none;\"></canvas>");
		 
			oRm.write("</div>");
			
		}
	});
});
