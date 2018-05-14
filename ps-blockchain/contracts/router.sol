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