Feature: Log in to the polling station application
  As a User
  I want to log in to the application
  So that I can use it

Scenario: Step one
Given I have entered the 'login' screen
When I enter my correct email address
And I click login
Then I'm redirected to the 'password input' screen

Scenario: Step two
Given I have entered the 'password input' screen
When I enter my correct password
And I click submit
Then I receive an email with the verification code

Scenario: Step three
Given that I have received the verification code
And I have entered the 'verification code pop-up' screen
When I enter the correct verification code
And I click the submit button
Then I'm successfully logged in