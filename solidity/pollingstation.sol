pragma solidity ^0.4.19;

import "./permissions.sol";
import "./municipality.sol";

contract PollingStation is Permissions {
    
    //Voting data
    uint private votingRound = 0;
    uint private yeslocal = 0;
    uint private nolocal = 0;
    uint private invalidlocal = 0;
    uint private blanklocal = 0;
    
    //Voter Registration
    uint private scannedPollingCardCount = 0;
    uint private registeredPowerOfAttorneyCount = 0;
    uint private registeredVoterPassCount = 0;
    uint private registeredObjectionCount = 0;
    
    //Control Numbers
    uint private collectedPollingCardCount = 0;
    uint private collectedPowerOfAttorneyCount = 0;
    uint private collectedVoterPassCount = 0;
    
    //Access control
    uint8 private signedInChairmenCount = 0;
    uint8 private signedInTellerCount = 0;
    bool private votingSessionClosed = true;
    uint256 constant public VOTING_START_TIMESTAMP = 1; //Timestamp in seconds (from UNIX epoch). Voting date: 21-03-2018 05:00:00 GMT: 1521604800
    
    //Mappings
    mapping (address => bool) private signedInChairmen;
    mapping (address => bool) private signedInTellers;
    
    Municipality public munContract;
    
    event VoterAlreadyRecorded(bytes32 qrCodeHash);
    event VoterCleared(bytes32 qrCodeHash);
    event NotAllowed(string message);
    event UserSignedIn(address userAddress, Role role);
    event UserSignedOut(address userAddress, Role role);
    
    function PollingStation(address mAddress, address uacAddress) Permissions(uacAddress) public {
        munContract = Municipality(mAddress);
    }

    modifier _noRevote(bytes32 qrCodeHash) {
        if (munContract.userVoted(qrCodeHash)) {
            VoterAlreadyRecorded(qrCodeHash);
        } else {
            VoterCleared(qrCodeHash);
            _;
        }
    }
    
    modifier _canSignIn() {
        Role currRole = Role(roles[msg.sender]);
        
        if (votingSessionClosed) {
            NotAllowed("Voting Session is closed.");
        }
        
        if ((currRole == Role.Chairman && signedInChairmenCount == 0) || (currRole == Role.Teller && signedInChairmenCount >= 0)) {
            _;
        } else {
            NotAllowed("Unallowed role or rule violation.");
        }
    }
    
    modifier _canSignOut() {
        Role currRole = Role(roles[msg.sender]);
        
        if ((currRole == Role.Chairman && signedInChairmenCount > 0 && signedInTellerCount <= 0 && votingSessionClosed) || 
            (currRole == Role.Teller && (signedInTellerCount > 1 || votingSessionClosed))) {
            _;
        } else {
            NotAllowed("Unallowed role or rule violation.");
        }
    }
    
    modifier _verifyRole(Role role) {
        Role senderRole = Role(roles[msg.sender]);
        
        if (senderRole == role) {
            _;
        } else {
            NotAllowed("Unauthorized access.");
        }
    }
    
    modifier _canSessionStart() {
        
        if (now > VOTING_START_TIMESTAMP) {
            _;
        } else {
            NotAllowed("Not allowed before official start date.");
        }
        
    }
    
    function beginVotingSession() public _isOwner _canSessionStart() {
        votingSessionClosed = false;
        votingRound++;
    }
    
    // Checks if the number of all votes matches the number of recorded cards
    // Locally
    function isValid() public view returns (bool res) {
        res = ((blanklocal + nolocal + yeslocal + invalidlocal) == (collectedVoterPassCount + collectedPowerOfAttorneyCount + collectedPollingCardCount));
    }
    
    function recordVoter(bytes32 qrCodeHash, VoterType voterType) public _verifyRole(Role.Chairman) _noRevote(qrCodeHash) returns(bool) {

        if (voterType == VoterType.PollingCard) {
            scannedPollingCardCount++;
        } else if (voterType == VoterType.PowerOfAttorney) {
            registeredPowerOfAttorneyCount++;
        } else if (voterType == VoterType.VoterPass) {
            registeredVoterPassCount++;
        } else if (voterType == VoterType.Objection) {
            registeredObjectionCount++;
        } else {
            NotAllowed("Invalid voter type.");
            return;
        }
        
        return munContract.recordVoter(qrCodeHash, voterType);
    }
    
    function yes() public _verifyRole(Role.Chairman) {
        yeslocal++;
        munContract.voteYes();
    }
    
    function no() public _verifyRole(Role.Chairman) {
        nolocal++;
        munContract.voteNo();
    }
    
    function blank() public _verifyRole(Role.Chairman) {
        blanklocal++;
        munContract.voteBlank();
    }
    
    function invalid() public _verifyRole(Role.Chairman) {
        invalidlocal++;
        munContract.voteInvalid();
    }
    
    // this will record the roles locally and into the municipality
    function setUserRole(address user, string email) public _isOwner() {
        super.setUserRole(user, email);
        munContract.setUserRole(user, email);
        super.setUsedEmail(email);
    }
    
    function signIn() public _canSignIn() {
        Role role = Role(roles[msg.sender]);
        
        if (role == Role.Chairman) {
            signedInChairmenCount++;
            signedInChairmen[msg.sender] = true;
        } else if (role == Role.Teller) {
            signedInTellerCount++;
            signedInTellers[msg.sender] = true;
        } else {
            NotAllowed("Unallowed role or rule violation.");
            return;
        }
        
        UserSignedIn(msg.sender, role);
    }
    
    function signOut() public _canSignOut { 
        
        Role role = Role(roles[msg.sender]);
        
        if (role == Role.Chairman) {
            signedInChairmenCount--;
            signedInChairmen[msg.sender] = false;
        } else if (role == Role.Teller) {
            signedInTellerCount--;
            signedInTellers[msg.sender] = false;
        } else {
            NotAllowed("Unallowed role or rule violation.");
            return;
        }
        
        UserSignedOut(msg.sender, role);
    }
}