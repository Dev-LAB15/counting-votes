const {Then, Given, When} = require('cucumber');
const {By, until, Key} = require('selenium-webdriver');
const assert = require('assert');

When('I select one of the vote options', function (callback) {
    console.log('Attempting to drop the vote on "Yes"...');
    var vote = this.driver.findElement(By.className('grid__item'));
    //var dropAreas = this.driver.findElements(By.className('drop-area__item'));
    console.log(vote);
    this.driver.actions().dragAndDrop(vote, {x: 400, y: 100}).perform();
    //this.driver.actions().clickAndHold(vote).move({duration:500, origin:vote, x:400, y:150}).release(vote).build();
    
    this.driver.wait(function () {
        return true;
    }, 2000);
});

When('I confirm the selection', function (callback) {
    // TODO: Finish this up when vote selection feature is complete
    console.log('Dropping the vote...');
    assert(true);
    callback();
});

Then('one vote is successfully registered in the blockchain', function (callback) {
    // TODO: Finish this up when Blockchain feature is complete
    console.log('Checking Blockchain registry...');
    assert(true);
    callback();
});

When('I click on Finish Voting', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});