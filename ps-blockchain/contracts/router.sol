pragma solidity ^0.4.19;

import "./permissions.sol";

contract Router {
    address private owner;
    mapping (string => address) private pollingStationAddresses;
    
    function Router() public {
        owner = msg.sender;
    }
    
    function setAddress(string pollingStationId, address contractAddress) public _isOwner {
        pollingStationAddresses[pollingStationId] = contractAddress;
    }
    
    function getAddress(string pollingStationId) public view returns(address pollingStationAddress) {
        return pollingStationAddresses[pollingStationId];
    }
    
    modifier _isOwner() {
        if (tx.origin == owner) {
            _;
        }
    }
}