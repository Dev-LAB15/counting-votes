@PollingStation
Feature: Register votes
  As a Charirman
  I want to be able to register counted votes
  So that I can compare the numbers with control values

@Current
Scenario: Step One
Given that I'm signed in
And I have entered the 'Counting' screen
When I select one of the vote options
And I confirm the selection
Then one vote is successfully registered in the blockchain
And I get a visual confirmation

Scenario: Step Two
Given that I'm signed in
And I have entered the 'Counting' screen
When I click on the 'Finish Voting' button
Then I'm redirected to the 'Verification Step Two' screen