(function() {
    var app = angular.module('app');
    app.factory('DataService', DataService);

    function DataService($http) {
        var service = {
            getPersons: getPersons,
            getPerson: getPerson,
            addPerson: addPerson,
            removePerson: removePerson
        };

        return service;

        function getPersons() {
            return $http.get('/persons').then(
                function(response) {
                    return response.data;
                },
                function(error) {
                    // do something in failure case
                }
            );
        }

        function getPerson(id) {
            return $http.get('/person/' + id).then(
                function(response) {
                    return response.data;
                },
                function(error) {
                    if (error.status && error.status === 404) {
                        return error.data;
                    } else {
                        return "Unexpected request";
                    }
                }
            );
        }

        function addPerson(person) {
            return $http.post('/person', person).then(
                function(response) {
                    return response.data;
                },
                function(error) {
                    // do something in failure case
                }
            );
        }

        function removePerson(id) {
            return $http.delete('/person/' + id).then(
                function(response) {
                    return response.data;
                },
                function(error) {
                    if (error.status && error.status === 404) {
                        return error.data;
                    } else {
                        return "Unexpected request";
                    }
                }
            );
        }
    }
})();