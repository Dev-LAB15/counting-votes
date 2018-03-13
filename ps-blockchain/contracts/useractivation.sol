pragma solidity ^0.4.19;

contract UserActivation {

    address private owner;
    string[] private emailAddresses;
    mapping (string => bool) private usedAddresses;
    mapping (string => uint8) private roles;
    
    event NotAllowed();
    
    function UserActivation() public {
        owner = msg.sender;
    }

    //email do client -> wallet address
    modifier _isOwner() {
        if (tx.origin == owner) {
            _;
        }
    }

    function addEmail(string email, uint8 assignedUserRole) public _isOwner() {
        emailAddresses.push(email);
        roles[email] = assignedUserRole;
        usedAddresses[email] = false;
    }
    
    function getRoleId(string email) public _isOwner view returns(uint8) {
        return roles[email];
    }
    
    function setUsedEmail(string email) public _isOwner {
        usedAddresses[email] = true;
    }
    
    function getUsedEmail(string email) public _isOwner view returns(bool) {
        return usedAddresses[email];
    }
}