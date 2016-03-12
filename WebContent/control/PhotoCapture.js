sap.ui.define([ "sap/ui/core/Control", "sap/m/ToggleButton", "sap/m/Button", "sap/ui/avanzarit/solutions/office/ims/control/Video" ], function(Control, ToggleButton, Button, Video) {
	"use strict";
	return Control.extend("sap.ui.avanzarit.solutions.office.ims.control.PhotoCapture", {
		metadata : {
			properties : {
				videoWidth : "sap.ui.core.CSSSize",
				videoHeight : "sap.ui.core.CSSSize"
			},
			associations : {
				_cameraOnOffSwitch : {
					type : "sap.m.ToggleButton",
					multiple : false,
					visibility : "hidden"
				},
				_captureButton : {
					type : "sap.m.Button",
					multiple : false,
					visibility : "hidden"
				},
				_video : {
					type : "sap.ui.avanzarit.solutions.office.ims.control.Video",
					multiple : false,
					visibility : "hidden"
				}
			},

			events : {
				capture : {
					parameters : {
						photoSrc : {
							type : "string"
						}
					}
				}
			}
		},

		exit : function() {
			this.cameraSwitch.destroy();
			delete this.cameraSwitch;

			this.captureButton.destroy();
			delete this.captureButton;
			
			this.video.destroy();
			delete this.video;
		},
		
		
		// set up the inner controls
		init : function() {

			this.localMediaStream = null;
			this.photoPlaceholder = null;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
			var that = this;
			this.captureButton = new Button({
				text : "Capture",
				enabled : false,
				press : function() {
					that._takeSnapShot();
				}
			});
			this.cameraSwitch = new ToggleButton({
				text : "Switch On Camera",
				enabled : true,
				pressed : false,
				press : function(oEvent) {
					if (oEvent.getSource().getPressed()) {
						that._openCamera(oEvent.getSource());

					} else {
						that._closeCamera();
						oEvent.getSource().setText("Switch On Camera");
					}
				}
			});
			
			this.setAssociation("_cameraOnOffSwitch", this.cameraSwitch);
			this.setAssociation("_captureButton", this.captureButton);

		},
		_videoBind : function(e) {
			this.videoObject=$(e.getParameter("videoObjectId"));
		    this.canvasObject=$(e.getParameter("canvasObjectId"));
		},
		_errorCallback : function(e) {
			console.log('Rejected request to open Camera!', e);
		},


		_openCamera : function(self) {
			var that = this;
		
			navigator.getUserMedia({
				video : true
			}, function(stream) {
				that.videoObject.attr("src", window.URL.createObjectURL(stream));
				that.localMediaStream = stream;
				that.videoObject.show();
				self.setText("Switch Off Camera");
				that.captureButton.setEnabled(true);
				that.captureButton.rerender();

			}, that._errorCallback);
		},
		_closeCamera : function() {

			this.localMediaStream.getTracks()[0].stop();
			this.videoObject.hide();
			this.localMediaStream = null;
			this.captureButton.setEnabled(false);
			this.captureButton.rerender();
		},

		_takeSnapShot : function() {
		
			if (this.localMediaStream) {
				var canvas = this.canvasObject.get(0);
				var ctx = canvas.getContext("2d");
				ctx.drawImage(this.videoObject.get(0), 0, 0);
				this.fireEvent("capture", {
					photoSrc : canvas.toDataURL('image/webp')

				});

			}
		},
		
		onBeforeRendering :function(){
			this.video = new Video({
				videoWidth : this.getVideoWidth(),
				videoHeight : this.getVideoHeight()
			});
			this.setAssociation("_video", this.video);
		    this.video.attachBind(this._videoBind.bind(this));
			
		},

		// render a composite with a wrapper div
		renderer : function(oRm, oControl) {

			var form = new sap.ui.layout.form.SimpleForm("photobooth", {
				title : "Capture Photo",
				editable : false,
				layout : "ResponsiveGridLayout",
				columnsL : 1,
				columnsM : 1,
				class : "editableForm nopadding"
			});
			
			var cameraSwitch = oControl.cameraSwitch;
			cameraSwitch.setLayoutData(new sap.ui.layout.GridData({
				spanL : 6,
				spanM : 6,
				spanS : 6
			}));

			var captureButton = oControl.captureButton;
			captureButton.setLayoutData(new sap.ui.layout.GridData({
				spanL : 6,
				spanM : 6,
				spanS : 6
			}));
			var video=oControl.video;
			video.setLayoutData(new sap.ui.layout.GridData({
				spanL : 10,
				spanM : 10,
				spanS : 10,
				indentL:2,
				indentM:2,
				indentS:2,
				
			}));
			form.addContent(cameraSwitch);
			form.addContent(captureButton);
			form.addContent(video);

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.write(">");
			oRm.renderControl(form);
			oRm.write("</div>");
			
		}
	});
});
