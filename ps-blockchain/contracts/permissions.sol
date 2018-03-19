pragma solidity ^0.4.19;

import "./useractivation.sol";

contract Permissions {

   //Timestamp in seconds (from UNIX epoch). Voting date: 21-03-2018 05:00:00 GMT: 1521604800
    uint256 constant public VOTING_START_TIMESTAMP = 1;
   
    enum VoterType {
        Unspecified,
        PollingCard,
        PowerOfAttorneyPollingCard,
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

    event UserAdded(bool success, string message, string email, address userAddress, Role role);
    event UserCreationFailed(address uAddress, string email);
    event NotAllowed(string message);

    function Permissions(address userActivationAddress) public {
        owner = msg.sender;
        userActivationContract = UserActivation(userActivationAddress);
    }

    function getRole() public view returns (Role) {
        return Role(roles[tx.origin]);
    }    

    function setUserRole(address user, string email) public _isOwner() payable {
        Role userRole = Role(userActivationContract.getRoleId(email));

        if (userRole > Role.Unknown && userRole <= Role.Teller) {
            roles[user] = uint8(userRole);
            UserAdded(true, "User Added", email, user, Role(userRole));
        } else {
            UserAdded(false, "User Creation Failed", email, user, Role(userRole));
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
        } else {
            NotAllowed("Unauthorized access.");
        }
    }

    function getUacAddress() public view returns (address userActivationAddress) {
        return address(userActivationContract);
    }
}