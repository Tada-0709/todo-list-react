pragma solidity ^0.5.0;

contract Task {

    uint tId;
    string private content;
    bool private completed;
    address payable createdBy;
    address payable completedBy;

    constructor(uint _tId, string memory _content, bool _completed, address payable _createdBy, address payable _completedBy) public payable {
        tId = _tId;
        content = _content;
        completed = _completed;
        createdBy = _createdBy;
        completedBy = _completedBy;
    }

    //getter and setter

    function setTaskId(uint _tId) public {
        tId = _tId;
    }

    function getTaskId() public view returns(uint) {
        return tId;
    }

    function setTaskContent(string memory _content) public {
        content = _content;
    }

    function getTaskContent() public view returns(string memory) {
        return content;
    }

    function setCreatedBy(address payable _createdBy) public {
        createdBy = _createdBy;
    }

    function getCreatedBy() public view returns(address payable) {
        return createdBy;
    }

    function setCompleted(bool _completed) public {
        completed = _completed;
    }

    function getCompleted() public view returns(bool) {
        return completed;
    }

    function setCompletedBy(address payable _completedBy) public {
        completedBy = _completedBy;
    }

    function getCompletedBy() public view returns(address payable) {
        return completedBy;
    }

}

