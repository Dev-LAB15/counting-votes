pragma solidity ^0.4.19;
contract Email {
    address private owner;
    function Email() {
        owner = msg.sender;
    }
    string[] public EmailAddresses;
    //email do client -> wallet address
    modifier _isOwner(){
        if (msg.sender == owner) {
            _;
        }
    }
    function AddEmail(string email) 
    _isOwner()
    public
    {
        EmailAddresses.push(email);
    }
    
    function getOwner() public view returns (address a)
    {
        return owner;
    }
}
contract Permissions {
    mapping (address => string) Roles;
    // 0x0000 -> Chairman
}
contract municipality {
    uint128 public yes = 0;
    uint128 public no = 0;
    uint128 public invalid = 0;
    uint128 public blank = 0;
    
    uint128 public duplicity_error = 0;
    mapping (uint128 => uint128) whos_error;
    
    mapping (uint => bool) public cards_claimed;
    uint private cards_claimed_count = 0;

    event VoterAlreadyRecorded(uint id, uint how_many);
    event VoterCleared(uint id);
    
    event YesVoted();
    event NoVoted();
    event InvalidVoted();
    event BlankVoted();

    function VoteYes() public {
        yes += 1;
        YesVoted();
    }
    
    function VoteNo() public {
        no++;
        NoVoted();
    }
    
    function VoteBlank() public {
        blank++;
        BlankVoted();
    }
    
    function VoteInvalid() public {
        invalid++;
        InvalidVoted();
    }
    
    function userVoted(uint128 id)
        internal
        view
        returns (bool voted) {
            return cards_claimed[id];
    }
    
    modifier _noRevote(uint128 id) {
        if (cards_claimed[id]){
            whos_error[id]++;
            duplicity_error++;
            VoterAlreadyRecorded(id, whos_error[id]);
        }
        else{
            _;
        }
    }
    
    function RecordVoter(uint128 id) _noRevote(id) public {
        cards_claimed[id] = true;
        cards_claimed_count++;
        VoterCleared(id);
    }
    
    function IsValid() public view returns (bool res) {
        res = ((blank + no + yes + invalid) == cards_claimed_count);
    }
    
    function GetUser(uint id) public view returns (bool) {
        return cards_claimed[id];
    }
    
}

contract PollStation is Permissions {
    uint public yeslocal = 0;
    uint public nolocal = 0;
    uint public invalidlocal = 0;
    uint public blanklocal = 0;
    
    uint private local_cards_claimed_count = 0;
    
    municipality super;
    
    event VoterAlreadyRecorded(uint id);
    event VoterCleared(uint id);
    
    function PollStation(address maddress) public {
        super = municipality(maddress);
    }
    
    modifier _noRevote(uint128 id) {
        if (super.GetUser(id))
            VoterAlreadyRecorded(id);
        else {
            VoterCleared(id);
            _;
        }
    }
    
    modifier _verifyRole(string role) {
        if (keccak256(Roles[msg.sender]) == keccak256(role)) {
            _;
        }
    }
    
    // Checks if the number of all votes matches the number of recorded cards
    // Locally
    function IsValid() public view returns (bool res) {
        res = ((blanklocal + nolocal + yeslocal + invalidlocal) == local_cards_claimed_count);
    }
    
    function RecordVotingCard(uint128 id) 
    _verifyRole("chairman")
    _noRevote(id) 
    public {
        local_cards_claimed_count++;
        super.RecordVoter(id);
    }
    
    function Yes() 
    _verifyRole("chairman")
    public 
    {
        yeslocal++;
        super.VoteYes();
    }
    
    function No()
    _verifyRole("chairman")
    public
    {
        nolocal++;
        super.VoteNo();
    }
    
    function Blank()
    _verifyRole("chairman")
    public
    {
        blanklocal++;
        super.VoteBlank();
    }
    
    function Invalid()
    _verifyRole("chairman")
    public
    {
        invalidlocal++;
        super.VoteInvalid();
    }
    
    function sign()
    _verifyRole("chairman")
    public 
    {
        
    }
}