pragma solidity ^0.4.19;

import './useractivation.sol';

contract Permissions {
    
    enum VoterType {
        Unspecified,
        PollingCard,
        PowerOfAttorney,
        VoterPass,
        Objection
    }
    
    enum Role {
        Unknown,
        Owner,
        Mayor,
        Chairman,
        Teller
    }
    
    address internal owner;
    UserActivation internal userActivationContract;
    
    mapping (address => uint8) internal roles;
    
    event UserAdded(Role role);
    event UserCreationFailed(address uAddress, string email);
    
    function Permissions(address userActivationAddress) public {
        owner = msg.sender;
        userActivationContract = UserActivation(userActivationAddress);
    }
    
    function getRole() public view returns (Role) {
       return Role(roles[tx.origin]);
    }    
   
    function setUserRole(address user, string email) public _isOwner() {
        Role userRole = Role(userActivationContract.getRoleId(email));
        
        if (userRole != Role.Unknown) {
            roles[user] = uint8(userRole);
            UserAdded(Role(userRole));
        } else {
            UserCreationFailed(user, email);
        }
    }
    
    function setUsedEmail(string email) internal _isOwner() {
        userActivationContract.setUsedEmail(email);
    }

    modifier _isOwner() {
        if (tx.origin == owner) {
            _;
        }
    }
    
    modifier _verifyRole(Role role) {
        if (Role(roles[tx.origin]) == role) {
            _;
        }
    }
}