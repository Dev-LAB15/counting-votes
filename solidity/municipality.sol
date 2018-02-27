pragma solidity ^0.4.19;

import './useractivation.sol';
import './permissions.sol';

contract Municipality is Permissions {
    
    uint128 private yes = 0;
    uint128 private no = 0;
    uint128 private invalid = 0;
    uint128 private blank = 0;
    uint128 public duplicityError = 0;
    
    //Voter Registration
    uint private scannedPollingCardCount = 0;
    uint private registeredPowerOfAttorneyCount = 0;
    uint private registeredVoterPassCount = 0;
    uint private registeredObjectionCount = 0;
    
    //Control Numbers
    uint private collectedPollingCardCount = 0;
    uint private collectedPowerOfAttorneyCount = 0;
    uint private collectedVoterPassCount = 0;
    
    mapping (bytes32 => uint128) public whosError;
    mapping (bytes32 => address) public cardsClaimed;

    event VoterAlreadyRecorded(bytes32 qrCodeHash, uint howMany);
    event VoterCleared(bytes32 qrCodeHash, VoterType voterType);
    
    event YesVoted();
    event NoVoted();
    event InvalidVoted();
    event BlankVoted();
    event NotAllowed(string message);
    
    function Municipality(address uacAddress) Permissions(uacAddress) public payable { }

    function voteYes() public _verifyRole(Role.Chairman) {
        yes++;
        YesVoted();
    }
    
    function voteNo() public _verifyRole(Role.Chairman) {
        no++;
        NoVoted();
    }
    
    function voteBlank() public _verifyRole(Role.Chairman) {
        blank++;
        BlankVoted();
    }
    
    function voteInvalid() public _verifyRole(Role.Chairman) {
        invalid++;
        InvalidVoted();
    }
    
    function getYes() public view returns (uint128) {
        return yes;
    }
    
    function getNo() public view returns (uint128) {
        return no;
    }
    
    function getInvalid() public view returns (uint128) {
        return invalid;
    }
    
    function getBlank() public view returns (uint128) {
        return blank;
    }
    
    modifier _noRevote(bytes32 qrCodeHash) {
        if (cardsClaimed[qrCodeHash] != 0) {
            whosError[qrCodeHash]++;
            duplicityError++;
            VoterAlreadyRecorded(qrCodeHash, whosError[qrCodeHash]);
        } else {
            _;
        }
    }
    
    function recordVoter(bytes32 qrCodeHash, VoterType voterType) public _noRevote(qrCodeHash) returns (bool) {
        
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
            return false;
        }
        
        cardsClaimed[qrCodeHash] = msg.sender;
        VoterCleared(qrCodeHash, voterType);
        return true;
    }
    
    function isValid() public view returns (bool) {
       return ((blank + no + yes + invalid) == (collectedVoterPassCount + collectedPowerOfAttorneyCount + collectedPollingCardCount));
    }
    
    function userVoted(bytes32 qrCodeHash) public view returns (bool) {
        return cardsClaimed[qrCodeHash] != 0;
    }
}