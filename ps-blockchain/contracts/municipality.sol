pragma solidity ^0.4.19;

import './useractivation.sol';
import './permissions.sol';

contract Municipality is Permissions {
    
    uint128 private yes = 0;
    uint128 private no = 0;
    uint128 private invalid = 0;
    uint128 private blank = 0;
    uint128 private duplicityError = 0;
    uint128 private recounts = 0;
    
    //Voter Registration
    uint private scannedPollingCardCount = 0;
    uint private scannedPowerOfAttorneyCount = 0;
    uint private registeredPowerOfAttorneyCount = 0;
    uint private registeredVoterPassCount = 0;
    uint private registeredObjectionCount = 0;
    
    //Control Numbers
    uint private collectedPollingCardCount = 0;
    uint private collectedPowerOfAttorneyCount = 0;
    uint private collectedVoterPassCount = 0;
    
    mapping (bytes32 => uint128) private whosError;
    mapping (bytes32 => address) private cardsClaimed;
    mapping (address => uint128) private pollingStationYesVotes;
    mapping (address => uint128) private pollingStationNoVotes;
    mapping (address => uint128) private pollingStationBlankVotes;
    mapping (address => uint128) private pollingStationInvalidVotes;
    mapping (address => bool) private enrolledPollStations;

    event VoterAlreadyRecorded(bytes32 qrCodeHash, uint howMany);
    event VoterCleared(bytes32 qrCodeHash, VoterType voterType);
    
    event YesVoted();
    event NoVoted();
    event InvalidVoted();
    event BlankVoted();
    
    function Municipality(address uacAddress) Permissions(uacAddress) public payable { }
    
    modifier _canVote() {
        if (enrolledPollStations[msg.sender] == true) {
            _;
        } else {
            NotAllowed("Only enrolled poll stations can cast votes.");
            revert();
        }
    }
    
    function enrollPollStation() public _isOwner() {
        enrolledPollStations[msg.sender] = true;
    }

    function voteYes() public _verifyRole(Role.Chairman) _canVote() {
        yes++;
        pollingStationYesVotes[msg.sender]++;
        YesVoted();
    }
    
    function voteNo() public _verifyRole(Role.Chairman) _canVote() {
        no++;
        pollingStationNoVotes[msg.sender]++;
        NoVoted();
    }
    
    function voteBlank() public _verifyRole(Role.Chairman) _canVote() {
        blank++;
        pollingStationBlankVotes[msg.sender]++;
        BlankVoted();
    }
    
    function voteInvalid() public _verifyRole(Role.Chairman) _canVote() {
        invalid++;
        pollingStationInvalidVotes[msg.sender]++;
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
    
    function inputControlNumbers(uint pollingCards, uint powerOfAttorneys, uint voterPasses) public _verifyRole(Role.Chairman) {
        collectedPollingCardCount = pollingCards;
        collectedPowerOfAttorneyCount = powerOfAttorneys;
        collectedVoterPassCount = voterPasses;
    }
    
    function recount() public _verifyRole(Role.Chairman) _canVote() {
        uint128 yesTemp = pollingStationYesVotes[msg.sender];
        uint128 noTemp = pollingStationNoVotes[msg.sender];
        uint128 blankTemp = pollingStationBlankVotes[msg.sender];
        uint128 invalidTemp = pollingStationInvalidVotes[msg.sender];
        
        pollingStationYesVotes[msg.sender] = 0;
        pollingStationNoVotes[msg.sender] = 0;
        pollingStationBlankVotes[msg.sender] = 0;
        pollingStationInvalidVotes[msg.sender] = 0;
        
        yes -= yesTemp;
        no -= noTemp;
        blank -= blankTemp;
        invalid -= invalidTemp;
        recounts++;
    }
    
    function getRecounts() public view returns (uint128) {
        return recounts;
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
    
    function recordVoter(bytes32 qrCodeHash, VoterType voterType) public _noRevote(qrCodeHash) _canVote() _verifyRole(Role.Chairman) returns (bool) {
        
        if (voterType == VoterType.PollingCard) {
            scannedPollingCardCount++;
        } else if (voterType == VoterType.PowerOfAttorneyPollingCard) {
            scannedPowerOfAttorneyCount++;
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