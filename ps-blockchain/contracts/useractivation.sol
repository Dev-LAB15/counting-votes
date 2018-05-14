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

contract UserActivation {

    address private owner;
    string[] private emailAddresses;
    mapping (string => bool) private usedAddresses;
    mapping (string => uint8) private roles;
    
    event NotAllowed();
    
    function UserActivation() public {
        owner = msg.sender;
    }

    //email do client -> wallet address
    modifier _isOwner() {
        if (tx.origin == owner) {
            _;
        }
    }

    function addEmail(string email, uint8 assignedUserRole) public _isOwner() {
        
        emailAddresses.push(email);
        roles[email] = assignedUserRole;
        usedAddresses[email] = false;
    }
    
    function getRoleId(string email) public _isOwner view returns(uint8) {
        return roles[email];
    }
    
    function setUsedEmail(string email) public _isOwner {
        usedAddresses[email] = true;
    }
    
    function getUsedEmail(string email) public _isOwner view returns(bool) {
        return usedAddresses[email];
    }
}