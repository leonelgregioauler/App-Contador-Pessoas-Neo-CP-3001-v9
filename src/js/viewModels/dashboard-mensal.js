/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/ 
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['knockout', 
        'appController', 
        'ojs/ojmodule-element-utils', 
        'accUtils', 
        '../httpUtil',
        '../dataBase',
        'ojs/ojarraydataprovider',
        'viewModels/dashboard',
        'ojs/ojchart',
        'ojs/ojactioncard',
        'ojs/ojlabel',
        'ojs/ojdialog',
        'ojs/ojtoolbar',
        'ojs/ojbutton',
        'ojs/ojprogress-circle',
        'ojs/ojslider',
        'jet-composites/chart-orientation-control/1.0.0/loader',
        'jet-composites/chart-stack-control/1.0.0/loader'],
  function (ko, app, moduleUtils, accUtils, Util, DataBase, ArrayDataProvider, Dash) {

    function DashboardMensalViewModel(params) {
      var self = this;
      
      self.stackValue = Dash.config.stackValue;
      self.orientationValue = Dash.config.orientationValue;
      self.lineTypeValue = Dash.config.lineTypeValue;
      self.labelPosition = Dash.config.labelPosition;
      
      self.showGraphicMonth = Dash.config.showGraphicMonth;

      self.showLoadingIndicator = Dash.config.showLoadingIndicator;
      self.showRequestRegister = Dash.config.showRequestRegister;
      self.showSlider = Dash.config.showSlider;

      self.indeterminate = Dash.config.indeterminate;
      self.progressValue = Dash.config.progressValue;

      self.maxValue = Dash.config.maxValue;
      self.minValue = Dash.config.minValue;
      self.actualValue = Dash.config.actualValue;
      self.transientValue = Dash.config.transientValue;
      self.stepValue = Dash.config.stepValue;

      self.identifyScreenSize = Dash.config.identifyScreenSize;
      
      self.restartButton = () => {
        self.indeterminate(-1);
        self.progressValue(0);
        self.createInterval();
      };
      
      self.buttonDisplay = Dash.config.buttonDisplay;

      self.total = Dash.config.total;
      self.controllerData = Dash.config.controllerData;
      
      let historicMonth = Dash.config.histMonth;
      self.colorMonth = Dash.config.colorMonth;
      self.dataSourceDataMonth = Dash.config.dataSourceDataMonth;
      
      getNetworkInformation = Dash.config.getNetworkInformation;

      const controller = Dash.config.controller;
      
      // Header Config
      self.headerConfig = ko.observable({'view':[], 'viewModel':null});
      moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
        self.headerConfig({'view':view, 'viewModel': app.getHeaderModel()})
      })
      
      self.queryController = async function () {

        let resultControl = await DataBase.queryController('SELECT * FROM CONTROLADORAS WHERE exibeDashBoard = 1');

        resultControl.forEach( (itemControl, idx) => {

          self.showRequestRegister(false);

          self.controllerData.descricaoControladora(itemControl.descricaoControladora);
          self.controllerData.IP(itemControl.IP);

          const date = new Date();
          const hour = date.getHours();
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const fullDate = date.toLocaleDateString('pt-br');
          const monthYear = date.toLocaleDateString('pt-br', {
            month : 'long',
            year : 'numeric'
          });

          Util.callGetService(itemControl.IP, controller.parameterTotal).then( (response) => {
            response.historico.forEach( (item) => {
              controller.dataTotal.push(item);
            }) 
            const totalActual = controller.dataTotal().find((item) => {
              return item.h === 34
            })
            const totalDay = controller.dataTotal().find((item) => {
              return item.h === 35
            })
            self.total.totalActual(parseInt(totalActual.v));
            self.total.totalDay(parseInt(totalDay.v));
            self.total.dayMonthYear(fullDate);
          })
          .then( () => {

            endpointData = async () => {
              (day <= 12) ? await Promise.all([endpoint1()]) : null;
              (day >= 13) && (day <= 24) ? await Promise.all([endpoint1(), endpoint2()]) : null;
              (day >= 25) ? await Promise.all([endpoint1(), endpoint2(), endpoint3()]) : null;
            }
  
            endpointData().then( () => {
  
              let orderData = controller.dataMonth().sort( (a, b) => {
                return a.d - b.d;
              })
  
              historicMonth = orderData.slice(0, day);
  
              const details = historicMonth.map((item) => {
                return {
                  id: item.d,
                  series: monthYear + ' - ' + self.total.totalDay() + ' visitas.',
                  quarter: item.d,
                  group: 'Contador',
                  value: parseInt(item.v)
                }
              });
  
              if (self.dataSourceDataMonth.length == 0) {
                self.dataSourceDataMonth.push([]);
                self.dataSourceDataMonth[idx].histMonth = new ArrayDataProvider(details); 
              }
  
              self.showGraphicMonth(false);
  
              if ( (resultControl.length - 1) == idx) {
                self.showGraphicMonth(true);
                self.showLoadingIndicator(false);
                self.showSlider(true);
              }
            })
          })
          .catch( (error) => {
            clearInterval(Dash.config.intervalMonthly());
            Dash.config.intervalMonthly('');
            self.indeterminate(0);
            self.progressValue(Math.floor(Math.random() * 100));
            getNetworkInformation(error);
          })

          endpoint1 = async () => {
            let endpoint1 = await Util.callGetService(itemControl.IP, controller.parameter1to12).then( (response) => {
              response.historico.forEach( (item) => {
                controller.dataMonth.push(item);
              })
            })
          }

          endpoint2 = async () => {
            let endpoint2 = await Util.callGetService(itemControl.IP, controller.parameter13to24).then( (response) => {
              response.historico.forEach( (item) => {
                controller.dataMonth.push(item);
              })
            })
          }

          endpoint3 = async () => {
            let endpoint3 = await Util.callGetService(itemControl.IP, controller.parameter25to36).then( (response) => {
              response.historico.forEach( (item) => {
                controller.dataMonth.push(item);
              })
            })
          }
        })
      }

      self.createInterval = function () {

        if (!Dash.config.intervalMonthly()) {

          const intervalMonthly = setInterval( () => {

            if (params.router._activeState.path === 'dashboard-mensal') {

              self.showLoadingIndicator(true);
              
              controller.dataTotal().splice(-controller.dataTotal().length);
              controller.dataMonth().splice(-controller.dataMonth().length);
              
              if (self.dataSourceDataMonth) {
                self.dataSourceDataMonth.splice(-self.dataSourceDataMonth.length);
              }
  
              self.queryController();
  
            }
          }, 30000);

          Dash.config.intervalMonthly(intervalMonthly);
        }
      }

      self.connected = function() {
        accUtils.announce('Dashboard page loaded.');
        document.title = "Dashboard";

        window.addEventListener('orientationchange', self.identifyScreenSize);

        self.queryController();
        self.createInterval();
        self.identifyScreenSize();
      };
      
      self.disconnected = function() {
        // Implement if needed
      };

      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    return DashboardMensalViewModel
  }
);
