/* Test script for the Tasks List app */
describe('the tasks app', function() {
    var taskTitleInp = element(by.model('newTask.title'));
    var addTaskBtn = element(by.buttonText('Add Task'));
    var taskList = element.all(by.repeater('task in tasks'));
    var requiredMsg = $('.title-required-error');

    function addTask(title) {
        taskTitleInp.sendKeys(title);
        addTaskBtn.click();
    }

    function addMultipleTasks(num) {
        for (var i = 0; i < num; i++) {
            addTask('Task ' + i);
        }
    }

    beforeEach(function() {
        browser.get('http://localhost:8000/');
    });

    it('must have the proper page title', function() {
        expect(browser.getTitle()).toEqual('My Tasks');
    });

    it('must add a task', function() {
        addTask('Learn Protractor');
        expect(taskList.count()).toEqual(1);
        expect(taskList.get(0).getText()).toEqual('Learn Protractor');
    });

    it('must add a task hitting enter', function() {
        var title = 'Learn Protractor';
        taskTitleInp.sendKeys(title);

        taskTitleInp.sendKeys(protractor.Key.ENTER);

        expect(taskList.count()).toEqual(1);
        expect(taskList.get(0).getText()).toEqual(title);
    });

    it('must clear the title after adding', function() {
        addTask('Learn Protractor');
        expect(taskTitleInp.getAttribute('value')).toEqual(''); //can't use get text for input elements
    });

    it('must add multiple tasks', function() {
        addMultipleTasks(20);
        expect(taskList.count()).toEqual(20);
    });

    it('must show required validation error', function() {
        expect(requiredMsg.isPresent()).toEqual(false);
        taskTitleInp.sendKeys('abc');
        taskTitleInp.clear();
        expect(requiredMsg.isPresent()).toEqual(true);
        taskTitleInp.sendKeys('abc');
        expect(requiredMsg.isPresent()).toEqual(false);
    });

    it('must disable ad task button with blank title', function() {
        expect(addTaskBtn.getAttribute('disabled')).toEqual('true');
        taskTitleInp.sendKeys('abc');
        expect(addTaskBtn.getAttribute('disabled')).toEqual(null);
        taskTitleInp.clear();
        taskTitleInp.sendKeys('     ');
        expect(addTaskBtn.getAttribute('disabled')).toEqual('true');
    });

    it('must toggle done with click', function() {
        addTask('test style class');
        addTask('not marked as done');
        expect(taskList.count()).toEqual(2);
        taskList.get(0).click();
        expect(taskList.get(0).getAttribute('class')).toContain('completed-task');
        expect(taskList.get(1).getAttribute('class')).not.toContain('completed-task');
    });

    it('must purge completed tasks', function() {
        addTask('1');
        addTask('2');
        expect(taskList.count()).toEqual(2);
        taskList.get(0).click();
        element(by.buttonText('Purge Completed Tasks')).click();
        expect(taskList.count()).toEqual(1);
        expect(taskList.get(0).getText()).toEqual('2');
    });
});