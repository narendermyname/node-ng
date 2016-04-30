(function() {
    var app = angular.module('app');
    app.config(HttpBackendConfigurator);

    function HttpBackendConfigurator($provide) {
        $provide.decorator('$httpBackend', HttpBackendDecorator);

        function HttpBackendDecorator($delegate) {
            var proxy = function(method, url, data, callback, headers, timeout, withCredentials) {
                // create proxy for callback parameter
                var delayedCallback = function() {
                    // simulate network load with 2 sec. delay
                    var delay = 2000;

                    // Invoke callback with delaying
                    setTimeout((function() {
                        callback.apply(this, arguments[0]);
                    }.bind(this, arguments)), delay);
                };

                // delegate to the original $httpBackend call, but with the new delayed callback
                $delegate(method, url, data, delayedCallback, headers, timeout, withCredentials);
            };

            // the proxy object should get all properties from the original $httpBackend object 
            angular.extend(proxy, $delegate);

            // return proxy object
            return proxy;
        }
    }
})();