pragma solidity ^0.4.19;

import "./permissions.sol";
import "./municipality.sol";
import "./pollingstation.sol";

contract Router {
    address private owner;
    mapping (string => address) private pollingStationAddresses;
    mapping (address => string) private pollingStationIds;
    
    function Router() public {
        owner = msg.sender;
    }
    
    function setAddress(string pollingStationId, address contractAddress) public _isOwner {
        pollingStationAddresses[pollingStationId] = contractAddress;
        pollingStationIds[contractAddress] = pollingStationId;
    }
    
    function getPollingStationAddress(string pollingStationId) public view returns(address pollingStationAddress) {
        return pollingStationAddresses[pollingStationId];
    }
    
    function getPollingStationId(address pollingStationAddress) public view returns(string pollingStationId) {
        return pollingStationIds[pollingStationAddress];
    }
    
    function getMunicipalityAddress(string pollingStationId) public view returns(address municipalityAddress) {
        return PollingStation(getPollingStationAddress(pollingStationId)).getMunicipalityAddress();
    }
    
    function getUacAddress(string pollingStationId) public view returns(address userActivationAddress) {
        return PollingStation(getPollingStationAddress(pollingStationId)).getUacAddress();
    }
    
    modifier _isOwner() {
        if (tx.origin == owner) {
            _;
        }
    }
}