angular
    .module("ubxtour")
    .factory('apiCore', [
        "$http",
        "$q",
        function($http, $q) {
            var apiCore = {
                errorLog: [],
                isAuthorized: false,
                isLoading: 0 // counter to be used for showing loading bee at the root level
            };

            //----------------------------------------------------------
            // set the HTTP authentication
            apiCore.setAuth = function(authkey) {
                if (loginData === null) { // clear the authentication
                    $http.defaults.headers.common.Authorization = null;
                    apiCore.isAuthorized = false;
                } else {
                    $http.defaults.headers.common.Authorization = "Bearer " + authkey;
                    apiCore.isAuthorized = true;
                }
            };



            //----------------------------------------------------------
            // generate a stacktrace array
            apiCore.getStackTrace = function () {
                var stack;
                try {
                    throw new Error('');
                }
                catch (error) {
                    stack = error.stack || '';
                }
                stack = stack.split('\n').map(function (line) { return line.trim(); });
                return stack.splice(stack[0] == 'Error' ? 2 : 1);
            };

            //----------------------------------------------------------
            // perform the actual HTTP request
            apiCore.request = function(method, endpoint, config) {
                var deferred = $q.defer();

                // figure out what's requesting the data
                //console.log(apiCore.getStackTrace().join('\n'));

                if (!config) { config = {}; }
                config.method = method; // GET, POST, DELETE, etc
                config.url = endpoint;
                //config.cache = false; // do not cache

                $http(config).success(function (data, status, headers, config, statusText) {

                    // rebuild response object
                    var response = {
                        data: data,
                        status: status,
                        headers: headers,
                        config: config,
                        statusText: statusText
                    };

                    // resolve the promise with the HTTP response object
                    deferred.resolve(response);

                }).error(function(data, status, headers, config, statusText) {

                    // log the error
                    var error = {
                        data: data,
                        status: status,
                        headers: headers,
                        config: config,
                        statusText: statusText,
                        timestamp: Date.now()
                    };
                    //console.log('['+error.status+'] API ERROR', error);
                    apiCore.errorLog.push(error);

                    // TODO: add additional error handling

                    // rebuild response object
                    var response = {
                        data: data,
                        status: status,
                        headers: headers,
                        config: config,
                        statusText: statusText
                    };

                    // reject the promise with the HTTP resposne object
                    deferred.reject(response);

                });
                return deferred.promise;
            };

            //----------------------------------------------------------
            // perform a POST request
            apiCore.post = function(url, data, config) {
                if (!config) { config = {}; }

                // add POST data
                config.data = data;

                // perform the HTTP POST and return the promise
                return apiCore.request('POST', url, config);
            };

            //----------------------------------------------------------
            // perform a GET request
            apiCore.get = function(url, params, config) {
                if (!config) { config = {}; }

                // add (merge) GET parameters
                if (!params) { params = {}; }
                if (!config.params) { config.params = {}; }
                config.params = angular.extend(config.params, params);

                // perform the HTTP GET and return the promise
                return apiCore.request('GET', url, config);
            };

            //----------------------------------------------------------
            // perform a PUT request
            apiCore.put = function(url, data, config) {
                if (!config) { config = {}; }

                // add PUT data
                config.data = data;

                // perform the HTTP PUT and return the promise
                return apiCore.request('PUT', url, config);
            };

            //----------------------------------------------------------
            // perform a DELETE request
            apiCore.delete = function(url, data, config) {

                //not sure about these next two lines, but putting in for now as I think the delete call
                // should be able to accept one or more ids
                if (!config) { config = {}; }
                config.data = data; // add DELETE data

                return apiCore.request('DELETE', url, config);
            };

            return apiCore;
        }
    ]);
