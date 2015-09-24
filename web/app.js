var EndpointTabs = angular.module('ubxtour', []);
EndpointTabs.controller('EndpointTabsCtrl', ['$scope',
  function($scope) {

      function eventHandler ()  {
          this.startEventSource = function(id, fileName){
          var eventSource = new EventSource('streamingAPI?fileName=' + fileName);
          eventSource.onmessage=function(event)
          {
              document.getElementById('result'+id).innerHTML+=event.data;
          };
      }
      };

      $scope.endpointData = [{
          endpointURL : "http://kirangilvaz.com/endpoint1",
          endpointFileName : "ubx-events.txt",
          id : "1"
            },
          {
              endpointURL : "http://kirangilvaz.com/endpoint2",
              endpointFileName : "ubx-events1.txt",
              id : "2"
          },
          {
              endpointURL : "http://kgdev.x1.ubx.com:5555/timedevent",
              endpointFileName : "event.txt",
              id : "3"
          }
      ];


      var eventHandlerObject = null;
      var initializeEventHandlers = function(){
          for(var i = 0; i<$scope.endpointData.length; i++){
                eventHandlerObject = new eventHandler();
              eventHandlerObject.startEventSource($scope.endpointData[i].id, $scope.endpointData[i].endpointFileName);
          }
      }
      initializeEventHandlers();



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
            }
        };

        $scope.endpointAuthorizationChanged = function(){
            $scope.endpointAuthorization = $scope.endpointAuthorizationModal;
        };

        $scope.endpointPayloadChanged = function(){
            $scope.endpointPayloadModal = document.getElementById('endpointPayload').value;
        };



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
                apiCore.put($scope.endpointUrl, $scope.endpointPayloadModal, config).then(function(response) { // SUCCESS
                    $scope.endpointResponse = response.data;
                    deferred.resolve(response.data);

                }, function(response) { // ERROR
                    // return the error code
                    $scope.endpointResponse = response.status+': '+response.data.message;
                    deferred.reject(response.status);
                });
                return deferred.promise;
        };


    }]);


EndpointTabs.controller('AudienceMonitor', ['$scope','$q','apiCore', 'dataStore',
    function($scope, $q, apiCore, dataStore) {
        $( "#contentp1" ).hide();
        $( "#btoggle1" ).click(function() {
            $( "#contentp1" ).toggle( "slow" );
        });

        $( "#contentp2" ).hide();
        $( "#btoggle2" ).click(function() {
            $( "#contentp2" ).toggle( "slow" );
        });


        $scope.refreshSourceAudienceiFrame = function(){
            document.getElementById('sourceAudienceiFrame').src = "http://localhost/audiences/sourceAudience/";
        };

        $scope.refreshDestinationAudienceiFrame = function(){
            document.getElementById('destinationAudienceiFrame').src = "http://localhost/audiences/destinationAudience/";
        };
    }]);