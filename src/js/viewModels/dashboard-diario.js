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

    function DashboardDiarioViewModel(params) {
      var self = this;

      self.stackValue = Dash.config.stackValue;
      self.orientationValue = Dash.config.orientationValue;
      self.lineTypeValue = Dash.config.lineTypeValue;
      self.labelPosition = Dash.config.labelPosition;
      
      self.showGraphicHour = Dash.config.showGraphicHour;
      
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

      let historicOfficeHourMorning = Dash.config.historicOfficeHourMorning;
      let historicOfficeHourAfternoon = Dash.config.historicOfficeHourAfternoon;
      self.colorOfficeHourMorning = Dash.config.colorOfficeHourMorning;
      self.colorOfficeHourAfternoon = Dash.config.colorOfficeHourAfternoon;
      self.dataSourceDataHour = Dash.config.dataSourceDataHour;

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
              (hour <= 11) ? await Promise.all([endpoint4()]) : null;
              (hour >= 12) ? await Promise.all([endpoint4(), endpoint5()]) : null;
            }
            
            endpointData().then( () => {
            
              let orderData = controller.dataHour().sort( (a, b) => {
                return a.h - b.h;
              })
            
              historicOfficeHourMorning = orderData.slice(itemControl.horaInicioTurno1, itemControl.horaFimTurno1 + 1);
              historicOfficeHourAfternoon = orderData.slice(itemControl.horaInicioTurno2, itemControl.horaFimTurno2 + 1);
            
              const detailsMorning = historicOfficeHourMorning.map((item) => {
                return {
                  id: item.h,
                  series: 'Turno 1',
                  quarter: item.h,
                  group: 'Contador',
                  value: parseInt(item.v)
                }
              });
              
              const detailsAfternoon = historicOfficeHourAfternoon.map((item) => {
                return {
                  id: item.h,
                  series: 'Turno 2',
                  quarter: item.h,
                  group: 'Contador',
                  value: parseInt(item.v)
                }
              });
              
              const detailsMorningAfternoon = [...detailsMorning, ...detailsAfternoon];
              
              if (self.dataSourceDataHour.length == 0) {
                self.dataSourceDataHour.push([]);
                self.dataSourceDataHour[idx].histHour = new ArrayDataProvider(detailsMorningAfternoon); 
              }
              
              self.showGraphicHour(false);
              
              if ( (resultControl.length - 1) == idx) {
                self.showGraphicHour(true);
                self.showLoadingIndicator(false);
                self.showSlider(true);
              }
            })
          })
          .catch( (error) => {
            clearInterval(Dash.config.intervalDiary());
            Dash.config.intervalDiary('');
            self.indeterminate(0);
            self.progressValue(Math.floor(Math.random() * 100));
            getNetworkInformation(error);
          })
          
          endpoint4 = async () => {
            let endpoint1 = await Util.callGetService(itemControl.IP, controller.parameter12h).then( (response) => {
              response.historico.forEach( (item) => {
                controller.dataHour.push(item);
              })
            })
          }
          
          endpoint5 = async () => {
            let endpoint2 = await Util.callGetService(itemControl.IP, controller.parameter24h).then( (response) => {
              response.historico.forEach( (item) => {
                controller.dataHour.push(item);
              })
            })
          }
        })
      }

      self.createInterval = function () {

        if (!Dash.config.intervalDiary()) {
          
          const intervalDiary = setInterval( () => {

            if (params.router._activeState.path === 'dashboard-diario') {

              self.showLoadingIndicator(true);

              controller.dataTotal().splice(-controller.dataTotal().length);
              controller.dataHour().splice(-controller.dataHour().length);
              
              if (self.dataSourceDataHour) {
                self.dataSourceDataHour.splice(-self.dataSourceDataHour.length);
              }
  
              self.queryController();
  
            }
          }, 30000);

          Dash.config.intervalDiary(intervalDiary);
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

    return DashboardDiarioViewModel
  }
);
