Feature: Scan polling cards
  As a Charirman
  I want to be able to scan polling cards
  So that I can compare the numbers with actual votes

Scenario: Scan QR Code
Given that I'm signed in
And I have entered the 'Scan' screen
When I scan a new Polling Card successfuly
Then the QR code is registered in the blockchain
And I see a visual stating that the QR is valid or invalid
And the last 10 transactions are shown containing Hash, Timestamp and Validity ordered by timestamp descendant

Scenario: Voter Pass Count
Given that I'm signed in
And I have entered the 'Scan' screen
When I click the 'voter pass' button
And I click OK on the confirmation pop-up
Then one 'voter pass' is registered in the blockchain
And I get a visual confirmation

Scenario: Power of Attorney Count
Given that I'm signed in
And I have entered the 'Scan' screen
When I click the 'power of attorney' button
And I click OK on the confirmation pop-up
Then one 'power of attorney' is registered in the blockchain
And I get a visual confirmation

Scenario: Objection Count
Given that I'm signed in
And I have entered the 'Scan' screen
When I click the 'objection to pilot' button
And I click OK on the confirmation pop-up
Then one 'objection' is registered in the blockchain
And I get a visual confirmation