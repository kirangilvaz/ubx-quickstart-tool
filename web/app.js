var EndpointTabs = angular.module('ubxtour', []);
EndpointTabs.controller('EndpointTabsCtrl', ['$scope','$rootScope','apiCore','dataStore',
  function($scope, $rootScope, apiCore, dataStore) {

      //function eventHandler ()  {
      //    this.startEventSource = function(id, fileName){
      //    var eventSource = new EventSource('streamingAPI?fileName=' + fileName);
      //    eventSource.onmessage=function(event)
      //    {
      //        if(event.data==='`'){
      //            document.getElementById('result'+id).innerHTML+="<br/><br/>";
      //        } else {
      //            document.getElementById('result'+id).innerHTML+=event.data;
      //        }
      //    };
      //}
      //};

      $rootScope.hostName = dataStore.hostName;
      $scope.eventConsumerFileSystemUrl = "http://"+$rootScope.hostName+":8088/eventconsumers";
      $scope.endpointData = [
          {
              endpointURL : "http://"+$rootScope.hostName+":5551/demoeventconsumer",
              endpointFileName : "/wamp/www/eventconsumers/consumer1.txt",
              id : "1"
          },
          {
              endpointURL : "http://"+$rootScope.hostName+":5552/demoeventconsumer",
              endpointFileName : "/wamp/www/eventconsumers/consumer2.txt",
              id : "2"
          },
          {
              endpointURL : "http://"+$rootScope.hostName+":5553/demoeventconsumer",
              endpointFileName : "/wamp/www/eventconsumers/consumer3.txt",
              id : "3"
          },
          {
              endpointURL : "http://"+$rootScope.hostName+":5554/demoeventconsumer",
              endpointFileName : "/wamp/www/eventconsumers/consumer4.txt",
              id : "4"
          },
          {
              endpointURL : "http://"+$rootScope.hostName+":5555/demoeventconsumer",
              endpointFileName : "/wamp/www/eventconsumers/consumer5.txt",
              id : "5"
          }
      ];


      //var eventHandlerObject = null;
      //var initializeEventHandlers = function(){
      //    for(var i = 0; i<$scope.endpointData.length; i++){
      //          eventHandlerObject = new eventHandler();
      //        eventHandlerObject.startEventSource($scope.endpointData[i].id, $scope.endpointData[i].endpointFileName);
      //    }
      //}
      ////initializeEventHandlers();
      $scope.endpointConsumerResponse = "";
      $scope.endpointConsumerUrl = $scope.endpointData[0].endpointURL;
      var getEndpointFileName = function(endpointConsumerUrl){
          endpointConsumerUrl = endpointConsumerUrl.trim();
          for(var i = 0; i<$scope.endpointData.length; i++){
              if($scope.endpointData[i].endpointURL === endpointConsumerUrl){
                  return $scope.endpointData[i].endpointFileName;
              }
          }
          return null;
      };
      $scope.updateEndpointConsumerUrl = function(){
            var endpointFileName = getEndpointFileName($scope.endpointConsumerUrl);
          if(endpointFileName!==null){
              if (window.XMLHttpRequest)
              {// code for IE7+, Firefox, Chrome, Opera, Safari
                  xmlhttp=new XMLHttpRequest();
              }
              else
              {// code for IE6, IE5
                  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
              }
              xmlhttp.onreadystatechange=function()
              {
                  if (xmlhttp.readyState==4 && xmlhttp.status==200)
                  {
                      $scope.endpointConsumerResponse = xmlhttp.responseText;
                      document.getElementById('eventConsumerResponse').innerHTML = $scope.endpointConsumerResponse;
                      $scope.$applyAsync();
                      return;
                  } else if (xmlhttp.readyState==4 && xmlhttp.status!=200)
                  {
                      $scope.endpointConsumerResponse = 'Status:'+xmlhttp.status+'. '+xmlhttp.responseText;
                      document.getElementById('eventConsumerResponse').innerHTML = $scope.endpointConsumerResponse;
                      $scope.$applyAsync();
                      return;
                  }
              }
              xmlhttp.open("GET", 'getConsumerLog?fileName=' + endpointFileName, true );
              xmlhttp.send();
          }
      }
      $scope.updateEndpointConsumerUrl();


}]);


EndpointTabs.controller('RegisterEndpoints', ['$scope','$q','apiCore', 'dataStore',
    function($scope, $q, apiCore, dataStore) {

        //initialize source endpoint values
        $scope.endpointUrl = dataStore.endpointUrl;

        $scope.endpointAuthorization = dataStore.endpointAuthorization;
        $scope.endpointAuthorizationModal = dataStore.endpointAuthorization;

        $scope.endpointContentType = dataStore.endpointContentType;

        $scope.endpointPayloadModal = dataStore.sourceEndpointPayload;

        $scope.endpointTypeChanged = function(type){
            switch(type){
                case 1:
                    $scope.endpointPayloadModal = dataStore.sourceEndpointPayload;
                    document.getElementById('endpointPayload').value = $scope.endpointPayloadModal;
                    break;
                case 2:
                    $scope.endpointPayloadModal = dataStore.destinationEndpointPayload;
                    document.getElementById('endpointPayload').value = $scope.endpointPayloadModal;
                    break;
                case 3:
                    $scope.endpointPayloadModal = dataStore.sourceAudienceEndpointPayload;
                    document.getElementById('endpointPayload').value = $scope.endpointPayloadModal;
                    break;
                case 4:
                    $scope.endpointPayloadModal = dataStore.destinationAudienceEndpointPayload;
                    document.getElementById('endpointPayload').value = $scope.endpointPayloadModal;
                    break;
            }
        };

        $scope.endpointAuthorizationChanged = function(){
            $scope.endpointAuthorization = $scope.endpointAuthorizationModal;
        };

        $scope.endpointPayloadChanged = function(){
            $scope.endpointPayloadModal = document.getElementById('endpointPayload').value;
        };


        $scope.endpointResponse = "";
        $scope.sendendpointRegistration = function(){
                var deferred = $q.defer();

                // build config with headers
                var config = {
                    headers: {
                        'Authorization': $scope.endpointAuthorization,
                        'Content-Type' : $scope.endpointContentType
                    },
                    withCredentials: true
                };
                // submit login credentials
            $scope.endpointResponse = apiCore.put($scope.endpointUrl, $scope.endpointPayloadModal, config).then(function(response) { // SUCCESS
                $scope.endpointResponse = 'Status:'+response.status+'. \nResponse:'+response.data;
                document.getElementById('endpointResponseId').value = $scope.endpointResponse;
                    deferred.resolve(response.data);

                }, function(response) { // ERROR
                    // return the error code
                $scope.endpointResponse = 'Status:'+response.status+'. \nResponse:'+response.data.message;
                document.getElementById('endpointResponseId').value = $scope.endpointResponse;
                    deferred.reject(response.status);
                });
                return deferred.promise;
        };


    }]);

EndpointTabs.controller('RegisterEvent', ['$scope','$q','apiCore', 'dataStore',
    function($scope, $q, apiCore, dataStore) {

        //initialize event values
        $scope.eventTypeUrlModel = dataStore.eventTypeUrl;
        $scope.eventTypeAuthorizationModel = dataStore.endpointAuthorization;
        $scope.eventTypeContentTypeModel = dataStore.endpointContentType;
        $scope.eventTypePayloadModel = dataStore.eventTypePayload;

        $scope.registerEvent = function(){
            var deferred = $q.defer();

            // build config with headers
            var config = {
                headers: {
                    'Authorization': $scope.eventTypeAuthorizationModel,
                    'Content-Type' : $scope.eventTypeContentTypeModel
                },
                withCredentials: true
            };

            // submit login credentials
            apiCore.post($scope.eventTypeUrlModel, $scope.eventTypePayloadModel, config).then(function(response) { // SUCCESS
                $scope.eventTypeResponseModel = 'Status:'+response.status+'. '+response.data;
                deferred.resolve(response.data);

            }, function(response) { // ERROR
                // return the error code
                $scope.eventTypeResponseModel = 'Status:'+response.status+'. '+response.data.message;
                deferred.reject(response.status);
            });
            return deferred.promise;
        };


    }]);

EndpointTabs.controller('SendEvent', ['$scope','$q','apiCore', 'dataStore',
    function($scope, $q, apiCore, dataStore) {

        //initialize event values
        $scope.eventUrlModel = dataStore.eventUrl;
        $scope.eventAuthorizationModel = dataStore.endpointAuthorization;
        $scope.eventContentTypeModel = dataStore.endpointContentType;
        $scope.eventPayloadModel = dataStore.sampleEventPayload;

        //$scope.eventPayloadChanged = function(){
        //    switch(type){
        //        case 1:
        //            $scope.endpointPayloadModal = dataStore.sourceEndpointPayload;
        //            document.getElementById('endpointPayload').value = $scope.endpointPayloadModal;
        //            break;
        //
        //        case 2:
        //            $scope.endpointPayloadModal = dataStore.destinationEndpointPayload;
        //            document.getElementById('endpointPayload').value = $scope.endpointPayloadModal;
        //    }
        //};

        $scope.endpointAuthorizationChanged = function(){
            $scope.endpointAuthorization = $scope.endpointAuthorizationModal;
        };

        $scope.endpointPayloadChanged = function(){
            $scope.endpointPayloadModal = document.getElementById('endpointPayload').value;
        };



        $scope.sendEvent = function(){
            var deferred = $q.defer();

            // build config with headers
            var config = {
                headers: {
                    'Authorization': $scope.eventAuthorizationModel,
                    'Content-Type' : $scope.eventContentTypeModel
                },
                withCredentials: true
            };

            // submit login credentials
            apiCore.post($scope.eventUrlModel, $scope.eventPayloadModel, config).then(function(response) { // SUCCESS
                $scope.eventResponseModel = 'Status:'+response.status+'. '+response.data;
                deferred.resolve(response.data);

            }, function(response) { // ERROR
                // return the error code
                $scope.eventResponseModel = 'Status:'+response.status+'. '+response.data.message;
                deferred.reject(response.status);
            });
            return deferred.promise;
        };


    }]);

EndpointTabs.controller('SegmentsAPI', ['$scope','$rootScope','$q','apiCore', 'dataStore',
    function($scope, $rootScope, $q, apiCore, dataStore) {


        //$( "#api1content" ).hide();
        //$( "#api1" ).click(function() {
        //    $( "#api1content" ).toggle( "slow" );
        //});
        //
        //$( "#api2content" ).hide();
        //$( "#api2" ).click(function() {
        //    $( "#api2content" ).toggle( "slow" );
        //});
        //
        //$( "#api3content" ).hide();
        //$( "#api3" ).click(function() {
        //    $( "#api3content" ).toggle( "slow" );
        //});
        //
        //$( "#api4content" ).hide();
        //$( "#api4" ).click(function() {
        //    $( "#api4content" ).toggle( "slow" );
        //});
        //
        //$( "#api5content" ).hide();
        //$( "#api5" ).click(function() {
        //    $( "#api5content" ).toggle( "slow" );
        //});
        //
        //$( "#api6content" ).hide();
        //$( "#api6" ).click(function() {
        //    $( "#api6content" ).toggle( "slow" );
        //});
        //
        //$( "#api7content" ).hide();
        //$( "#api7" ).click(function() {
        //    $( "#api7content" ).toggle( "slow" );
        //});
        //
        //$( "#api8content" ).hide();
        //$( "#api8" ).click(function() {
        //    $( "#api8content" ).toggle( "slow" );
        //});
        //
        //$( "#api9content" ).hide();
        //$( "#api9" ).click(function() {
        //    $( "#api9content" ).toggle( "slow" );
        //});


        $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/segments';
        $scope.getSegmentsAuthorizationModel = dataStore.endpointAuthorization;
        $scope.getSegmentsContentTypeModel = dataStore.endpointContentType;
        $scope.getSegmentsRequestTypeModel = 'GET';
        $scope.getSegmentsPayloadModal = "{\"segmentId\": 1, \"jobType\": \"ExportSegmentData\"}";
        $scope.legacyHttpGet = function() {
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange=function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    $scope.getSegmentsResponseModel = 'Status:'+xmlhttp.status+'. '+xmlhttp.responseText;
                    $scope.$applyAsync();
                    return;
                } else if (xmlhttp.readyState==4 && xmlhttp.status!=200)
                {
                    $scope.getSegmentsResponseModel = 'Status:'+xmlhttp.status+'. '+xmlhttp.responseText;
                    $scope.$applyAsync();
                    return;
                }
            }
            xmlhttp.open($scope.getSegmentsRequestTypeModel, $scope.getSegmentsUrlModel, true );
            xmlhttp.setRequestHeader("Content-Type",$scope.getSegmentsContentTypeModel);
            xmlhttp.setRequestHeader("Authorization",$scope.getSegmentsAuthorizationModel);
            if($scope.getSegmentsRequestTypeModel === 'GET'){
                xmlhttp.send();
            } else if($scope.getSegmentsRequestTypeModel === 'POST' || $scope.getSegmentsRequestTypeModel === 'PUT'){
                xmlhttp.send($scope.getSegmentsPayloadModal);
            }

        };

        $scope.updateSegmentsUrlValue = function(apiValue){
            switch(apiValue){
                case 'api1':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/segments';
                    $scope.getSegmentsRequestTypeModel = 'GET';
                    $scope.getSegmentsContentTypeModel = "application/JSON; charset=utf-8";
                    break;
                case 'api2':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/segments/1';
                    $scope.getSegmentsRequestTypeModel = 'GET';
                    $scope.getSegmentsContentTypeModel = "application/JSON; charset=utf-8";
                    break;
                case 'api3':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/segments/1/data';
                    $scope.getSegmentsRequestTypeModel = 'GET';
                    $scope.getSegmentsContentTypeModel = "application/JSON; charset=utf-8";
                    break;
                case 'api4':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/jobs';
                    $scope.getSegmentsRequestTypeModel = 'POST';
                    $scope.getSegmentsContentTypeModel = "application/JSON; charset=utf-8";
                    $scope.getSegmentsPayloadModal = "{\"segmentId\": 1, \"jobType\": \"ExportSegmentData\"}";
                    break;
                case 'api5':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/jobs/{jobId}';
                    $scope.getSegmentsRequestTypeModel = 'GET';
                    $scope.getSegmentsContentTypeModel = "application/JSON; charset=utf-8";
                    break;
                case 'api6':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/jobs/{jobId}/data/{jobDataId}';
                    $scope.getSegmentsRequestTypeModel = 'GET';
                    $scope.getSegmentsContentTypeModel = "application/JSON; charset=utf-8";
                    break;
                case 'api7':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/segments';
                    $scope.getSegmentsRequestTypeModel = 'POST';
                    $scope.getSegmentsPayloadModal = "{\"name\": \"TestAudience\"}";
                    $scope.getSegmentsContentTypeModel = "application/JSON; charset=utf-8";
                    break;
                case 'api8':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/segments/1/data';
                    $scope.getSegmentsRequestTypeModel = 'POST';
                    $scope.getSegmentsPayloadModal = "Email,FirstName,LastName,Sex\nhulk@ibm.com,Bruce,Banner,M";
                    $scope.getSegmentsContentTypeModel = "text/csv; charset=utf-8";
                    break;
                case 'api9':
                    $scope.getSegmentsUrlModel = 'http://'+$rootScope.hostName+':8096/SegmentEndpoint/v1/segments/1/data';
                    $scope.getSegmentsRequestTypeModel = 'PUT';
                    $scope.getSegmentsPayloadModal = "Email,FirstName,LastName,Sex\nfury@ibm.com,Nick,Fury,M";
                    $scope.getSegmentsContentTypeModel = "text/csv; charset=utf-8";
                    break;
            };
        };


    }]);

EndpointTabs.controller('AudienceMonitor', ['$scope','$rootScope','$q','apiCore', 'dataStore','$sce',
    function($scope, $rootScope, $q, apiCore, dataStore, $sce) {

        $rootScope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        $scope.sourceiFrame = "http://"+$rootScope.hostName+":8088/audience/producer/";
        $scope.destinationiFrame = "http://"+$rootScope.hostName+":8088/audience/consumer/";

        $scope.refreshSourceAudienceiFrame = function(){
            document.getElementById('sourceAudienceiFrame').src = $scope.sourceiFrame;
        };

        $scope.refreshDestinationAudienceiFrame = function(){
            document.getElementById('destinationAudienceiFrame').src = $scope.destinationiFrame;
        };
    }]);