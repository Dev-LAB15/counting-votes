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
    event SignedOff(address staff, bool success, string message);
    event VerificationDone(bool success, string message, bool needsRecount, bool yes, bool no, bool blank, bool invalid);
    event ControlNumbersAdded(uint256 pollingCards, uint256 powerOfAttorneys, uint256 voterPasses);
    event VotingSessionBegan(address pollingStation);
    event VoteCounted(uint voteCode, bool success, string message);
    
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

    modifier _isNotVerified() {
        if (!verificationSuccessful) {
            _;
        } else {
            VoteCounted(0, false, "Verification already happened, vote counting is closed.");
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
            SignedOff(msg.sender, false, "Can only sign off during open voting session.");
            return;
        }
        
        if (!verificationSuccessful) {
            return;
        }
        
        if (signedOffStaff[msg.sender] != 0) {
            SignedOff(msg.sender, false, "Staff memeber already signed off.");
            return;
        }
        
        Role currRole = Role(roles[msg.sender]);
        
        if (currRole == Role.Teller && signedInTellers[msg.sender] != true) {
            SignedOff(msg.sender, false, "Only signed in Tellers can sign off.");
            return;
        }
        
        if (currRole == Role.Chairman && signedInChairmen[msg.sender] != true) {
            SignedOff(msg.sender, false, "Only signed in Chairmen can sign off.");
            return;
        }
        
        if ((currRole == Role.Chairman && signedOffChairmenCount < signedInChairmenCount && signedInTellerCount > 0) || 
            (currRole == Role.Teller && signedOffTellerCount < signedInTellerCount && signedOffChairmenCount == 0)) {
            _;
        } else {
            SignedOff(msg.sender, false, "All Tellers must sign off, then chairman can sign off. No other role can sign off.");
        }
    }
    
    function getMunicipalityAddress() public view returns (address municipalityAddress) {
        return munContract;
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
        return !votingSessionClosed;
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

    function getSignedInTellers() public view returns(uint8) {
        return signedInTellerCount;
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
        VotingSessionBegan(this);
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
    
    function yes() public _isSessionOpen() _isNotVerified() _verifyRole(Role.Chairman) {
        beganCounting = true;
        yesLocal++;
        munContract.voteYes();
        VoteCounted(1, true, "");
    }
    
    function no() public _isSessionOpen() _isNotVerified() _verifyRole(Role.Chairman) {
        beganCounting = true;
        noLocal++;
        munContract.voteNo();
        VoteCounted(2, true, "");
    }
    
    function blank() public _isSessionOpen() _isNotVerified() _verifyRole(Role.Chairman) {
        beganCounting = true;
        blankLocal++;
        munContract.voteBlank();
        VoteCounted(3, true, "");
    }
    
    function invalid() public _isSessionOpen() _isNotVerified() _verifyRole(Role.Chairman) {
        beganCounting = true;
        invalidLocal++;
        munContract.voteInvalid();
        VoteCounted(4, true, "");
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
        munContract.inputControlNumbers(pollingCards, powerOfAttorneys, voterPasses);
        ControlNumbersAdded(pollingCards, powerOfAttorneys, voterPasses);
    }
    
    function verifyVotes(uint yesCount, uint noCount, uint blankCount, uint invalidCount) public _verifyRole(Role.Chairman) {
        if (verificationSuccessful) {
            VerificationDone(verificationSuccessful, "Verification already happened and it was successful. Input disregarded.", false, false, false, false, false);
            return;
        }
        
        if (needsRecount) {
            VerificationDone(verificationSuccessful, "Recount necessary before new verification attempt.", needsRecount, false, false, false, false);
            return;
        }
        
        if (!beganCounting) {
            VerificationDone(verificationSuccessful, "Counting must begin first.", true, false, false, false, false);
            return;
        }
        
        beganCounting = false;
        bool yesVerified = (yesCount == yesLocal);
        bool noVerified = (noCount == noLocal);
        bool blankVerified = (blankCount == blankLocal);
        bool invalidVerified = (invalidCount == invalidLocal);
        if (yesVerified && noVerified && blankVerified && invalidVerified) {
            verificationSuccessful = true;
            VerificationDone(verificationSuccessful, "", needsRecount, yesVerified, noVerified, blankVerified, invalidVerified);
        } else {
            needsRecount = true;
            VerificationDone(verificationSuccessful, "Needs Recount.", needsRecount, yesVerified, noVerified, blankVerified, invalidVerified);
        }
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
        Role role = Role(roles[msg.sender]);
        if (role == Role.Teller) {
            signedOffTellerCount++;
            signedOffStaff[msg.sender] = 1;
            SignedOff(msg.sender, true, "");
        } else if (role == Role.Chairman) {
            if (signedInTellerCount != signedOffTellerCount) {
                SignedOff(msg.sender, false, "All tellers must signoff first");
                return false;
            }
            if (getDeviation() != 0 && bytes(explanation).length <= 5) {
                SignedOff(msg.sender, false, "You should supply an explanation when a deviation occurs.");
                return false;
            }

            if (bytes(explanation).length > 140) {
                SignedOff(msg.sender, false, "Explanation is longer than 140 characters.");
                return false;
            } else if (getDeviation() != 0) {
                deviationExplanation = explanation;
            }
            signedOffChairmenCount++;
            if (signedOffChairmenCount >= signedInChairmenCount) {
                votingSessionClosed = true;
                signedOffStaff[msg.sender] = 1;
                SignedOff(msg.sender, true, "");
                VotingFinished(this);
                return true;
            }
        } else {
            SignedOff(msg.sender, false, "Role violation.");
        }
        return false;                
    }

    function canSubmit() public view returns (bool) {
        return signedOffTellerCount > 0 && signedInTellerCount == signedOffTellerCount && signedOffChairmenCount > 0 && signedOffChairmenCount == signedInChairmenCount;
    }
}