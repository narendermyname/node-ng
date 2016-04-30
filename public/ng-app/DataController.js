(function() {
    var app = angular.module('app');
    app.controller('DataController', DataController);

    function DataController($scope, DataService) {
        var _self = this;
        this.persons = [];
        this.personId = null;
        this.person = {};
        this.message = null;
        this.loading = false;

        this.getPersons = function() {
            init();

            DataService.getPersons().then(function(data) {
                _self.persons = data;
                _self.loading = false;
            })
        }

        this.getPerson = function(id) {
            // check required input
            if ($scope.form.id4get.$error.required) {
                _self.message = "Please add person's id";
                return;
            }

            init();

            DataService.getPerson(id).then(function(data) {
                if (typeof data === "string") {
                    // error
                    _self.message = data;
                    _self.persons = null;
                } else {
                    _self.persons = [data];
                }

                _self.loading = false;
            })
        }

        this.addPerson = function(person) {
            // check required input
            if ($scope.form.name.$error.required) {
                _self.message = "Please add person's name";
                return;
            }
            if ($scope.form.birthdate.$error.required) {
                _self.message = "Please add person's birthdate";
                return;
            }

            init();

            DataService.addPerson(person).then(function(data) {
                _self.persons = [data];
                _self.loading = false;
            })
        }

        this.removePerson = function(id) {
            // check required input
            if ($scope.form.id4delete.$error.required) {
                _self.message = "Please add person's id";
                return;
            }

            init();

            DataService.removePerson(id).then(function(data) {
                if (typeof data === "string") {
                    // error
                    _self.message = data;
                    _self.persons = null;
                } else {
                    _self.persons = [data];
                }

                _self.loading = false;
            })
        }

        // helper function to reset internal state
        var init = function() {
            _self.persons = [];
            _self.message = null;
            _self.loading = true;
        }
    }
})();