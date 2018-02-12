Feature: Verify that vote count matches control numbers
  As the Chairman
  I want to verify that the votes match control numbers
  So that I can confidently sign the count

Scenario: Verification Step One
Given I have entered the 'Verification Step One' screen
And I have filled the total amount of 'Polling Cards'
And I have filled the total amount of 'Power of Attorneys'
And I have filled the total amount of 'Voter Passes'
When I click the 'OK' button
Then I'm redirected to the 'Counting' screen

Scenario: Verification Step Two
Given I have registered all the votes
And I have entered the 'Verification Step Two' screen
When I click the 'Verify' button
Then I'm redirected to the 'Summary' screen

Scenario: Results Overview
Given I have entered the 'Summary' screen
And I have entered the 'Verification Step Two' screen
When I click the 'Next' button
Then I'm redirected to the 'Results Overview' screen