/* 
    script for the tasks.html file 
*/

angular.module('Tasks', [])
    .constant('tasksKey', 'tasks') //constant for local storage
    .controller('TasksController', function($scope, tasksKey) {
        $scope.tasks = angular.fromJson(localStorage.getItem(tasksKey)) || []; //empty if falsy
        $scope.newTask = {};

        function saveTasks() {
            localStorage.setItem(tasksKey, angular.toJson($scope.tasks));
        }

        $scope.addTask = function() {
            $scope.tasks.push($scope.newTask);
            $scope.newTask = {};
            saveTasks();
        };

        $scope.toggleDone = function(task) {
            task.done = !task.done;
            saveTasks();
        };
    });