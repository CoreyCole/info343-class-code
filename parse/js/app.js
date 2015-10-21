/*
    script for the index.html file
*/

Parse.initialize("DdkSXVDqkkOR0Ji8MvLmWq44bTLaLKvuOcjSqOpV", "ZzOWFr1yYn9oDAfZ6GdsCXKvpYniMdQonPBv8Wce");

$(function() {
    "use strict";

    //new Task class for parse
    var Task = Parse.Object.extend('Task');
    //new query that will return all tasks ordered by createAt
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');

    //reference to the task list element
    var tasksList = $('#tasks-list');

    //reference to the error message alert
    var errorMessage = $('#error-message');

    //current set of tasks
    var tasks = [];

    var tasksList = $('#tasks-list');

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function clearError() {
        errorMessage.hide();
    }

    function showSpinner() {
        $('.fa-spinner').show();
    }

    function hideSpinner() {
        $('.fa-spinner').hide();
    }


    function fetchTasks() {
        showSpinner();
        tasksQuery.find()
            .then(onData, displayError)
            .always(hideSpinner);
    }

    function onData(results) {
        tasks = results;
        renderTasks();
    }

    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
            $(document.createElement('li'))
                .text(task.get('title'))
                .appendTo(tasksList);
        });
    }

    //when the user submits
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault();

        var titleInput = $(this).find('[name="title"]');
        //jQuery does functions instead of instance variabls (.value)
        //because it calls undefined() and throws runtime error if you make a typo like .vel()
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.save().then(fetchTasks, displayError).then(function() {
            titleInput.val('');
        });

        //same as prevent default but works in other browsers
        return false;
    });


    $('[name="reset"]').click(function() {
        Parse.Object.clear();
    });

    //go and fetch tasks from Parse
    fetchTasks();
    //window referes to the overall browser window
    window.setInterval(fetchTasks, 3000)
});
