pragma solidity ^0.5.0;

contract Group{

    uint gId;
    string private groupName;
    uint private numberOfMember;

    constructor(uint _gId, string memory _groupName, uint _numberOfMember) public{
        gId = _gId;
        groupName = _groupName;
        numberOfMember = _numberOfMember;
    }

    function setId(uint _gId) public {
        gId = _gId;
    }

    function getId() public view returns(uint) {
        return gId;
    }

    function setGroupName(string memory _groupName) public{
        groupName = _groupName;
    }

    function getGroupName() view public returns(string memory){
        return groupName;
    }

    function setNumberOfMember(uint _numberOfMember) public{
        numberOfMember =_numberOfMember;
    }

    function getNumberOfMember() view public returns(uint){
        return numberOfMember;
    }


}
