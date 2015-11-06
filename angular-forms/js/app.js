/*
    script file for the index.html page

    ui.router -> ui routing
    angular uuid -> universally unique id
    local storage module -> angular wrapper for local storage (no need to translate json)
*/

angular.module('ContactsApp', ['ui.router', 'angular-uuid', 'LocalStorageModule'])
    .constant('storageKey', 'contacts-list')
    .factory('contacts', function(uuid, localStorageService, storageKey) {
        // factory is a fancy way of fetching data and making it available to controllers
        return localStorageService.get(storageKey);
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/contacts',
                templateUrl: 'views/contacts-list.html',
                controller: 'ContactsController'
            })
            .state('detail', {
                url: '/contacts/:id',
                templateUrl: 'views/contact-detail.html',
                controller: 'ContactDetailController'
            })
            .state('edit', {
                url: '/contacts/:id/edit',
                templateUrl: 'views/edit-contact.html',
                controller: 'EditContactController'
            });

        //default if something weird is typed in
        $urlRouterProvider.otherwise('/contacts');
    })
    //register a directive for custom validation of dates in the past
    .directive('inThePast', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, controller) {
                controller.$validators.inThePast = function(modelValue) {
                    var today = new Date();
                    return (new Date(modelValue) <= today);
                };
            }
        };
    })
    .controller('ContactsController', function($scope, contacts) {
        //passed in contacts from whatever contacts factory returned
        $scope.contacts = contacts;

    })
    .controller('ContactDetailController', function($scope, $stateParams, $state, contacts) {
        //stateParams for contact id passed in URL
        //state

        $scope.contact = contacts.find(function(contact) {
            return contact.id === $stateParams.id;
        });
    })
    .controller('EditContactController', function($scope, $stateParams, $state,
                                                  uuid, localStorageService, storageKey, contacts) {
        var existingContact = contacts.find(function(contact) {
            return contact.id === $stateParams.id;
        });

        //copy so we are not editing the actual data, just a copy
        $scope.contact = angular.copy(existingContact);

        $scope.save = function() {
            if ($scope.contact.id) {
                //on save, copy back into actual data
                angular.copy($scope.contact, existingContact);
            } else {
                $scope.contact.id = uuid.v4();
                contacts.push($scope.contact);
            }

            localStorageService.set(storageKey, contacts);

            $state.go('list');
        }
    });
