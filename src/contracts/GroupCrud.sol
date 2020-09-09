pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./User.sol";
import "./Group.sol";


contract GroupCrud {

    uint public groupCount;
    mapping(uint => Group) public groups;
    mapping(uint => User[]) public groupMembers;


    constructor() public {
        groupCount = 0;
        createGroup("Default group");
    }

    event groupCreated(
        uint gId,
        string groupName,
        uint numberOfMember
    );


    function createGroup(string memory _groupName) public {
        // Require valid content
        require(bytes(_groupName).length > 0);
        groups[groupCount] = new Group(groupCount, _groupName,0);
        groupCount ++;
        emit groupCreated(groupCount, _groupName, 0);
    }

    function getGroups() view public returns(uint[] memory, string[] memory){

        uint[] memory gids = new uint[](groupCount);
        string[] memory groupNames = new string[](groupCount);

        for(uint i = 0; i < groupCount; i++){
            Group group = groups[i];
            gids[i] = group.getId();
            groupNames[i] = group.getGroupName();
        }

        return(gids, groupNames);
    }

    function addMember(uint _gID, uint _userID, string memory _userName, address payable _userAddress) public{
        // Group ID must be existed
        require(_gID < groupCount);
        groupMembers[_gID].push(new User(_userID, _userName, _userAddress, "User"));

        uint numOfMember = groups[_gID].getNumberOfMember();
        groups[_gID].setNumberOfMember(numOfMember++);

    }

    function getMembers(uint _gID) view public returns(uint[] memory){

        uint totalMember = groups[_gID].getNumberOfMember();

        uint[] memory ids = new uint[](totalMember);

        for (uint i = 0; i < totalMember; i++) {

            User user = groupMembers[_gID][i];
            ids[i] = user.getId();

        }
        return (ids);

    }


}

