/**
 * This file is part of Counting Votes project.
 * 
 * Counting Votes project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 * 
 * Counting Votes project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Counting Votes project. If not, see <http://www.gnu.org/licenses/>.
 */
 pragma solidity ^0.4.19;

import "./useractivation.sol";
import "./permissions.sol";

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
    mapping (address => uint) collectedPollingCardCountByPollingStation;
    mapping (address => uint) collectedPowerOfAttorneyCountByPollingStation;
    mapping (address => uint) collectedVoterPassCountByPollingStation;
    uint private collectedPollingCardCount = 0;
    uint private collectedPowerOfAttorneyCount = 0;
    uint private collectedVoterPassCount = 0;

    uint private workingPollingStationsCount = 0;
    bool private mayorSignedOff = false;
    
    mapping (bytes32 => uint128) private whosError;
    mapping (bytes32 => address) private cardsClaimed;
    mapping (address => uint128) private pollingStationYesVotes;
    mapping (address => uint128) private pollingStationNoVotes;
    mapping (address => uint128) private pollingStationBlankVotes;
    mapping (address => uint128) private pollingStationInvalidVotes;
    mapping (address => bool) private enrolledPollStations;
    mapping (address => bool) private pollingStationJobComplete; 

    event MayorSignedOff(bool success, string message);
    event MayorSignedIn(bool success, string message);
    event VoterAlreadyRecorded(bytes32 qrCodeHash, uint howMany);
    event VoterCleared(bytes32 qrCodeHash, VoterType voterType);
    event VoteCounted(uint voteCode, string timestamp);
    
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

    modifier _canSignOff() {
        if(Role(roles[tx.origin]) == Role.Mayor) {
            MayorSignedOff(false, "Access denied!");
            return;
        }

        if(mayorSignedOff) {
            MayorSignedOff(false, "Already Signed Off");
            return;
        }

        if(workingPollingStationsCount != 0) {
            MayorSignedOff(false, "All Polling Stations must Sign Off first");
            return;
        }

        _;
    }
    
    function enrollPollStation() public _isOwner() {
        enrolledPollStations[msg.sender] = true;
    }

    function beginVotingSession() public _isOwner() {
        workingPollingStationsCount++;
    }

    function finishVotingSession() public _isOwner() {
        workingPollingStationsCount--;
    }

    function countVote(uint voteId, string timestamp) public _verifyRole(Role.Chairman) _canVote() {

        if(voteId == 1) {
            yes++;
            pollingStationYesVotes[msg.sender]++;
        }else if(voteId == 2) {
            no++;
            pollingStationNoVotes[msg.sender]++;
        }else if(voteId == 3) {
            blank++;
            pollingStationBlankVotes[msg.sender]++;
        }else {
            invalid++;
            pollingStationInvalidVotes[msg.sender]++;          
        }

        VoteCounted(voteId, timestamp);
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
    
    function inputControlNumbers(uint pollingCards, uint powerOfAttorneys, uint voterPasses) public _verifyRole(Role.Chairman) _canVote() {
        uint tempPollingCardCount = collectedPollingCardCountByPollingStation[msg.sender];
        uint tempPowerOfAttorneyCount = collectedPowerOfAttorneyCountByPollingStation[msg.sender];
        uint tempVoterPassCount = collectedVoterPassCountByPollingStation[msg.sender];

        collectedPollingCardCount -= tempPollingCardCount;
        collectedPowerOfAttorneyCount -= tempPowerOfAttorneyCount;
        collectedVoterPassCount -= tempVoterPassCount;

        collectedPollingCardCount += pollingCards;
        collectedPowerOfAttorneyCount += powerOfAttorneys;
        collectedVoterPassCount += voterPasses;

        collectedPollingCardCountByPollingStation[msg.sender] = pollingCards;
        collectedPowerOfAttorneyCountByPollingStation[msg.sender] = powerOfAttorneys;
        collectedVoterPassCountByPollingStation[msg.sender] = voterPasses;
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

    //Adds the Mayor Role when the mayor first signs in
    function setMayorRole(address user, string email) public _isOwner() payable {
        require(msg.value > 0);
        super.setUserRole(user, email);
        super.setUsedEmail(email);
        if (user.balance <= 1) {
            user.send(msg.value);
        }
    }

    function mayorSignIn() public {
        Role role = Role(roles[msg.sender]);

        if (role == Role.Mayor) {
            MayorSignedIn(true, "Mayor Signed In");
        }
        else{
            MayorSignedIn(false, "Mayor Signed In");
        }
    }

    function getSummary() public view returns (uint scannedPollingCards, uint registeredVoterPasses, uint scannedPowerOfAttorneys, uint registeredPowerOfAttorneys, uint registeredObjections, uint collectedPollingCards, uint collectedVoterPasses, uint collectedPowerOfAttorneys, uint yesGlobal, uint noGlobal, uint blankGlobal, uint invalidGlobal) {
        return (scannedPollingCardCount, registeredVoterPassCount, scannedPowerOfAttorneyCount, registeredPowerOfAttorneyCount, registeredObjectionCount, collectedPollingCardCount, collectedVoterPassCount, collectedPowerOfAttorneyCount, yes, no, blank, invalid);
    }

    function canSignOff() public view returns (bool isMissingPollingStation) {
        return (workingPollingStationsCount == 0);
    }

    function signOff() public _canSignOff() {
        mayorSignedOff = true;
        MayorSignedOff(true, "Sign off successful!");
    }
}