pragma solidity ^0.5.0;

contract Group{

    uint gId;
    string private groupName;
    uint public numberOfMember;
    uint public numberOfTask;

    constructor(uint _gId, string memory _groupName, uint _numberOfMember, uint _numberOfTask) public{
        gId = _gId;
        groupName = _groupName;
        numberOfMember = _numberOfMember;
        numberOfTask = _numberOfTask;
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

    function setNumberOfTask(uint _numberOfTask) public{
        numberOfTask =_numberOfTask;
    }

    function getNumberOfTask() view public returns(uint){
        return numberOfTask;
    }

    function getGroupAddress() view public returns(address){
        return address(this);
    }


}
