pragma solidity ^0.4.19;

import "./permissions.sol";
import "./municipality.sol";

contract PollingStation is Permissions {
    
    //Voting data
    uint128 private votingRound = 0;
    uint128 private yesLocal = 0;
    uint128 private noLocal = 0;
    uint128 private invalidLocal = 0;
    uint128 private blankLocal = 0;
    
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
    
    //Access control
    uint8 private signedInChairmenCount = 0;
    uint8 private signedInTellerCount = 0;
    uint8 private signedOffChairmenCount = 0;
    uint8 private signedOffTellerCount = 0;
    bool private votingSessionClosed = true;
    string private deviationExplanation;
    bool private verificationSuccessful = false;
    bool private needsRecount = true;
    bool private beganCounting = false;
    
    //Mappings
    mapping (address => bool) private signedInChairmen;
    mapping (address => bool) private signedInTellers;
    mapping (address => uint256) private signedOffStaff;
    
    Municipality public munContract;
    
    event VoterAlreadyRecorded(bytes32 qrCodeHash);
    event VoterCleared(bytes32 qrCodeHash);
    event UserSignedIn(address userAddress, Role role);
    event UserSignedOut(address userAddress, Role role);
    event VotingFinished(address pollingStation);
    event StaffSignedOff(address staff);
    event VerificationAttempt(bool yes, bool no, bool blank, bool invalid);
    event ControlNumbersAdded(uint256 pollingCards, uint256 powerOfAttorneys, uint256 voterPasses);
    
    function PollingStation(address mAddress, address uacAddress) Permissions(uacAddress) public {
        munContract = Municipality(mAddress);
        munContract.enrollPollStation();
    }

    modifier _noRevote(bytes32 qrCodeHash) {
        if (munContract.userVoted(qrCodeHash)) {
            VoterAlreadyRecorded(qrCodeHash);
        } else {
            VoterCleared(qrCodeHash);
            _;
        }
    }
    
    modifier _isSessionOpen() {
        if (!isSessionOpen()) {
            NotAllowed("Session is closed.");
        } else {
            _;
        }
    }
    
    modifier _canSignIn() {
        Role currRole = Role(roles[msg.sender]);
        
        if (!isSessionOpen()) {
            NotAllowed("Voting Session is closed.");
            return;
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
    
    modifier _canSessionStart() {
        
        if (block.timestamp > VOTING_START_TIMESTAMP && votingSessionClosed && !verificationSuccessful) {
            _;
        } else {
            NotAllowed("Not allowed before official start date.");
        }
        
    }
    
    modifier _canSignOff() {
        if (votingSessionClosed) {
            NotAllowed("Can only sign off during open voting session.");
            return;
        }
        
        if (!verificationSuccessful) {
            return;
        }
        
        if (signedOffStaff[msg.sender] != 0) {
            NotAllowed("Staff memeber already signed off.");
            return;
        }
        
        Role currRole = Role(roles[msg.sender]);
        
        if (currRole == Role.Teller && signedInTellers[msg.sender] != true) {
            NotAllowed("Only signed in Tellers can sign off.");
            return;
        }
        
        if (currRole == Role.Chairman && signedInChairmen[msg.sender] != true) {
            NotAllowed("Only signed in Chairmen can sign off.");
            return;
        }
        
        if ((currRole == Role.Chairman && signedOffChairmenCount < signedInChairmenCount && signedInTellerCount > 0) || 
            (currRole == Role.Teller && signedOffTellerCount < signedInTellerCount && signedOffChairmenCount == 0)) {
            _;
        } else {
            NotAllowed("All Tellers must sign off, then chairman can sign off. No other role can sign off.");
        }
    }
    
    // this will record the roles locally and into the municipality
    function setUserRole(address user, string email) public _isOwner() payable {
        require(msg.value > 0);
        super.setUserRole(user, email);
        munContract.setUserRole(user, email);
        super.setUsedEmail(email);
        if (user.balance <= 1) {
            user.send(msg.value);
        }        
    }
    
    function isSessionOpen() public view returns (bool) {
        return !votingSessionClosed && !verificationSuccessful;
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
    
    function beginVotingSession() public _isOwner _canSessionStart() {
        votingSessionClosed = false;
        needsRecount = false;
        votingRound++;
    }
    
    function recordVoter(bytes32 qrCodeHash, VoterType voterType) public _verifyRole(Role.Chairman) _noRevote(qrCodeHash) returns(bool) {
        if (voterType <= VoterType.Unspecified || voterType > VoterType.Objection) {
            NotAllowed("Invalid voter type.");
            return false;
        }
        
        bool success = munContract.recordVoter(qrCodeHash, voterType);
        if (!success) {
            return false;
        }
        
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
        }
        
        return true;
    }
    
    function getReport() public view returns (uint scannedPollingCards, uint registeredVoterPasses, uint scannedPowerOfAttorneys, uint registeredPowerOfAttorneys, uint registeredObjections, uint collectedPollingCards, uint collectedVoterPasses, uint collectedPowerOfAttorneys, uint yes, uint no, uint blank, uint invalid) {
        return (scannedPollingCardCount, registeredVoterPassCount, scannedPowerOfAttorneyCount, registeredPowerOfAttorneyCount, registeredObjectionCount, collectedPollingCardCount, collectedVoterPassCount, collectedPowerOfAttorneyCount, yesLocal, noLocal, blankLocal, invalidLocal);
    }
    
    function yes() public _isSessionOpen() _verifyRole(Role.Chairman) {
        beganCounting = true;
        yesLocal++;
        munContract.voteYes();
    }
    
    function no() public _isSessionOpen() _verifyRole(Role.Chairman) {
        beganCounting = true;
        noLocal++;
        munContract.voteNo();
    }
    
    function blank() public _isSessionOpen() _verifyRole(Role.Chairman) {
        beganCounting = true;
        blankLocal++;
        munContract.voteBlank();
    }
    
    function invalid() public _isSessionOpen() _verifyRole(Role.Chairman) {
        beganCounting = true;
        invalidLocal++;
        munContract.voteInvalid();
    }
    
    function getVerification() public view returns (bool) {
        return verificationSuccessful;
    }
    
    function getVotingRound() public view returns (uint) {
        return votingRound;
    }
    
    function recount() public _verifyRole(Role.Chairman) {
        munContract.recount();
        votingRound++;
        yesLocal = 0;
        noLocal = 0;
        blankLocal = 0;
        invalidLocal = 0;
        needsRecount = false;
    }
    
    function inputControlNumbers(uint pollingCards, uint powerOfAttorneys, uint voterPasses) public _verifyRole(Role.Chairman) {
        collectedPollingCardCount = pollingCards;
        collectedPowerOfAttorneyCount = powerOfAttorneys;
        collectedVoterPassCount = voterPasses;
        ControlNumbersAdded(pollingCards, powerOfAttorneys, voterPasses);
    }
    
    function verifyVotes(uint yesCount, uint noCount, uint blankCount, uint invalidCount) public _verifyRole(Role.Chairman) returns (bool yesVerified, bool noVerified, bool blankVerified, bool invalidVerified) {
        if (verificationSuccessful) {
            NotAllowed("Verification already happened and it was successful. Input disregarded.");
            return (true, true, true, true);
        }
        
        if (needsRecount) {
            NotAllowed("Recount necessary before new verification attempt.");
        }
        
        if (!beganCounting) {
            NotAllowed("Counting must begin first.");
        }
        
        if (!beganCounting || needsRecount) {
            VerificationAttempt(false, false, false, false);
            return (false, false, false, false);
        }
        
        beganCounting = false;
        yesVerified = (yesCount == yesLocal);
        noVerified = (noCount == noLocal);
        blankVerified = (blankCount == blankLocal);
        invalidVerified = (invalidCount == invalidLocal);
        
        VerificationAttempt(yesVerified, noVerified, blankVerified, invalidVerified);
        if (yesVerified && noVerified && blankVerified && invalidVerified) {
            verificationSuccessful = true;
        } else {
            needsRecount = true;
        }
        
        return (yesVerified, noVerified, blankVerified, invalidVerified);
    }
    
    // Returns the deviation of all votes against the number of collected cards
    function getDeviation() public view returns (uint) {
        int deviation = int(blankLocal + noLocal + yesLocal + invalidLocal) - int(collectedVoterPassCount + collectedPowerOfAttorneyCount + collectedPollingCardCount);
        
        if (deviation < 0) {
            deviation = deviation * -1;
        }
        
        return uint(deviation);
    }
    
    function signOff(string explanation) public _canSignOff() returns(bool) {
        if (getDeviation() != 0 && bytes(explanation).length <= 5) {
            NotAllowed("You should supply an explanation when a deviation occurs.");
            return false;
        }
        
        if (bytes(explanation).length > 140) {
            NotAllowed("Explanation is longer than 140 characters.");
            return false;
        } else if (getDeviation() != 0) {
            deviationExplanation = explanation;
        }
        
        Role role = Role(roles[msg.sender]);
        if (role == Role.Chairman) {
            signedOffChairmenCount++;
            if (signedOffChairmenCount >= signedInChairmenCount) {
                votingSessionClosed = true;
                VotingFinished(this);
            }
        }
        
        if (role == Role.Teller) {
            signedOffTellerCount++;
        }
        
        StaffSignedOff(msg.sender);
        return true;
    }
}