sap.ui.define([ "sap/ui/core/Control", "sap/m/ToggleButton", "sap/m/Button", "sap/ui/avanzarit/solutions/office/ims/control/Video" ], function(Control, ToggleButton, Button, Video) {
	"use strict";
	return Control.extend("sap.ui.avanzarit.solutions.office.ims.control.PhotoCapture", {
		metadata : {
			properties : {
				videoWidth : "sap.ui.core.CSSSize",
				videoHeight : "sap.ui.core.CSSSize",
				photoPlaceholderId : "string"
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
				bind : {
					parameters : {
						photoplaceholder : {
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
		
		onBeforeRendering :function(){
			this.video = new Video({
				videoWidth : this.getVideoWidth(),
				videoHeight : this.getVideoHeight()
			});
			this.setAssociation("_video", this.video);
			var method=this._videoBind.bind(this);
			this.video.attachBind(method);
			
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
						that._openCamera(that.captureButton.getId(), oEvent.getSource());

					} else {
						that._closeCamera(that);
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
			console.log('Reeeejected!', e);
		},

		setPhotoPlaceholder : function(placeholder) {
			this.photoPlaceholder = placeholder;
		},
		_openCamera : function(buttonId, self) {
			var that = this;
		
			navigator.getUserMedia({
				video : true
			}, function(stream) {
				
				that.videoObject.attr("src", window.URL.createObjectURL(stream));
				that.localMediaStream = stream;
				that.videoObject.show();
			
				var captureButton = sap.ui.getCore().byId(buttonId);
				self.setText("Switch Off Camera");
				captureButton.setEnabled(true);
				captureButton.rerender();

			}, that._errorCallback);
		},
		_closeCamera : function() {

			this.localMediaStream.getTracks()[0].stop();
			this.videoObject.hide();
			this.localMediaStream = null;
			var captureButton = sap.ui.getCore().byId(this.getAssociation("_captureButton"));
			captureButton.setEnabled(false);
			captureButton.rerender();
		},

		_takeSnapShot : function() {
		
			if (this.localMediaStream) {
				var canvas = this.canvasObject.get(0);
				var ctx = canvas.getContext("2d");
				ctx.drawImage(this.videoObject.get(0), 0, 0);
				this.photoPlaceholder.setSrc(canvas.toDataURL('image/webp'));

			}
		},

		// render a composite with a wrapper div
		renderer : function(oRm, oControl) {

			var form = new sap.ui.layout.form.SimpleForm("photobooth", {
				title : "Capture Photo",
				editable : true,
				layout : "ResponsiveGridLayout",
				columnsL : 1,
				columnsM : 1,
				class : "editableForm nopadding"
			});
			var cameraSwitch = sap.ui.getCore().byId(oControl.getAssociation("_cameraOnOffSwitch"));

			cameraSwitch.setLayoutData(new sap.ui.layout.GridData({
				spanL : 6,
				spanM : 6,
				spanS : 6
			}));

			var captureButton = sap.ui.getCore().byId(oControl.getAssociation("_captureButton"));
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

			// oRm.write("<div><video width=\"" + oControl.getVideoWidth() + "\"
			// height=\"" + oControl.getVideoHeight() +
			// "\"style=\"display:none;\" autoplay>Click
			// Capture</video></div>");
			// oRm.write("<canvas width=\"600\"
			// height=\"480\"style=\"display:none;\"></canvas>");

			oRm.write("</div>");
			oControl.fireEvent("bind", {
				photoplaceholder : oControl.getPhotoPlaceholderId()

			});
		}
	});
});
