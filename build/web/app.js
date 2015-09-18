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

      var json = {};

      var sampleCall = function(loginData) {
          var deferred = $q.defer();

          // build config with headers
          var config = {
              headers: {
                  'Authorization': "Basic " + btoa(loginData.j_username + ':' + loginData.j_password)
              },
              withCredentials: true
          };

          // submit login credentials
          apiCore.get("user/signin", {}, config).then(function(response) { // SUCCESS




              deferred.resolve(response.data);

          }, function(response) { // ERROR
              // return the error code
              deferred.reject(response.status);
          });
          return deferred.promise;
      };

      var eventHandlerObject = null;
      var initializeEventHandlers = function(){
          for(var i = 0; i<$scope.endpointData.length; i++){
                eventHandlerObject = new eventHandler();
              eventHandlerObject.startEventSource($scope.endpointData[i].id, $scope.endpointData[i].endpointFileName);
          }
      }
      initializeEventHandlers();



}]);


EndpointTabs.controller('RegisterEndpoints', ['$scope','$q','apiCore',
    function($scope, $q, apiCore) {
        $scope.sourceEndpointUrl = "https://api-pilot.ubx.ibmmarketingcloud.com/v1/endpoint";
        $scope.sourceEndpointAuthorization = "Bearer 90cced80-1920-4e67-80c8-86168313f1c9";
        $scope.sourceEndpointPayload = "{\n\n    \"name\":\"KGSourceEndpoint\",\n    \"description\":\"KGSourceEndpoint\",\n    \"providerName\":\"IBM\",\n  \"url\":\"http://169.45.67.107:5555/timedevent\",\n    \"endpointTypes\":{\n        \"event\":{\n            \"source\":{\n                \"enabled\":true\n            },\n            \"destination\":{\n                \"enabled\":false,\n                \"url\":\"http://169.45.67.107:5555/timedevent\",\n                \"destinationType\":\"push\"\n            }\n        }\n    },\n    \"marketingDatabasesDefinition\":{\n        \"marketingDatabases\":[\n            {\n                \"name\":\"marketingDB--name-QA1-000\",\n                \"identifiers\":[\n                    {\n                        \"name\":\"marketingDB--identifiers--name-QA1-000\",\n                        \"type\":\"marketingDB--identifiers--type-QA1-000\"\n                    }\n                ],\n                \"attributes\":[\n                    {\n                        \"name\":\"marketingDB--attributes--name-QA1-000\",\n                        \"type\":\"marketingDB--attributes--type-QA1-000\",\n                        \"isRequired\":false\n                    }\n                ]\n            }\n        ]\n    }\n\n} ";
        $scope.sourceEndpointContentType = "application/JSON; charset=utf-8";


        $scope.sendSourceEndpointRegistration = function(){
                var deferred = $q.defer();

                // build config with headers
                var config = {
                    headers: {
                        'Authorization': $scope.sourceEndpointAuthorization,
                        'Content-Type' : $scope.sourceEndpointContentType
                    },
                    withCredentials: true
                };

                // submit login credentials
                apiCore.put($scope.sourceEndpointUrl, $scope.sourceEndpointPayload, config).then(function(response) { // SUCCESS
                    $scope.sourceEndpointResponse = response.data;
                    deferred.resolve(response.data);

                }, function(response) { // ERROR
                    // return the error code
                    deferred.reject(response.status);
                });
                return deferred.promise;
        };


    }]);