(function() {
    var app = angular.module('app', ["ngMockE2E"]);
    app.run(HttpBackendMocker);

    // original list of persons
    var persons = [
      {id: 1, name: 'Max Mustermann', birthdate: '01.01.1970'},
      {id: 2, name: 'Sara Smidth', birthdate: '31.12.1982'},
      {id: 3, name: 'James Bond', birthdate: '05.05.1960'}
    ];

    // Reg. expression for /person/:id
    var regexPersonId = /^\/person\/([0-9]+)$/;

    function HttpBackendMocker($httpBackend) {
        // GET /persons
        $httpBackend.whenGET('/persons').respond(persons);

        // GET /person/:id
        $httpBackend.whenGET(regexPersonId).respond(function(method, url) {
            var id = url.match(regexPersonId)[1];
            var foundPerson = findPerson(id);

            return foundPerson ? [200, foundPerson] : [404, 'Person not found'];
        });

        // POST /person
        $httpBackend.whenPOST('/person').respond(function(method, url, data) {
            var newPerson = angular.fromJson(data);
            // does the person already exist?
            var existingPerson = findPerson(newPerson.id);

            if (existingPerson) {
                // update existing person
                angular.extend(existingPerson, newPerson);
                return [200, existingPerson];
            } else {
                // create a new person
                newPerson.id = persons.length > 0 ? persons[persons.length - 1].id + 1 : 1;
                persons.push(newPerson);
                return [200, newPerson];
            }
        });

        // DELETE: /person/:id
        $httpBackend.whenDELETE(regexPersonId).respond(function(method, url) {
            var id = url.match(regexPersonId)[1];
            var foundPerson = findPerson(id);

            if (foundPerson) {
                persons.splice(foundPerson.id - 1, 1);
                // re-set ids
                for (var i = 0; i < persons.length; i++) {
                    persons[i].id = i + 1;
                }
            }

            return foundPerson ? [200, foundPerson] : [404, 'Person not found'];
        });

        // helper function to find a person by id
        function findPerson(id) {
            var foundPerson = null;
            for (var i = 0; i < persons.length; i++) {
                var person = persons[i];
                if (person.id == id) {
                    foundPerson = person;
                    break;
                }
            }

            return foundPerson;
        }
    }
})();