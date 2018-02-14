const {Then, Given, When} = require('cucumber');
const assert = require('assert');

Given('that I\'m signed in', function (callback) {
    // TODO: Finish this up when login feature is complete
    console.log('Checking that user is logged in...');
    assert(true);
    callback();
});

When('I scan a new Polling Card successfuly', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

Then('the QR code is registered in the blockchain', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

Then('I see a visual stating that the QR is valid or invalid', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

Then('the last {int} transactions are shown containing Hash, Timestamp and Validity ordered by timestamp descendant', function (int, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

When('I click the {string} button', function (string, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

When('I click OK on the confirmation pop-up', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

Then('one {string} is registered in the blockchain', function (string, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});

Then('I get a visual confirmation', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});