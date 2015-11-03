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
    //like a sql where clause
    tasksQuery.notEqualTo('done', true);

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
        $('.fa-spin').show();
    }

    function hideSpinner() {
        $('.fa-spin').hide();
    }

    function onData(results) {
        tasks = results;
        renderTasks();
    }

    //this in a then function refers to the html element
    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
            var li = $(document.createElement('li'))
                .text(task.get('title'))
                .addClass(task.get('done') ? 'completed-task' : '')
                .appendTo(tasksList)
                .click(function() {
                    task.set('done', !task.get('done'));
                    task.save().then(renderTasks, displayError);
                });

            $(document.createElement('span'))
                .raty({
                    readOnly: true,
                    score: (task.get('rating') || 1), //if it returns a falsy, default to 1
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']
                })
                .appendTo(li);
        });
    }

    //wont actually use, shows power of truthy / falsy
    //numbers by 0 or non zero
    //empty string false, any other string true
    function showMessage(message) {
        message = message || 'Hello';
        alert(message);
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
        task.set('rating', $('#rating').raty('score'));
        task.save().then(fetchTasks, displayError).then(function() {
            titleInput.val('');
            $('#rating').raty('set', {});
        });

        //same as prevent default but works in other browsers
        return false;
    });


    $('[name="reset"]').click(function() {
        Parse.Object.clear();
    });

    //go and fetch tasks from Parse
    fetchTasks();

    $('#rating').raty();

    //window refers to the overall browser window
    window.setInterval(fetchTasks, 3000)
});
