/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your profile ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils'],
 function(ko, app, moduleUtils, accUtils) {

    function USBViewModel() {
      var self = this;

      // Header Config
      self.headerConfig = ko.observable({'view':[], 'viewModel':null});
      moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
        self.headerConfig({'view':view, 'viewModel': app.getHeaderModel()})
      })

      
      self.connected = function() {
        accUtils.announce('Profile page loaded.');
        document.title = "Profile";
      };

      
      // https://www.skypack.dev/view/cordova-plugin-usbserialport
      // https://github.com/PR-DC/PRDC_TestSerialUSB/blob/main/Android%20Cordova/TestSerialUSB/app/www/js/frontend.js

      var errorCallback = function(message) {
        alert('Error: ' + message);
      };

      self.comunicaUSB = function () {

        /* let opts = {
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          parity: 0,
          dtr: false,
          rts: false,
          sleepOnPause: true
        }; */

        /*  let opts = {
          baudRate: 9600
        }; */

        //https://github.com/xseignard/cordovarduino
        serial.requestPermission({vid: "1A86", pid: "7523", driver: "Ch34xSerialDriver"},
          function(successMessage) {
	          console.log('request ' + successMessage);
            alert('request ' + successMessage);
		        serial.open(
			        opts,
			        function(successMessage) {
				        alert('request ' + successMessage);
                escreveNaPlaca();
			        },
			        errorCallback
		        );
          },
          errorCallback
        );

        escreveNaPlaca = function () {

          setTimeout(function () {
            serial.write(
              '<',
              function(successMessage) {
                console.log('write 1 => ' + successMessage);
                alert('write 1 => ' + successMessage);
              },
              errorCallback
              );  
          }, 0);

          setTimeout(function() {
            serial.write(
              'C',
              function(successMessage) {
                console.log('write 2 => ' + successMessage);
                alert('write 2 => ' + successMessage);
              },
              errorCallback
            );
          }, 200);
          
          setTimeout(function() {
            serial.write(
              '0',
              function(successMessage) {
                console.log('write 3 => ' + successMessage);
                alert('write 3 => ' + successMessage);
              },
              errorCallback
            );
          }, 400);
          
          setTimeout(function() {
            serial.write(
              '>',
              function(successMessage) {
                console.log('write 4 => ' + successMessage);
                alert('write 4 => ' + successMessage);

                serial.read(function(data) {
                  var view = new Uint8Array(data);
                  console.log(view);
                  console.log(data);
                },
                errorCallback
                );
              },
              errorCallback
            );
          }, 600);
        }
      }
      
      
      self.disconnected = function() {
        // Implement if needed
      };

      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    return USBViewModel;
  }
);
