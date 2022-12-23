define(['knockout'], 
  function (ko) {
    var self = this;

    self.stackValue = ko.observable("on");
    self.orientationValue = ko.observable("vertical");
    self.lineTypeValue = ko.observable("curved");
    self.labelPosition = ko.observable("aboveMarker");

    self.showGraphicMonth = ko.observable(false);
    self.showGraphicHour = ko.observable(false);

    self.showLoadingIndicator = ko.observable(true);
    self.showRequestRegister = ko.observable(true);
    self.showSlider = ko.observable(false);

    self.indeterminate = ko.observable(-1);
    self.progressValue = ko.observable(0);

    self.maxValue = ko.observable();
    self.minValue = ko.observable();
    self.actualValue = ko.observable();
    self.transientValue = ko.observable();
    self.stepValue = ko.observable();

    self.identifyScreenSize = () => {
      if (screen.width < 500) {
        self.maxValue(200);
        self.minValue(100);
        self.actualValue(150);
        self.transientValue();
        self.stepValue(10);
      } else {
        self.maxValue(400);
        self.minValue(100);
        self.actualValue(350);
        self.transientValue();
        self.stepValue(10);
      }
    }

    self.buttonDisplay = ko.pureComputed( () => {
      return self.progressValue() > 0 ? "inline-flex" : "none";
    });

    self.total = {
      totalActual : ko.observable(),
      totalDay : ko.observable(),
      dayMonthYear : ko.observable()
    }

    self.controllerData = {
      descricaoControladora : ko.observable(),
      IP : ko.observable()
    }

    let historicMonth = [];
    let historicOfficeHourMorning = [];
    let historicOfficeHourAfternoon = [];
    self.colorOfficeHourMorning = ko.observable('rgb(0 6 249)');
    self.colorOfficeHourAfternoon = ko.observable('rgb(238 14 14)');
    self.colorMonth = ko.observable('rgb(238 14 14)');
    self.dataSourceDataHour = [];
    self.dataSourceDataMonth = [];
    
    const controller = {
      parameter1to12 : 1,
      parameter13to24 : 2,
      parameter25to36 : 3,
      parameter12h : 4,
      parameter24h : 5,
      parameterTotal : 6,
      dataMonth : ko.observableArray([]),
      dataHour : ko.observableArray([]),
      dataTotal : ko.observableArray([])
    }

    function onDeviceReady () {
      var networkState = navigator.connection.type;

      var states = {};
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';
  
      if ((states[networkState] != 'WiFi connection') && (states[networkState] != 'Unknown connection')) {

        navigator.notification.alert(
          'Por favor, conecte-se à rede wi-fi do contador de pessoas.',
          null,
          'Alerta de Conexão',
          'OK'
        );
      }
    };

    function onOffline() {
      navigator.notification.alert(
        'Conexão offline.',
        null,
        'Alerta de Conexão',
        'OK'
      );
    }

    function onOnline() {
      navigator.notification.alert(
        'Conexão online.',
        null,
        'Alerta de Conexão',
        'OK'
      );
    }

    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    
    return {
      config : {
        stackValue : self.stackValue,
        orientationValue : self.orientationValue,
        lineTypeValue : self.lineTypeValue,
        labelPosition : self.labelPosition,
        
        showGraphicMonth : self.showGraphicMonth,
        showGraphicHour : self.showGraphicHour,
        
        showLoadingIndicator : self.showLoadingIndicator,
        showRequestRegister : self.showRequestRegister,
        showSlider : self.showSlider,
        
        indeterminate : self.indeterminate,
        progressValue : self.progressValue,
        
        maxValue : self.maxValue,
        minValue : self.minValue,
        actualValue : self.actualValue,
        transientValue : self.transientValue,
        stepValue : self.stepValue,
        
        identifyScreenSize : self.identifyScreenSize,
        buttonDisplay : self.buttonDisplay,

        total : self.total,
        controllerData : self.controllerData,

        historicMonth : historicMonth,
        historicOfficeHourMorning : historicOfficeHourMorning,
        historicOfficeHourAfternoon : historicOfficeHourAfternoon,
        dataSourceDataHour : self.dataSourceDataHour,
        dataSourceDataMonth : self.dataSourceDataMonth,

        colorOfficeHourMorning :self.colorOfficeHourMorning,
        colorOfficeHourAfternoon : self.colorOfficeHourAfternoon,
        colorMonth : self.colorMonth,

        onDeviceReady : onDeviceReady,

        controller : controller
      }
    };
  });
  