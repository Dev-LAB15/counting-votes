const {Then, Given, When} = require('cucumber');
const {By, until, Key} = require('selenium-webdriver');
const assert = require('assert');
  
Given('I have entered the {string} screen', function (screenName, callback) {
    console.log(`Navigating to screen: ${screenName}`);
    this.driver.manage().window().maximize();
    this.driver.executeScript("document.body.style.zoom = '50%';");
    switch(screenName)
    {
        case 'Counting': 
            this.driver.get('file:///D:/Source/Repos/Counting%20Votes%20-%20Pilot%202018/ps-ui/index.html').then(function() {
                callback();
              });;
            break;
        default: this.driver.get('http://www.google.com/');
    }
});

Then('I\'m redirected to the {string} screen', function (string, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

When('I click on the {string} button', function (string, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});